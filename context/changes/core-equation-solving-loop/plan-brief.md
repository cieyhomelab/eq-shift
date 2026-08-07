# Core Equation-Solving Loop — Plan Brief

> Full plan: `context/changes/core-equation-solving-loop/plan.md`

## What & Why

EqShift's north-star loop (roadmap S-01): a player sees a mathematically wrong equation built from digit/operator segments, moves exactly one segment, and gets automatic validation — correct move → brief reward → next equation; incorrect move → silence. If this loop isn't satisfying to play, nothing else in the roadmap matters.

## Starting Point

`src/App.tsx` is still the untouched Vite+React template — no game code, data model, or components exist yet. No test runner is configured. This is a from-scratch build on a clean scaffold.

## Desired End State

`npm run dev` shows one equation as lit/unlit segments. Click a lit segment to select it, click an unlit slot to move it there. A correct move flashes a brief reward and loads the next of 3 cycling puzzles; a wrong move just leaves the segment moved, with no message, and the player keeps trying.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) | Source |
| --- | --- | --- | --- |
| Interim UI fidelity | Minimal LCD-style placeholder, no retro theming | Retro visual design is an explicit separate pen.dev stage — don't duplicate that work now | Plan (user-confirmed) |
| "Next equation" scope | 3 hand-authored equations, cycled | Makes FR-005's "load next equation" observable without building the parked equation-library feature | Plan (user-confirmed) |
| Move interaction | Click-to-select, click-to-place | Simplest to implement/test, decouples move logic from visuals ahead of the pen.dev UI handoff | Plan (user-confirmed) |
| Equation data model | Hardcoded single shape (digit-op-digit=digit) | No speculative generality for a multi-digit/library need that isn't confirmed yet | Plan (user-confirmed) |
| Unrecognized segment pattern | Treated as invalid equation, no special case | One validation path; consistent with FR-006's "no feedback on wrong moves" | Plan (user-confirmed) |
| Reward fidelity | Minimal flash/text + short delay | Satisfies FR-005 without investing in animation work pen.dev will likely replace | Plan (user-confirmed) |
| State persistence | In-memory only, no localStorage | S-02 owns the counters/reset that would actually need persisting — avoid guessing its schema now | Plan (user-confirmed) |
| Testing | Add Vitest, unit-test domain logic only | The digit/operator lookup tables and puzzle content are easy to typo and hard to eyeball-verify | Plan (user-confirmed) |
| `=` sign behavior | Fixed, non-interactive, never a move source/target | Equation string must stay parseable as `left op right = result`; seed example never touches `=` | Plan (research) |

## Scope

**In scope:**
- Segment/glyph domain model (digits 0–9, operators +/−) with unit tests
- 3 hand-verified starter puzzles, cycled
- Click-to-select/click-to-place interaction
- Automatic validation, brief reward, auto-advance on correct move

**Out of scope:**
- Score/move/time counters, reset button (S-02)
- localStorage persistence
- Retro-90s visual styling (pen.dev stage)
- Drag-and-drop
- Multi-digit operands, equation generator/library

## Architecture / Approach

Bottom-up: pure TypeScript domain layer (`src/game/segments.ts`, `equation.ts`, `puzzles.ts`) fully unit-tested with Vitest, then a minimal React UI (`Segment.tsx`, `EquationBoard.tsx`) wired to it, then the win-detection/reward/cycling loop in `App.tsx`. Each phase runs and verifies independently.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| --- | --- | --- |
| 1. Domain Model & Content | Segment/glyph model, equation validity, 3 verified puzzles, Vitest setup | Hand-authored lookup tables/puzzle content could have a typo — mitigated by unit tests |
| 2. Interactive Equation Board | Clickable segment rendering + select/place interaction, replacing the Vite template | Interaction edge cases (reselect, click-with-nothing-selected) need careful manual check |
| 3. Win Loop & Puzzle Cycling | Auto-validation, reward, auto-advance, 3-puzzle cycling | Timing of reward → advance transition must feel right, not jarring |

**Prerequisites:** None — greenfield, no dependencies beyond the existing Vite+React scaffold.
**Estimated effort:** ~2-3 sessions across 3 phases (solo, after-hours pace).

## Open Risks & Assumptions

- Whether click-to-select/click-to-place (vs. drag-and-drop) actually feels good to play won't be known until Phase 2/3 manual testing — this is exactly the risk S-01 as north-star exists to surface early.
- The 3 starter puzzles were hand-derived and cross-checked against the segment tables in this planning session; Phase 1's unit tests are the real safety net if any arithmetic slipped.

## Success Criteria (Summary)

- Player can complete the full cycle: see a wrong equation, move one segment, see a reward, land on the next equation — for all 3 puzzles, looping indefinitely
- Wrong moves are silent and never block further attempts
- `npm run build`, `npm run lint`, and `npx vitest run` all pass at the end of every phase
