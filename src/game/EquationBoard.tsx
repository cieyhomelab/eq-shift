import { useEffect, useState } from 'react'
import type { CellKey, EquationState, SlotRef } from './equation'
import type { DigitSlot, OperatorSlot } from './segments'
import { Segment } from './Segment'
import { playBootSequence, playSegmentClick } from './sound'
import './game.css'

const INTRO_ANIMATION_MS = 2500

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
  disabled?: boolean
  puzzleIndex: number
}

export function EquationBoard({ state, onMove, disabled = false, puzzleIndex }: EquationBoardProps) {
  const [selected, setSelected] = useState<SlotRef | null>(null)
  const [introActive, setIntroActive] = useState(true)

  useEffect(() => {
    setIntroActive(true)
    setSelected(null)
    const stopBoot = playBootSequence(INTRO_ANIMATION_MS)
    const timeoutId = window.setTimeout(() => setIntroActive(false), INTRO_ANIMATION_MS)
    return () => {
      window.clearTimeout(timeoutId)
      stopBoot()
    }
  }, [puzzleIndex])

  function isSelected(cell: CellKey, slot: DigitSlot | OperatorSlot) {
    return selected !== null && selected.cell === cell && selected.slot === slot
  }

  function handleSlotClick(ref: SlotRef, lit: boolean) {
    if (disabled || introActive) return
    playSegmentClick()
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
            animating={introActive}
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
            animating={introActive}
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
