<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Core Equation-Solving Loop

- **Plan**: context/changes/core-equation-solving-loop/plan.md
- **Scope**: Phase 1-3 of 3 (full plan)
- **Date**: 2026-08-07
- **Verdict**: APPROVED
- **Findings**: 0 critical, 2 warnings, 1 observation

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | WARNING |
| Scope Discipline | PASS |
| Safety & Quality | WARNING |
| Architecture | PASS |
| Pattern Consistency | PASS |
| Success Criteria | PASS |

## Findings

### F1 — Reward window doesn't gate input, enabling a stale-closure double-advance race

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: src/App.tsx:16-27
- **Detail**: EquationBoard stays fully clickable during the ~1s reward window after a solve. Two consequences: (1) the player can move segments during the window; the change is visible for a moment, then silently overwritten when the pending setTimeout fires and jumps to the next puzzle — harmless here since nothing is tracked yet, but reads as flicker (always reproducible). (2) If the player re-triggers `isEquationTrue` a second time before the first timeout fires (e.g. undo the solving move and redo it), a second timeout is scheduled from the same stale `puzzleIndex` closure. Both timeouts resolve to the same `nextIndex`, so the second one silently resets the just-advanced puzzle back to its initial state instead of advancing further (narrow edge case). The plan's Phase 3 contract says the advance is "time-gated ... not another player action" — nothing currently enforces that intent.
- **Fix**: Gate interaction while `solved` is true — pass a `disabled` flag down through EquationBoard/Segment (or early-return in `handleMove` when `solved` is already true) so clicks during the reward window are no-ops.
  - Strength: Matches the plan's stated intent exactly; small, localized change.
  - Tradeoff: None significant.
  - Confidence: HIGH — the mundane flicker case is 100% reproducible today; the double-advance race follows directly from the closure capture.
  - Blind spot: Haven't checked whether any of the 3 puzzles admit a second true equation via one further move from their solved state — the double-advance case may be currently unreachable in practice. The flicker case is unaffected by that.
- **Decision**: FIXED — `EquationBoard` now accepts a `disabled` prop; `App.tsx` passes `disabled={solved}` so clicks during the reward window are a no-op.

### F2 — Plan text still references the pre-fix "right digit" wording for puzzle 1

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Adherence
- **Location**: context/changes/core-equation-solving-loop/plan.md:208,232
- **Detail**: A hand-derivation error in puzzle 1 was caught and fixed in the plan's Phase 1 contract (line 100) during implementation — confirmed correct in the actual code and tests. The fix wasn't swept through the rest of the document: Phase 3's manual-verification bullet (line 208) and the Testing Strategy's manual steps (line 232) still say "right digit's topRight". Code is correct; only the plan text is stale.
- **Fix**: Update both stale references from "right" to "left" to match the corrected Phase 1 contract and the actual implementation.
- **Decision**: FIXED — plan.md lines 208 and 232 updated to say "left digit's topRight".

### F3 — Selecting a second lit segment silently swaps the selection

- **Severity**: ⚪ OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Pattern Consistency
- **Location**: src/game/EquationBoard.tsx:33
- **Detail**: Clicking a different lit segment while one is already selected replaces the selection rather than being ignored. This matches the plan's stated Intent ("switches the selection to it") and is reasonable UX — flagging only because the code reads at a glance like a re-selection guard rather than a toggle/replace. No action needed.
- **Decision**: SKIPPED — intentional behavior per the plan's own Intent; no change needed.

## Notes

- Automated verification re-run at review time: `npm run build`, `npm run lint`, `npm test` (17/17) all pass.
- Drift agent confirmed all 10 planned changes (Phase 1-3) match the plan's stated Intent/Contract, including exact exported type/function names and signatures. Two harmless refinements noted: `SlotRef` implemented as a discriminated union (stricter, compatible) rather than the plan's flat shape, and `segments.ts` exports a few extra helper functions (`Operator`, `segmentsForDigit`, `segmentsForOperator`) not named in the plan's contract block but used internally by other files.
- Safety/quality agent found no CRITICAL issues, no `any`/non-null-assertion escape hatches, and confirmed `verbatimModuleSyntax: true` is respected in every new file. `package-lock.json` is in sync with `package.json`.
