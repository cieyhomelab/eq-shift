import { useState } from 'react'
import type { CellKey, EquationState, SlotRef } from './equation'
import type { DigitSlot, OperatorSlot } from './segments'
import { Segment } from './Segment'
import './game.css'

const DIGIT_SLOTS: readonly DigitSlot[] = [
  'top',
  'topLeft',
  'topRight',
  'middle',
  'bottomLeft',
  'bottomRight',
  'bottom',
]

const OPERATOR_SLOTS: readonly OperatorSlot[] = ['horizontal', 'vertical']

type DigitCellKey = 'left' | 'right' | 'result'

type EquationBoardProps = {
  state: EquationState
  onMove: (from: SlotRef, to: SlotRef) => void
}

export function EquationBoard({ state, onMove }: EquationBoardProps) {
  const [selected, setSelected] = useState<SlotRef | null>(null)

  function isSelected(cell: CellKey, slot: DigitSlot | OperatorSlot) {
    return selected !== null && selected.cell === cell && selected.slot === slot
  }

  function handleSlotClick(ref: SlotRef, lit: boolean) {
    if (lit) {
      setSelected((current) =>
        current && current.cell === ref.cell && current.slot === ref.slot ? null : ref,
      )
      return
    }
    if (selected) {
      onMove(selected, ref)
      setSelected(null)
    }
  }

  function renderDigitCell(cell: DigitCellKey) {
    return (
      <div className="cell cell-digit">
        {DIGIT_SLOTS.map((slot) => (
          <Segment
            key={slot}
            slot={slot}
            lit={state[cell].has(slot)}
            selected={isSelected(cell, slot)}
            onClick={() => handleSlotClick({ cell, slot }, state[cell].has(slot))}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="equation-board">
      {renderDigitCell('left')}
      <div className="cell cell-operator">
        {OPERATOR_SLOTS.map((slot) => (
          <Segment
            key={slot}
            slot={slot}
            lit={state.operator.has(slot)}
            selected={isSelected('operator', slot)}
            onClick={() =>
              handleSlotClick({ cell: 'operator', slot }, state.operator.has(slot))
            }
          />
        ))}
      </div>
      {renderDigitCell('right')}
      <div className="cell equals">
        <div className="equals-bar equals-bar--top" />
        <div className="equals-bar equals-bar--bottom" />
      </div>
      {renderDigitCell('result')}
    </div>
  )
}
