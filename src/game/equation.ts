import type { DigitSlot, OperatorSlot } from './segments'
import { digitFromSegments, operatorFromSegments } from './segments'

export type CellKey = 'left' | 'operator' | 'right' | 'result'

export type SlotRef =
  | { cell: 'left' | 'right' | 'result'; slot: DigitSlot }
  | { cell: 'operator'; slot: OperatorSlot }

export type EquationState = {
  left: ReadonlySet<DigitSlot>
  operator: ReadonlySet<OperatorSlot>
  right: ReadonlySet<DigitSlot>
  result: ReadonlySet<DigitSlot>
}

function withoutSlot<T>(set: ReadonlySet<T>, slot: T): ReadonlySet<T> {
  const next = new Set(set)
  next.delete(slot)
  return next
}

function withSlot<T>(set: ReadonlySet<T>, slot: T): ReadonlySet<T> {
  return new Set([...set, slot])
}

export function applyMove(state: EquationState, from: SlotRef, to: SlotRef): EquationState {
  const next: EquationState = { ...state }

  if (from.cell === 'operator') {
    next.operator = withoutSlot(next.operator, from.slot)
  } else {
    next[from.cell] = withoutSlot(next[from.cell], from.slot)
  }

  if (to.cell === 'operator') {
    next.operator = withSlot(next.operator, to.slot)
  } else {
    next[to.cell] = withSlot(next[to.cell], to.slot)
  }

  return next
}

export function isEquationTrue(state: EquationState): boolean {
  const left = digitFromSegments(state.left)
  const operator = operatorFromSegments(state.operator)
  const right = digitFromSegments(state.right)
  const result = digitFromSegments(state.result)

  if (left === null || operator === null || right === null || result === null) {
    return false
  }

  const computed = operator === '+' ? left + right : left - right
  return computed === result
}
