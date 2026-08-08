# Session HUD & Reset Implementation Plan

## Overview

Add a session HUD to EqShift showing the running score (equations solved this session), the move count on the current equation, and a live elapsed-time stopwatch for the current equation — plus a Reset action that restores the current equation's board layout and zeroes its moves/time, without touching the score. Implements FR-007 through FR-010.

## Current State Analysis

All game state lives in `App.tsx` via three `useState` hooks: `puzzleIndex`, `state` (the `EquationState`), and `solved` (`src/App.tsx:12-14`). `handleMove` applies every attempted move unconditionally via `applyMove`, regardless of whether the result is arithmetically correct (`src/App.tsx:16-19`) — so a moves counter can hook directly onto this function without any new validity branching. When a move produces a true equation, `solved` is set to `true` and a `window.setTimeout` (`SOLVED_ADVANCE_DELAY_MS = 1000`) later advances to the next puzzle, resetting `state` and `solved` in one batch (`src/App.tsx:20-28`). `EquationBoard` already accepts a `disabled` prop that locks input during that reward window (`src/App.tsx:33`, `src/game/EquationBoard.tsx:27,35`).

There is no timer, interval, or persistence anywhere in the codebase today. `vitest.config.ts` runs tests in a plain `node` environment (`vitest.config.ts:5`) — there is no `jsdom` or `@testing-library/react` installed, so existing tests (`equation.test.ts`, `puzzles.test.ts`, `segments.test.ts`) cover pure logic only, never rendered components.

## Desired End State

While playing, the player sees three live readouts: session score (+1 per solved equation), moves made on the current equation (every attempt, correct or not), and elapsed time on the current equation formatted as `m:ss`. Both the moves and time readouts freeze at their final values during the ~1s reward-celebration window and reset to `0` the instant the next equation appears. A Reset button restores the current equation's board to its original segment layout and zeroes its moves/time counters — score is untouched. Reset is disabled during the reward-celebration window, matching the board's existing `disabled` behavior.

Verification: play through several puzzles and confirm score increments once per solve, moves/time track and freeze/reset correctly across the puzzle-advance boundary, and Reset restores the board + counters without affecting score.

### Key Discoveries:

- `handleMove` is the single choke point for every move attempt — moves counting and score increment both attach here (`src/App.tsx:16-29`).
- The puzzle-advance `setTimeout` callback is the single place that currently resets per-equation state (`src/App.tsx:22-27`); moves/time resets must happen in that same callback, not a separately-keyed effect, to avoid a stale-counter flash before the next equation's counters zero out.
- `RewardBanner` (`src/game/RewardBanner.tsx`) establishes the pattern for small, focused presentational components — `SessionHud` follows the same shape.
- No `jsdom`/RTL in the test toolchain (`vitest.config.ts:5`, `package.json` devDependencies) — automated coverage in this plan is limited to pure logic (a time formatter); the HUD's rendering, timer ticking, and Reset wiring are verified manually.

## What We're NOT Doing

- No persistence of score (or anything else) across page reloads — score lives in React state only and resets on refresh.
- Reset does not touch the score counter — only the current equation's board, moves, and time.
- No full "restart session" affordance beyond a page reload.
- No new test infrastructure (`jsdom`, `@testing-library/react`) — out of scope for this feature's size.
- No changes to puzzle cycling/ordering, move validation, or the reward-banner mechanic itself.
- No sound effects, animations, or visual treatments beyond the existing retro-green styling conventions.

## Implementation Approach

Keep all new state (`score`, `moves`, `elapsedSeconds`) inline in `App.tsx` alongside the existing `puzzleIndex`/`state`/`solved`, matching the codebase's current convention of a single component owning all session state — no new hook or store. A new `SessionHud` component (sibling to `RewardBanner`) renders the three readouts and, from Phase 2, the Reset button. A `setInterval`-driven effect ticks `elapsedSeconds` once per second while the current equation is unsolved, and is cleaned up/restarted whenever `solved` toggles. A single pure helper, `formatElapsed`, converts seconds to `m:ss` and is unit tested; everything else is verified manually per the "What We're NOT Doing" testing-scope decision.

## Critical Implementation Details

### Timing & lifecycle

The timer effect must key off `solved`: run `setInterval` while `solved` is `false`, and let the effect's cleanup (triggered when `solved` flips to `true`) clear the interval — this freezes the display at the winning values during the reward delay. Do not add a second effect keyed on `puzzleIndex` for resetting `moves`/`elapsedSeconds`; instead, add `setMoves(0)` and `setElapsedSeconds(0)` directly inside the existing puzzle-advance `setTimeout` callback (`src/App.tsx:22-27`) and inside the new `handleReset` (Phase 2), so the reset always lands in the same synchronous state batch as the board reset — avoiding a frame where old counters are visible against the new board.

## Phase 1: Session HUD (score, moves, timer)

### Overview

Introduce the score/moves/elapsedSeconds state, the timer effect, the `formatElapsed` helper, and a new `SessionHud` component that displays all three read-only.

### Changes Required:

#### 1. Elapsed-time formatter

**File**: `src/game/time.ts` (new)

**Intent**: Pure function converting a whole-second count into a `m:ss` display string, so the HUD and its test don't duplicate formatting logic.

**Contract**: `formatElapsed(totalSeconds: number): string` — minutes unpadded, seconds zero-padded to 2 digits (e.g. `0` → `"0:00"`, `65` → `"1:05"`).

#### 2. Formatter tests

**File**: `src/game/time.test.ts` (new)

**Intent**: Lock down the `m:ss` formatting contract, colocated next to `time.ts` following the existing `*.test.ts` convention (`src/game/equation.test.ts`).

**Contract**: `describe('formatElapsed', ...)` covering zero, sub-10-seconds padding, and a minute rollover.

#### 3. Session HUD component

**File**: `src/game/SessionHud.tsx` (new)

**Intent**: Presentational component rendering the three stat readouts, following the same small-focused-component shape as `RewardBanner.tsx`.

**Contract**: `SessionHud({ score, moves, elapsedSeconds }: { score: number; moves: number; elapsedSeconds: number })` renders the formatted values (using `formatElapsed` for the time readout). No internal state.

#### 4. HUD styling

**File**: `src/game/game.css`

**Intent**: Style the new `.session-hud` readouts consistent with the existing retro-green palette (`#39ff6a` glow, dark background) already used for segments and the reward banner.

**Contract**: Append rules scoped to a `.session-hud` root and its stat children — do not modify existing selectors.

#### 5. Wire state, moves, score, and the timer into App

**File**: `src/App.tsx`

**Intent**: Add `score`, `moves`, `elapsedSeconds` state; increment `moves` on every `handleMove` call; increment `score` when a move solves the equation; reset `moves`/`elapsedSeconds` to `0` in the existing puzzle-advance timeout callback; add the ticking effect described in "Critical Implementation Details"; render `<SessionHud>`.

**Contract**: `handleMove` gains an unconditional `setMoves((m) => m + 1)` before the existing `isEquationTrue` check, and `setScore((s) => s + 1)` inside the true-branch alongside `setSolved(true)`. A new `useEffect` depends on `[solved]`, running `window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000)` while `solved` is `false` and clearing it on cleanup. The puzzle-advance `setTimeout` callback additionally calls `setMoves(0)` and `setElapsedSeconds(0)`.

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npm run test`
- Type check passes: `npm run build`
- Lint passes: `npm run lint`

#### Manual Verification:

- Score starts at 0 and increments by exactly 1 each time an equation is solved, across multiple puzzles in a row
- Moves counter increments on every move attempt on the current equation, whether or not the resulting equation is correct
- Elapsed time visibly ticks once per second while playing
- Moves and elapsed time freeze at their final values during the ~1s reward-celebration window, then both reset to 0 the moment the next equation appears
- HUD readouts are legible and match the existing retro-green visual style

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Reset action

### Overview

Add a Reset control to the HUD that restores the current equation's board to its initial layout and zeroes its moves/time, disabled during the reward-celebration window.

### Changes Required:

#### 1. Reset button in the HUD

**File**: `src/game/SessionHud.tsx`

**Intent**: Extend the HUD with a Reset control the player can trigger at any time the current equation isn't mid-celebration.

**Contract**: `SessionHud` gains `onReset: () => void` and `resetDisabled: boolean` props; renders a `<button>` calling `onReset` on click, `disabled={resetDisabled}`.

#### 2. Reset button styling

**File**: `src/game/game.css`

**Intent**: Style the Reset button consistent with the existing retro palette, including a visibly inert look when disabled.

**Contract**: Append rules scoped to the new reset-button class; do not modify existing selectors.

#### 3. Reset handler in App

**File**: `src/App.tsx`

**Intent**: Restore the current puzzle's initial board layout and zero its moves/time on demand, without touching score, `puzzleIndex`, or `solved`.

**Contract**: New `handleReset` sets `state` to `puzzles[puzzleIndex].initial`, and calls `setMoves(0)` and `setElapsedSeconds(0)`. Passed to `<SessionHud>` as `onReset={handleReset}` and `resetDisabled={solved}`.

### Success Criteria:

#### Automated Verification:

- Unit tests pass: `npm run test`
- Type check passes: `npm run build`
- Lint passes: `npm run lint`

#### Manual Verification:

- Clicking Reset restores the belka/segment layout to the puzzle's original position
- Clicking Reset zeroes the moves counter and elapsed time for the current equation
- Score is unaffected by Reset
- Reset button is disabled and inert during the ~1s reward-celebration window after solving an equation

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- `formatElapsed`: zero seconds, sub-10-second padding, minute rollover.

### Integration Tests:

- None — no test infrastructure exists for rendering `App`/`SessionHud` (no `jsdom`/RTL); deferred to manual verification per the "What We're NOT Doing" scope decision.

### Manual Testing Steps:

1. Load the app, solve a puzzle, confirm score becomes 1 and the next equation loads with moves/time reset to 0.
2. Make several incorrect moves on an equation and confirm the moves counter increments each time.
3. Watch the elapsed-time readout tick once per second during play.
4. Solve an equation and, during the ~1s celebration window, confirm moves/time hold their final values and the Reset button is disabled.
5. Make some moves, click Reset, and confirm the board returns to the puzzle's original layout with moves/time back at 0 and score unchanged.

## Performance Considerations

A single 1-second `setInterval` and three small state updates per move are negligible next to the NFR's <100ms move-feedback budget — no measurable impact expected.

## Migration Notes

None — new, additive UI state with no existing data to migrate.

## References

- PRD: `context/foundation/prd.md` (FR-007–FR-010)
- Roadmap slice: `context/foundation/roadmap.md` (S-02: session-hud-and-reset)
- Prior implementation: `src/App.tsx`, `src/game/RewardBanner.tsx`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Session HUD (score, moves, timer)

#### Automated

- [ ] 1.1 Unit tests pass: `npm run test`
- [ ] 1.2 Type check passes: `npm run build`
- [ ] 1.3 Lint passes: `npm run lint`

#### Manual

- [ ] 1.4 Score starts at 0 and increments by exactly 1 each time an equation is solved, across multiple puzzles in a row
- [ ] 1.5 Moves counter increments on every move attempt on the current equation, whether or not the resulting equation is correct
- [ ] 1.6 Elapsed time visibly ticks once per second while playing
- [ ] 1.7 Moves and elapsed time freeze at their final values during the ~1s reward-celebration window, then both reset to 0 the moment the next equation appears
- [ ] 1.8 HUD readouts are legible and match the existing retro-green visual style

### Phase 2: Reset action

#### Automated

- [ ] 2.1 Unit tests pass: `npm run test`
- [ ] 2.2 Type check passes: `npm run build`
- [ ] 2.3 Lint passes: `npm run lint`

#### Manual

- [ ] 2.4 Clicking Reset restores the belka/segment layout to the puzzle's original position
- [ ] 2.5 Clicking Reset zeroes the moves counter and elapsed time for the current equation
- [ ] 2.6 Score is unaffected by Reset
- [ ] 2.7 Reset button is disabled and inert during the ~1s reward-celebration window after solving an equation
