# Core Equation-Solving Loop Implementation Plan

## Overview

Build EqShift's north-star loop (roadmap S-01): a player sees a mathematically wrong equation built from digit/operator segments, moves exactly one segment, and the game silently validates the result — a correct move gives a brief reward and advances to the next equation, an incorrect move gives no feedback at all. This plan covers the domain logic and a minimal interim UI only; the retro-90s visual treatment is an explicitly separate later stage (pen.dev), per `context/foundation/shape-notes.md` → `## Forward: tech-stack`.

## Current State Analysis

`src/App.tsx` is still the untouched Vite+React template (counter button, Vite/React links) — there is no existing game code, data model, or component to build on. `package.json` has no test runner configured. This is a from-scratch build against a clean scaffold.

## Desired End State

Running `npm run dev` shows a single equation rendered as lit/unlit segments (digits + one operator + a fixed `=`). Clicking a lit segment selects it; clicking an unlit slot moves the selected segment there. If the resulting equation is mathematically true, a brief visual reward plays and the board advances to the next equation in a 3-equation cycle (looping back to the first after the third); if false, nothing happens beyond the segment having moved, and the player can keep trying. Verify via: `npm run build`, `npm run lint`, `npx vitest run`, and manual play-through of all three puzzles in the browser.

### Key Discoveries:

- The PRD's seed example (`context/foundation/shape-notes.md` line 39) moves a segment *out of an operator and into a digit*, which rules out reusing a single 7-segment schema for everything — operators need their own, smaller segment schema (this plan defines digits as 7 slots, operators as 2 slots: horizontal/vertical, since `-` is one horizontal stick and `+` is that same stick plus a vertical one).
- `=` never appears as a source or target in the seed example or in any FR, and structurally the equation string must always divide into `left op right = result`; this plan treats `=` as a fixed, non-interactive glyph rather than a movable cell. This is a modeling call, not a user-facing requirement — flagged here since it constrains what "move a segment" can mean everywhere else in the plan.
- FR-004's "basic arithmetic validation" combined with the Business Logic section's binary true/false outcome means an unrecognized segment pattern (one matching no digit or operator) does not need special-case handling — it simply fails equation validity like any other wrong state, consistent with FR-006's "no feedback on wrong moves."

## What We're NOT Doing

- Score counter, move counter, elapsed-time display, or the reset button (FR-007–FR-010, roadmap slice S-02) — out of scope for this slice.
- localStorage persistence of any kind — state is in-memory only and resets on page reload; S-02 owns whatever persistence its HUD needs.
- Retro-90s visual styling, theming, or the pen.dev UI pass — this slice uses a minimal LCD-style placeholder (plain lit/unlit segment shapes) by design.
- Drag-and-drop interaction — click-to-select/click-to-place only.
- Multi-digit operands, a generic/variable equation shape, an equation generator, or an expanded equation library — the equation shape is hardcoded to one digit + operator + one digit + `=` + one digit, with exactly 3 hand-authored starter equations.
- Any constraint on which segment can move to which slot based on physical orientation (e.g. preventing a horizontal stick from filling a vertical slot) — FR-002/003 and the Business Logic section only require validating the *end state*, not the physical plausibility of the move itself.

## Implementation Approach

Build bottom-up: a pure, unit-tested domain layer first (segment/glyph model, equation validity, the 3 starter puzzles), then a minimal interactive board wired to it, then the win-detection/reward/cycling loop on top. Each phase is independently runnable and verifiable before the next begins.

## Critical Implementation Details

- **`=` is structurally fixed.** It renders as two static horizontal bars and is never a selectable source or target. Every other cell (both operands, the operator, and the result digit) is a normal move source/target. This isn't stated explicitly in any FR — it's inferred from the seed example and the fact that the equation string must stay parseable as `left op right = result`. Get this wrong (e.g. making `=` movable) and equation parsing breaks.
- **`applyMove` trusts its caller.** The click-to-select/click-to-place interaction already guarantees a move's `from` slot is lit and `to` slot is unlit before `applyMove` is ever called (Phase 2 enforces this at the UI layer). `applyMove` itself should not re-validate these preconditions — there is no code path that can call it with an invalid move, so defensive checks here would be handling an impossible scenario.

## Phase 1: Domain Model & Content

### Overview

Pure TypeScript: segment/glyph schemas for digits and operators, equation validity logic, and the 3 hand-verified starter puzzles — no UI, no React component changes. Includes setting up Vitest.

### Changes Required:

#### 1. Test runner setup

**File**: `package.json`, `vitest.config.ts` (new)

**Intent**: Add Vitest as a dev dependency with a `test` script so the domain layer's pure functions have automated coverage, per the confirmed testing scope (unit tests for validation logic only, no component tests).

**Contract**: `npm test` (or `npm run test`) runs `vitest run` and exits non-zero on failure. No React Testing Library or jsdom environment needed since Phase 1 has no components under test.

#### 2. Segment & glyph model

**File**: `src/game/segments.ts` (new)

**Intent**: Define the two segment schemas (digit cells have 7 slots, operator cells have 2) and the lookup tables that translate a set of lit slots into a recognized digit (0–9) or operator (`+`/`-`), returning `null` for any unrecognized pattern.

**Contract**:
```ts
export type DigitSlot = 'top' | 'topLeft' | 'topRight' | 'middle' | 'bottomLeft' | 'bottomRight' | 'bottom'
export type OperatorSlot = 'horizontal' | 'vertical'

export function digitFromSegments(lit: ReadonlySet<DigitSlot>): number | null
export function operatorFromSegments(lit: ReadonlySet<OperatorSlot>): '+' | '-' | null
```
Digit table follows the standard 7-segment display encoding (e.g. `0` lights everything but `middle`; `1` lights only `topRight`/`bottomRight`; `8` lights all 7 — matches the segment counts named in `shape-notes.md`: 8→7 segments, 1→2 segments, 2→5 segments). Operator table: `{horizontal}` → `-`, `{horizontal, vertical}` → `+`; any other combination (including empty or vertical-only) → `null`.

#### 3. Equation state & validity

**File**: `src/game/equation.ts` (new)

**Intent**: Model one equation's mutable state as 4 addressable cells (`left`, `operator`, `right`, `result`), provide the move-application function, and provide the true/false validity check that drives the win condition.

**Contract**:
```ts
export type CellKey = 'left' | 'operator' | 'right' | 'result'
export type SlotRef = { cell: CellKey; slot: DigitSlot | OperatorSlot }
export type EquationState = {
  left: ReadonlySet<DigitSlot>
  operator: ReadonlySet<OperatorSlot>
  right: ReadonlySet<DigitSlot>
  result: ReadonlySet<DigitSlot>
}

export function applyMove(state: EquationState, from: SlotRef, to: SlotRef): EquationState
export function isEquationTrue(state: EquationState): boolean
```
`isEquationTrue` resolves all 4 cells via `digitFromSegments`/`operatorFromSegments`; if any resolves to `null`, returns `false`; otherwise evaluates `left <operator> right === result` using ordinary arithmetic. `=` is not part of `EquationState` — it is a fixed glyph the UI renders alongside the state, never touched by `applyMove`.

#### 4. Starter puzzles

**File**: `src/game/puzzles.ts` (new)

**Intent**: Provide the 3 hand-authored starting equations and, for each, the exact single-segment move that solves it — used both by the game loop (Phase 3) and by the content-verification tests below.

**Contract**: An ordered array of 3 `{ initial: EquationState, solvingMove: { from: SlotRef; to: SlotRef } }` entries, cycled in order (index wraps to 0 after the last). The 3 puzzles, verified by hand against the segment tables above:
1. `5+1=8` → move the operator's `vertical` segment to `left`'s `topRight` → `9-1=8` (9−1=8 ✓)
2. `3+6=3` → move the operator's `vertical` segment to `left`'s `topLeft` → `9-6=3` (9−6=3 ✓)
3. `6-3=9` → move `result`'s `topRight` segment to `left`'s `topRight` → `8-3=5` (8−3=5 ✓)

Each starting equation must independently resolve to valid (non-`null`) glyphs in every cell — the puzzle is meant to look wrong, not broken.

#### 5. Domain unit tests

**File**: `src/game/segments.test.ts`, `src/game/equation.test.ts`, `src/game/puzzles.test.ts` (new)

**Intent**: Lock in the two riskiest pieces of hand-authored data — the digit/operator lookup tables and the 3 puzzle definitions — with automated checks, since a typo in either is easy to make and hard to eyeball-catch.

**Contract**: `segments.test.ts` round-trips all 10 digits and both operators through their tables. `equation.test.ts` covers `isEquationTrue` for a known-true and a known-false state, plus one `null`-glyph (unrecognized pattern) case. `puzzles.test.ts` asserts, for each of the 3 puzzles: `isEquationTrue(initial)` is `false`; `isEquationTrue(applyMove(initial, solvingMove.from, solvingMove.to))` is `true`; and the move touches exactly one segment (`from`'s slot was lit and becomes unlit, `to`'s slot was unlit and becomes lit, nothing else changes).

### Success Criteria:

#### Automated Verification:

- Type checking passes: `npm run build`
- Linting passes: `npm run lint`
- Domain unit tests pass: `npx vitest run`

---

## Phase 2: Interactive Equation Board

### Overview

Render an `EquationState` as clickable lit/unlit segments and wire up click-to-select/click-to-place, replacing the Vite template in `App.tsx`. Still no win-condition wiring — moving a segment updates the board but nothing checks correctness yet.

### Changes Required:

#### 1. Segment shape component

**File**: `src/game/Segment.tsx` (new)

**Intent**: Render a single segment (a digit slot or operator slot) as a lit or unlit shape; clicking it reports the click up to the parent rather than owning any state itself.

**Contract**: Props take the slot's lit/unlit boolean, a "selected" boolean (for the currently-picked-up segment), and an `onClick` callback. Purely presentational — no internal state.

#### 2. Equation board component

**File**: `src/game/EquationBoard.tsx` (new)

**Intent**: Render the 4 cells of an `EquationState` plus the fixed `=` glyph in equation order, and implement the click-to-select/click-to-place interaction: clicking a lit segment selects it (clicking it again deselects; clicking a different lit segment switches the selection to it); clicking an unlit segment while one is selected calls `applyMove` and clears the selection; clicking an unlit segment with nothing selected does nothing. The `=` glyph renders as two static bars with no click handler.

**Contract**: Props: `state: EquationState`, `onMove: (from: SlotRef, to: SlotRef) => void`. The board owns only the transient "currently selected slot" UI state — the `EquationState` itself is owned by the caller (App, wired up in Phase 3).

#### 3. Wire into App

**File**: `src/App.tsx`

**Intent**: Replace the Vite template contents with `EquationBoard`, holding the current puzzle's `EquationState` in React state and passing it down.

**Contract**: For this phase, initialize state from `puzzles[0].initial` and update it via `applyMove` on every `onMove` call — no validity check or advancement yet (that's Phase 3).

### Success Criteria:

#### Automated Verification:

- Type checking passes: `npm run build`
- Linting passes: `npm run lint`

#### Manual Verification:

- `npm run dev` shows the first puzzle (`5+1=8`) as recognizable lit/unlit digit and operator shapes
- Clicking a lit segment visibly selects it; clicking it again deselects it
- Clicking an unlit segment while one is selected moves it there (source goes dark, target lights up) and clears the selection
- Clicking an unlit segment with nothing selected has no effect
- The `=` glyph is always visible and never responds to clicks

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Win Loop & Puzzle Cycling

### Overview

Add automatic validation after every move: a correct move plays a brief reward and advances to the next puzzle in the cycle; an incorrect move does nothing beyond the segment having relocated.

### Changes Required:

#### 1. Game loop wiring

**File**: `src/App.tsx`

**Intent**: After each `applyMove`, check `isEquationTrue` on the resulting state. If true, show a brief reward (e.g. a highlight/flash plus short text) for roughly one second, then load `puzzles[(currentIndex + 1) % puzzles.length].initial` and clear the reward state. If false, just commit the moved state as-is — no message, no reversion, the player can keep making moves on the same puzzle indefinitely.

**Contract**: Reward display and puzzle advancement are time-gated (e.g. via `setTimeout`), not another player action — the transition to the next puzzle happens automatically. `currentIndex` state tracks position in the 3-puzzle cycle and wraps with modulo.

#### 2. Reward feedback

**File**: `src/game/RewardBanner.tsx` (new) or inline in `App.tsx`

**Intent**: A minimal visual confirmation (color flash and/or short text) shown only while a solved equation is displayed, before the next puzzle loads.

**Contract**: Purely presentational, driven by a boolean/enum "solved" flag from the parent — no independent state or timers of its own (the parent owns the delay).

### Success Criteria:

#### Automated Verification:

- Type checking passes: `npm run build`
- Linting passes: `npm run lint`

#### Manual Verification:

- Performing puzzle 1's solving move (`5+1=8` → operator vertical segment to right digit's topRight) triggers the reward, then the board advances to puzzle 2 (`3+6=3`)
- Solving puzzle 2 advances to puzzle 3 (`6-3=9`); solving puzzle 3 loops back to puzzle 1
- Making an incorrect move produces no message, banner, or reversion — the segment simply relocates and the player can try again
- The board visibly updates within ~100ms of a click, with no perceptible input lag

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- Digit and operator segment→glyph lookup tables round-trip correctly (Phase 1)
- `isEquationTrue` correctly handles a true equation, a false-but-valid equation, and an equation with an unrecognized segment pattern (Phase 1)
- All 3 starter puzzles: initial state is false, the designated solving move makes it true, and that move touches exactly one segment (Phase 1)

### Integration Tests:

- None automated — the click-to-select/click-to-place interaction and the win-loop/cycling behavior are covered by manual verification per Phase 2 and Phase 3, per the confirmed testing scope (unit tests on domain logic only).

### Manual Testing Steps:

1. Load the app; confirm puzzle 1 (`5+1=8`) renders with recognizable digit/operator segment shapes.
2. Select the operator's vertical segment, place it on the right digit's top-right slot; confirm the reward plays and puzzle 2 loads.
3. On puzzle 2, make an incorrect move (any lit segment to any unlit slot other than the solving move); confirm nothing happens beyond the segment moving.
4. Solve puzzles 2 and 3 in order; confirm the cycle loops back to puzzle 1 after puzzle 3.

## Performance Considerations

The NFR requires sub-100ms visible response to a move. Given this is entirely local React state with no network or heavy computation (glyph lookup is a handful of set comparisons), no special optimization is needed — default React re-rendering is fast enough at this scale. Avoid re-creating the segment lookup tables on every render (define them at module scope, not inside components).

## Migration Notes

Not applicable — greenfield feature, no existing data or prior behavior to migrate.

## References

- Roadmap slice: `context/foundation/roadmap.md` → S-01
- PRD: `context/foundation/prd.md` → US-01, FR-001–FR-006
- Seed mechanic example: `context/foundation/shape-notes.md` line 39
- UI deferral decision: `context/foundation/shape-notes.md` → `## Forward: tech-stack`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Domain Model & Content

#### Automated

- [x] 1.1 Type checking passes: `npm run build`
- [x] 1.2 Linting passes: `npm run lint`
- [x] 1.3 Domain unit tests pass: `npx vitest run`

### Phase 2: Interactive Equation Board

#### Automated

- [ ] 2.1 Type checking passes: `npm run build`
- [ ] 2.2 Linting passes: `npm run lint`

#### Manual

- [ ] 2.3 First puzzle renders as recognizable lit/unlit digit and operator shapes
- [ ] 2.4 Clicking a lit segment selects/deselects it correctly
- [ ] 2.5 Clicking an unlit segment while one is selected moves it and clears selection
- [ ] 2.6 Clicking an unlit segment with nothing selected has no effect
- [ ] 2.7 `=` glyph is always visible and never clickable

### Phase 3: Win Loop & Puzzle Cycling

#### Automated

- [ ] 3.1 Type checking passes: `npm run build`
- [ ] 3.2 Linting passes: `npm run lint`

#### Manual

- [ ] 3.3 Solving puzzle 1 triggers reward and advances to puzzle 2
- [ ] 3.4 Solving puzzles 2 and 3 in order loops back to puzzle 1 after puzzle 3
- [ ] 3.5 An incorrect move produces no message/reversion, segment just relocates
- [ ] 3.6 Board updates within ~100ms of a click with no perceptible lag
