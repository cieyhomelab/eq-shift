type SegmentProps = {
  slot: string
  lit: boolean
  selected: boolean
  onClick: () => void
}

export function Segment({ slot, lit, selected, onClick }: SegmentProps) {
  const className = [
    'segment',
    `slot-${slot}`,
    lit ? 'segment--lit' : 'segment--unlit',
    selected ? 'segment--selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`${lit ? 'lit' : 'unlit'} segment`}
    />
  )
}
