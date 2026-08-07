export type DigitSlot =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'middle'
  | 'bottomLeft'
  | 'bottomRight'
  | 'bottom'

export type OperatorSlot = 'horizontal' | 'vertical'

export type Operator = '+' | '-'

const DIGIT_SEGMENTS: Record<number, readonly DigitSlot[]> = {
  0: ['top', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'bottom'],
  1: ['topRight', 'bottomRight'],
  2: ['top', 'topRight', 'middle', 'bottomLeft', 'bottom'],
  3: ['top', 'topRight', 'middle', 'bottomRight', 'bottom'],
  4: ['topLeft', 'topRight', 'middle', 'bottomRight'],
  5: ['top', 'topLeft', 'middle', 'bottomRight', 'bottom'],
  6: ['top', 'topLeft', 'middle', 'bottomLeft', 'bottomRight', 'bottom'],
  7: ['top', 'topRight', 'bottomRight'],
  8: ['top', 'topLeft', 'topRight', 'middle', 'bottomLeft', 'bottomRight', 'bottom'],
  9: ['top', 'topLeft', 'topRight', 'middle', 'bottomRight', 'bottom'],
}

const OPERATOR_SEGMENTS: Record<Operator, readonly OperatorSlot[]> = {
  '-': ['horizontal'],
  '+': ['horizontal', 'vertical'],
}

function setsEqual<T>(a: ReadonlySet<T>, b: ReadonlySet<T>): boolean {
  if (a.size !== b.size) return false
  for (const item of a) {
    if (!b.has(item)) return false
  }
  return true
}

export function segmentsForDigit(digit: number): ReadonlySet<DigitSlot> {
  return new Set(DIGIT_SEGMENTS[digit])
}

export function segmentsForOperator(operator: Operator): ReadonlySet<OperatorSlot> {
  return new Set(OPERATOR_SEGMENTS[operator])
}

export function digitFromSegments(lit: ReadonlySet<DigitSlot>): number | null {
  for (const [digit, slots] of Object.entries(DIGIT_SEGMENTS)) {
    if (setsEqual(lit, new Set(slots))) return Number(digit)
  }
  return null
}

export function operatorFromSegments(lit: ReadonlySet<OperatorSlot>): Operator | null {
  for (const [operator, slots] of Object.entries(OPERATOR_SEGMENTS)) {
    if (setsEqual(lit, new Set(slots))) return operator as Operator
  }
  return null
}
