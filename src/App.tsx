import { useState } from 'react'
import { EquationBoard } from './game/EquationBoard'
import { RewardBanner } from './game/RewardBanner'
import { applyMove, isEquationTrue } from './game/equation'
import type { EquationState, SlotRef } from './game/equation'
import { puzzles } from './game/puzzles'
import './App.css'

const SOLVED_ADVANCE_DELAY_MS = 1000

function App() {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [state, setState] = useState<EquationState>(puzzles[0].initial)
  const [solved, setSolved] = useState(false)

  function handleMove(from: SlotRef, to: SlotRef) {
    const next = applyMove(state, from, to)
    setState(next)

    if (isEquationTrue(next)) {
      setSolved(true)
      window.setTimeout(() => {
        const nextIndex = (puzzleIndex + 1) % puzzles.length
        setPuzzleIndex(nextIndex)
        setState(puzzles[nextIndex].initial)
        setSolved(false)
      }, SOLVED_ADVANCE_DELAY_MS)
    }
  }

  return (
    <main className="app">
      <EquationBoard state={state} onMove={handleMove} disabled={solved} />
      <RewardBanner visible={solved} />
    </main>
  )
}

export default App
