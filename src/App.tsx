import { useState } from 'react'
import { EquationBoard } from './game/EquationBoard'
import { applyMove } from './game/equation'
import type { EquationState, SlotRef } from './game/equation'
import { puzzles } from './game/puzzles'
import './App.css'

function App() {
  const [state, setState] = useState<EquationState>(puzzles[0].initial)

  function handleMove(from: SlotRef, to: SlotRef) {
    setState((current) => applyMove(current, from, to))
  }

  return (
    <main className="app">
      <EquationBoard state={state} onMove={handleMove} />
    </main>
  )
}

export default App
