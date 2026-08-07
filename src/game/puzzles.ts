import type { EquationState, SlotRef } from './equation'
import { segmentsForDigit, segmentsForOperator } from './segments'

export type Puzzle = {
  initial: EquationState
  solvingMove: { from: SlotRef; to: SlotRef }
}

export const puzzles: readonly Puzzle[] = [
  {
    // 5+1=8 -> move the operator's vertical segment onto the left digit's
    // topRight slot: "+" -> "-", "5" -> "9", giving 9-1=8.
    initial: {
      left: segmentsForDigit(5),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(1),
      result: segmentsForDigit(8),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'topRight' },
    },
  },
  {
    // 3+6=3 -> move the operator's vertical segment onto the left digit's
    // topLeft slot: "+" -> "-", "3" -> "9", giving 9-6=3.
    initial: {
      left: segmentsForDigit(3),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(6),
      result: segmentsForDigit(3),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'topLeft' },
    },
  },
  {
    // 6-3=9 -> move the result digit's topRight segment onto the left
    // digit's topRight slot: "9" -> "5", "6" -> "8", giving 8-3=5.
    initial: {
      left: segmentsForDigit(6),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(3),
      result: segmentsForDigit(9),
    },
    solvingMove: {
      from: { cell: 'result', slot: 'topRight' },
      to: { cell: 'left', slot: 'topRight' },
    },
  },
]
