import { describe, expect, it } from 'vitest'
import { puzzles } from './puzzles'
import { applyMove, isEquationTrue } from './equation'
import type { CellKey, EquationState } from './equation'

const CELL_KEYS: readonly CellKey[] = ['left', 'operator', 'right', 'result']

function segmentDiff(before: EquationState, after: EquationState) {
  let added: { cell: CellKey; slot: string } | undefined
  let removed: { cell: CellKey; slot: string } | undefined
  let extraChanges = 0

  for (const cell of CELL_KEYS) {
    const beforeSlots = before[cell] as ReadonlySet<string>
    const afterSlots = after[cell] as ReadonlySet<string>

    for (const slot of afterSlots) {
      if (!beforeSlots.has(slot)) {
        if (added) extraChanges++
        added = { cell, slot }
      }
    }
    for (const slot of beforeSlots) {
      if (!afterSlots.has(slot)) {
        if (removed) extraChanges++
        removed = { cell, slot }
      }
    }
  }

  return { added, removed, extraChanges }
}

describe('puzzles', () => {
  for (const [index, puzzle] of puzzles.entries()) {
    describe(`puzzle ${index + 1}`, () => {
      it('starts on a mathematically false equation', () => {
        expect(isEquationTrue(puzzle.initial)).toBe(false)
      })

      it('becomes true after applying the designated solving move', () => {
        const solved = applyMove(puzzle.initial, puzzle.solvingMove.from, puzzle.solvingMove.to)
        expect(isEquationTrue(solved)).toBe(true)
      })

      it('solving move touches exactly one segment', () => {
        const solved = applyMove(puzzle.initial, puzzle.solvingMove.from, puzzle.solvingMove.to)
        const diff = segmentDiff(puzzle.initial, solved)

        expect(diff.extraChanges).toBe(0)
        expect(diff.removed).toEqual({ cell: puzzle.solvingMove.from.cell, slot: puzzle.solvingMove.from.slot })
        expect(diff.added).toEqual({ cell: puzzle.solvingMove.to.cell, slot: puzzle.solvingMove.to.slot })
      })
    })
  }
})
