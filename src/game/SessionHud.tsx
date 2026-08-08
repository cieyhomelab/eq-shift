import { formatElapsed } from './time'

type SessionHudProps = {
  score: number
  moves: number
  elapsedSeconds: number
}

export function SessionHud({ score, moves, elapsedSeconds }: SessionHudProps) {
  return (
    <div className="session-hud">
      <div className="session-hud-stat">
        <span className="session-hud-label">Score</span>
        <span className="session-hud-value">{score}</span>
      </div>
      <div className="session-hud-stat">
        <span className="session-hud-label">Moves</span>
        <span className="session-hud-value">{moves}</span>
      </div>
      <div className="session-hud-stat">
        <span className="session-hud-label">Time</span>
        <span className="session-hud-value">{formatElapsed(elapsedSeconds)}</span>
      </div>
    </div>
  )
}
