# Session HUD & Reset — Plan Brief

> Full plan: `context/changes/session-hud-and-reset/plan.md`

## What & Why

Add a session HUD to EqShift showing score (equations solved this session), moves on the current equation, and a live elapsed-time stopwatch — plus a Reset action that restores the current equation's board and zeroes its moves/time. Implements FR-007 through FR-010: the player currently gets no feedback on progress or a way to retry a puzzle from scratch.

## Starting Point

All game state (`puzzleIndex`, `state`, `solved`) already lives in `useState` hooks inside `App.tsx`; `handleMove` applies every move attempt unconditionally, and a `setTimeout`-driven reward window already disables the board for ~1s after a correct move before advancing to the next puzzle. There is no timer, interval, or persistence anywhere yet, and no `jsdom`/RTL in the test toolchain — only pure-logic vitest tests exist today.

## Desired End State

While playing, the player sees a live score, moves-this-equation, and time-this-equation readout. Moves/time freeze during the reward celebration and reset to 0 on the next equation. A Reset button restores the current equation's board and zeroes its moves/time without touching score, and is disabled during the celebration window.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| --- | --- | --- |
| Score persistence | In-memory only, resets on reload | Matches the codebase's current no-persistence pattern; not required by any FR |
| Timer/moves during reward delay | Freeze at final values | Once solved, that equation's attempt is over — counters shouldn't keep moving |
| Reset scope | Current equation only (board + moves/time) | Matches FR-008's literal "for that equation" wording; score stays a real session total |
| Time display | `m:ss` | Familiar stopwatch convention, fits the retro-arcade feel |
| State location | Inline in `App.tsx` | Matches the existing convention — all session state already lives there |
| HUD structure | New `SessionHud` component | Matches the existing pattern of small presentational components (`RewardBanner`) |
| Reset lock during celebration | Disabled | Reuses the board's existing `disabled` pattern; avoids a reset/auto-advance race |
| Timer mechanism | `setInterval` every 1s | Simple, matches `m:ss` granularity, no new dependency |
| Test coverage | Pure-logic unit test (`formatElapsed`) + manual UI verification | No `jsdom`/RTL in the toolchain; adding it would outweigh the feature's own size |

## Scope

**In scope:** score/moves/timer HUD, Reset action for the current equation, a pure time-formatting helper with unit tests.

**Out of scope:** score persistence across reloads, resetting score, a "restart whole session" affordance, new test infrastructure (`jsdom`/RTL), any change to puzzle cycling or move validation.

## Architecture / Approach

Everything stays inline in `App.tsx` alongside the existing state, following the codebase's current single-component-owns-state convention. A new `SessionHud` component (sibling to `RewardBanner`) renders the readouts and, from Phase 2, the Reset button. A `setInterval` effect keyed on `solved` drives the timer; moves/time resets are folded into the same state batch that already resets the board on puzzle-advance and (new) on manual reset — avoiding a stale-counter flash.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Session HUD | Score/moves/timer state, `formatElapsed` + test, `SessionHud` display component wired into `App.tsx` | Timer effect must freeze cleanly on `solved` without leaking intervals |
| 2. Reset action | Reset button in `SessionHud`, `handleReset` restoring board + zeroing moves/time, disabled during celebration | Reset must not race the pending auto-advance `setTimeout` |

**Prerequisites:** S-01 (`core-equation-solving-loop`) implemented — confirmed done.
**Estimated effort:** ~1 session across 2 phases; small, additive UI feature.

## Open Risks & Assumptions

- Assumes no hour-scale puzzle attempts — `formatElapsed` only handles `m:ss`, not `h:mm:ss`.
- Manual verification is the only coverage for the timer's live ticking and the Reset/celebration interaction, since the test toolchain has no component-rendering support.

## Success Criteria (Summary)

- Score increments by 1 per solved equation and survives across puzzles (not across reloads).
- Moves and elapsed time track the current equation correctly, freeze during the reward window, and reset on advance.
- Reset restores the board and zeroes moves/time for the current equation only, and is disabled mid-celebration.
