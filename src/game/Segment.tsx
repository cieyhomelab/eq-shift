type SegmentProps = {
  slot: string
  lit: boolean
  selected: boolean
  animating: boolean
  onClick: () => void
}

export function Segment({ slot, lit, selected, animating, onClick }: SegmentProps) {
  const className = [
    'segment',
    `slot-${slot}`,
    animating ? 'segment--boot' : lit ? 'segment--lit' : 'segment--unlit',
    selected ? 'segment--selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={animating}
      aria-pressed={selected}
      aria-label={animating ? 'segment initializing' : `${lit ? 'lit' : 'unlit'} segment`}
    />
  )
}
