import { describe, expect, it } from 'vitest'
import { digitFromSegments, operatorFromSegments, segmentsForDigit, segmentsForOperator } from './segments'

describe('digitFromSegments', () => {
  it('round-trips all 10 digits', () => {
    for (let digit = 0; digit <= 9; digit++) {
      expect(digitFromSegments(segmentsForDigit(digit))).toBe(digit)
    }
  })

  it('returns null for an unrecognized pattern', () => {
    expect(digitFromSegments(new Set(['top', 'middle']))).toBeNull()
  })
})

describe('operatorFromSegments', () => {
  it('round-trips both operators', () => {
    expect(operatorFromSegments(segmentsForOperator('+'))).toBe('+')
    expect(operatorFromSegments(segmentsForOperator('-'))).toBe('-')
  })

  it('returns null for an unrecognized pattern', () => {
    expect(operatorFromSegments(new Set(['vertical']))).toBeNull()
    expect(operatorFromSegments(new Set())).toBeNull()
  })
})
