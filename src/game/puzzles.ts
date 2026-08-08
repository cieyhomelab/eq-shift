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
  {
    // 3-2=9 -> move the result cell's topRight segment onto the
    // operator cell's vertical slot, giving 3+2=5.
    initial: {
      left: segmentsForDigit(3),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(2),
      result: segmentsForDigit(9),
    },
    solvingMove: {
      from: { cell: 'result', slot: 'topRight' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 0-8=6 -> move the right cell's topRight segment onto the
    // operator cell's vertical slot, giving 0+6=6.
    initial: {
      left: segmentsForDigit(0),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(8),
      result: segmentsForDigit(6),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'topRight' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 5+7=2 -> move the operator cell's vertical segment onto the
    // left cell's topRight slot, giving 9-7=2.
    initial: {
      left: segmentsForDigit(5),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(7),
      result: segmentsForDigit(2),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'topRight' },
    },
  },
  {
    // 1+0=7 -> move the operator cell's vertical segment onto the
    // left cell's top slot, giving 7-0=7.
    initial: {
      left: segmentsForDigit(1),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(0),
      result: segmentsForDigit(7),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'top' },
    },
  },
  {
    // 1-2=9 -> move the result cell's topLeft segment onto the
    // operator cell's vertical slot, giving 1+2=3.
    initial: {
      left: segmentsForDigit(1),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(2),
      result: segmentsForDigit(9),
    },
    solvingMove: {
      from: { cell: 'result', slot: 'topLeft' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 9-1=4 -> move the left cell's topLeft segment onto the
    // operator cell's vertical slot, giving 3+1=4.
    initial: {
      left: segmentsForDigit(9),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(1),
      result: segmentsForDigit(4),
    },
    solvingMove: {
      from: { cell: 'left', slot: 'topLeft' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 9-4=7 -> move the left cell's topLeft segment onto the
    // operator cell's vertical slot, giving 3+4=7.
    initial: {
      left: segmentsForDigit(9),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(4),
      result: segmentsForDigit(7),
    },
    solvingMove: {
      from: { cell: 'left', slot: 'topLeft' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 8+0=9 -> move the operator cell's vertical segment onto the
    // result cell's bottomLeft slot, giving 8-0=8.
    initial: {
      left: segmentsForDigit(8),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(0),
      result: segmentsForDigit(9),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'result', slot: 'bottomLeft' },
    },
  },
  {
    // 8+1=1 -> move the operator cell's vertical segment onto the
    // result cell's top slot, giving 8-1=7.
    initial: {
      left: segmentsForDigit(8),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(1),
      result: segmentsForDigit(1),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'result', slot: 'top' },
    },
  },
  {
    // 9-0=3 -> move the left cell's topLeft segment onto the
    // operator cell's vertical slot, giving 3+0=3.
    initial: {
      left: segmentsForDigit(9),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(0),
      result: segmentsForDigit(3),
    },
    solvingMove: {
      from: { cell: 'left', slot: 'topLeft' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 9+2=1 -> move the operator cell's vertical segment onto the
    // result cell's top slot, giving 9-2=7.
    initial: {
      left: segmentsForDigit(9),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(2),
      result: segmentsForDigit(1),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'result', slot: 'top' },
    },
  },
  {
    // 6-4=9 -> move the left cell's bottomLeft segment onto the
    // operator cell's vertical slot, giving 5+4=9.
    initial: {
      left: segmentsForDigit(6),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(4),
      result: segmentsForDigit(9),
    },
    solvingMove: {
      from: { cell: 'left', slot: 'bottomLeft' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 5+0=6 -> move the operator cell's vertical segment onto the
    // left cell's bottomLeft slot, giving 6-0=6.
    initial: {
      left: segmentsForDigit(5),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(0),
      result: segmentsForDigit(6),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'bottomLeft' },
    },
  },
  {
    // 6-9=9 -> move the right cell's topLeft segment onto the
    // operator cell's vertical slot, giving 6+3=9.
    initial: {
      left: segmentsForDigit(6),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(9),
      result: segmentsForDigit(9),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'topLeft' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 1-8=7 -> move the right cell's topRight segment onto the
    // operator cell's vertical slot, giving 1+6=7.
    initial: {
      left: segmentsForDigit(1),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(8),
      result: segmentsForDigit(7),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'topRight' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 9-1=6 -> move the left cell's topRight segment onto the
    // operator cell's vertical slot, giving 5+1=6.
    initial: {
      left: segmentsForDigit(9),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(1),
      result: segmentsForDigit(6),
    },
    solvingMove: {
      from: { cell: 'left', slot: 'topRight' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 1-0=7 -> move the result cell's top segment onto the
    // operator cell's vertical slot, giving 1+0=1.
    initial: {
      left: segmentsForDigit(1),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(0),
      result: segmentsForDigit(7),
    },
    solvingMove: {
      from: { cell: 'result', slot: 'top' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 1-4=9 -> move the result cell's topRight segment onto the
    // operator cell's vertical slot, giving 1+4=5.
    initial: {
      left: segmentsForDigit(1),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(4),
      result: segmentsForDigit(9),
    },
    solvingMove: {
      from: { cell: 'result', slot: 'topRight' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 3-8=0 -> move the right cell's bottomLeft segment onto the
    // left cell's topLeft slot, giving 9-9=0.
    initial: {
      left: segmentsForDigit(3),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(8),
      result: segmentsForDigit(0),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'bottomLeft' },
      to: { cell: 'left', slot: 'topLeft' },
    },
  },
  {
    // 0+6=2 -> move the operator cell's vertical segment onto the
    // left cell's middle slot, giving 8-6=2.
    initial: {
      left: segmentsForDigit(0),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(6),
      result: segmentsForDigit(2),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'middle' },
    },
  },
  {
    // 7-8=7 -> move the right cell's middle segment onto the
    // operator cell's vertical slot, giving 7+0=7.
    initial: {
      left: segmentsForDigit(7),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(8),
      result: segmentsForDigit(7),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'middle' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 0-8=9 -> move the right cell's bottomLeft segment onto the
    // operator cell's vertical slot, giving 0+9=9.
    initial: {
      left: segmentsForDigit(0),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(8),
      result: segmentsForDigit(9),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'bottomLeft' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 7+7=9 -> move the right cell's top segment onto the
    // result cell's bottomLeft slot, giving 7+1=8.
    initial: {
      left: segmentsForDigit(7),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(7),
      result: segmentsForDigit(9),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'top' },
      to: { cell: 'result', slot: 'bottomLeft' },
    },
  },
  {
    // 5+7=7 -> move the right cell's top segment onto the
    // left cell's bottomLeft slot, giving 6+1=7.
    initial: {
      left: segmentsForDigit(5),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(7),
      result: segmentsForDigit(7),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'top' },
      to: { cell: 'left', slot: 'bottomLeft' },
    },
  },
  {
    // 3-9=8 -> move the right cell's topRight segment onto the
    // operator cell's vertical slot, giving 3+5=8.
    initial: {
      left: segmentsForDigit(3),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(9),
      result: segmentsForDigit(8),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'topRight' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 5+1=5 -> move the operator cell's vertical segment onto the
    // left cell's bottomLeft slot, giving 6-1=5.
    initial: {
      left: segmentsForDigit(5),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(1),
      result: segmentsForDigit(5),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'bottomLeft' },
    },
  },
  {
    // 9+3=0 -> move the operator cell's vertical segment onto the
    // right cell's topLeft slot, giving 9-9=0.
    initial: {
      left: segmentsForDigit(9),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(3),
      result: segmentsForDigit(0),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'right', slot: 'topLeft' },
    },
  },
  {
    // 5+9=0 -> move the right cell's topLeft segment onto the
    // result cell's middle slot, giving 5+3=8.
    initial: {
      left: segmentsForDigit(5),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(9),
      result: segmentsForDigit(0),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'topLeft' },
      to: { cell: 'result', slot: 'middle' },
    },
  },
  {
    // 1+2=5 -> move the operator cell's vertical segment onto the
    // left cell's top slot, giving 7-2=5.
    initial: {
      left: segmentsForDigit(1),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(2),
      result: segmentsForDigit(5),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'top' },
    },
  },
  {
    // 6+7=1 -> move the operator cell's vertical segment onto the
    // left cell's topRight slot, giving 8-7=1.
    initial: {
      left: segmentsForDigit(6),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(7),
      result: segmentsForDigit(1),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'topRight' },
    },
  },
  {
    // 2-9=5 -> move the right cell's topLeft segment onto the
    // operator cell's vertical slot, giving 2+3=5.
    initial: {
      left: segmentsForDigit(2),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(9),
      result: segmentsForDigit(5),
    },
    solvingMove: {
      from: { cell: 'right', slot: 'topLeft' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 9-3=8 -> move the left cell's topRight segment onto the
    // operator cell's vertical slot, giving 5+3=8.
    initial: {
      left: segmentsForDigit(9),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(3),
      result: segmentsForDigit(8),
    },
    solvingMove: {
      from: { cell: 'left', slot: 'topRight' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 0+1=7 -> move the operator cell's vertical segment onto the
    // left cell's middle slot, giving 8-1=7.
    initial: {
      left: segmentsForDigit(0),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(1),
      result: segmentsForDigit(7),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'middle' },
    },
  },
  {
    // 7-2=8 -> move the result cell's bottomLeft segment onto the
    // operator cell's vertical slot, giving 7+2=9.
    initial: {
      left: segmentsForDigit(7),
      operator: segmentsForOperator('-'),
      right: segmentsForDigit(2),
      result: segmentsForDigit(8),
    },
    solvingMove: {
      from: { cell: 'result', slot: 'bottomLeft' },
      to: { cell: 'operator', slot: 'vertical' },
    },
  },
  {
    // 0+3=5 -> move the operator cell's vertical segment onto the
    // left cell's middle slot, giving 8-3=5.
    initial: {
      left: segmentsForDigit(0),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(3),
      result: segmentsForDigit(5),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'left', slot: 'middle' },
    },
  },
  {
    // 9+3=5 -> move the operator cell's vertical segment onto the
    // result cell's bottomLeft slot, giving 9-3=6.
    initial: {
      left: segmentsForDigit(9),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(3),
      result: segmentsForDigit(5),
    },
    solvingMove: {
      from: { cell: 'operator', slot: 'vertical' },
      to: { cell: 'result', slot: 'bottomLeft' },
    },
  },
  {
    // 6+1=8 -> move the result cell's bottomLeft segment onto the
    // left cell's topRight slot, giving 8+1=9.
    initial: {
      left: segmentsForDigit(6),
      operator: segmentsForOperator('+'),
      right: segmentsForDigit(1),
      result: segmentsForDigit(8),
    },
    solvingMove: {
      from: { cell: 'result', slot: 'bottomLeft' },
      to: { cell: 'left', slot: 'topRight' },
    },
  },
]
