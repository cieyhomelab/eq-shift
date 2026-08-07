import { describe, expect, it } from 'vitest'
import { applyMove, isEquationTrue } from './equation'
import type { EquationState } from './equation'
import { segmentsForDigit, segmentsForOperator } from './segments'

function equation(left: number, operator: '+' | '-', right: number, result: number): EquationState {
  return {
    left: segmentsForDigit(left),
    operator: segmentsForOperator(operator),
    right: segmentsForDigit(right),
    result: segmentsForDigit(result),
  }
}

describe('isEquationTrue', () => {
  it('is true for a valid, arithmetically correct equation', () => {
    expect(isEquationTrue(equation(9, '-', 1, 8))).toBe(true)
  })

  it('is false for a valid but arithmetically wrong equation', () => {
    expect(isEquationTrue(equation(5, '+', 1, 8))).toBe(false)
  })

  it('is false when a cell resolves to an unrecognized glyph', () => {
    const state = equation(9, '-', 1, 8)
    const broken: EquationState = { ...state, left: new Set(['top', 'middle']) }
    expect(isEquationTrue(broken)).toBe(false)
  })
})

describe('applyMove', () => {
  it('moves a segment from one cell to another, leaving other cells untouched', () => {
    const state = equation(5, '+', 1, 8)
    const next = applyMove(
      state,
      { cell: 'operator', slot: 'vertical' },
      { cell: 'left', slot: 'topRight' },
    )

    expect(next.operator.has('vertical')).toBe(false)
    expect(next.left.has('topRight')).toBe(true)
    expect(next.right).toEqual(state.right)
    expect(next.result).toEqual(state.result)
    expect(isEquationTrue(next)).toBe(true)
  })
})
