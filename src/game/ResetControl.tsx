type ResetControlProps = {
  onReset: () => void
  resetDisabled: boolean
}

export function ResetControl({ onReset, resetDisabled }: ResetControlProps) {
  const className = ['reset-control', resetDisabled ? 'reset-control--disabled' : ''].filter(Boolean).join(' ')

  return (
    <div className={className}>
      <button className="reset-button" onClick={onReset} disabled={resetDisabled} aria-label="Reset" />
      <span className="reset-label">RESET</span>
    </div>
  )
}
