import { useEffect, useState } from 'react'
import { EquationBoard } from './game/EquationBoard'
import { RewardBanner } from './game/RewardBanner'
import { SessionHud } from './game/SessionHud'
import { applyMove, isEquationTrue } from './game/equation'
import type { EquationState, SlotRef } from './game/equation'
import { puzzles } from './game/puzzles'
import './App.css'

const SOLVED_ADVANCE_DELAY_MS = 1000

function App() {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [state, setState] = useState<EquationState>(puzzles[0].initial)
  const [solved, setSolved] = useState(false)
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (solved) return

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [solved])

  function handleMove(from: SlotRef, to: SlotRef) {
    const next = applyMove(state, from, to)
    setState(next)
    setMoves((m) => m + 1)

    if (isEquationTrue(next)) {
      setSolved(true)
      setScore((s) => s + 1)
      window.setTimeout(() => {
        const nextIndex = (puzzleIndex + 1) % puzzles.length
        setPuzzleIndex(nextIndex)
        setState(puzzles[nextIndex].initial)
        setSolved(false)
        setMoves(0)
        setElapsedSeconds(0)
      }, SOLVED_ADVANCE_DELAY_MS)
    }
  }

  return (
    <main className="app">
      <SessionHud score={score} moves={moves} elapsedSeconds={elapsedSeconds} />
      <EquationBoard state={state} onMove={handleMove} disabled={solved} />
      <RewardBanner visible={solved} />
    </main>
  )
}

export default App
