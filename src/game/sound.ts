let audioContext: AudioContext | null = null

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }
  return audioContext
}

function beep(frequency: number, durationMs: number, volume: number) {
  const ctx = getContext()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'square'
  oscillator.frequency.value = frequency
  oscillator.connect(gain)
  gain.connect(ctx.destination)

  const now = ctx.currentTime
  const durationSec = durationMs / 1000
  gain.gain.setValueAtTime(volume, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec)
  oscillator.start(now)
  oscillator.stop(now + durationSec)
}

/** Uniform click used for every segment interaction — identical regardless of the move, so it carries no hint about correctness. */
export function playSegmentClick() {
  beep(440, 55, 0.045)
}

/** Short victory arpeggio played once the equation is solved. */
export function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
  notes.forEach((frequency, i) => {
    window.setTimeout(() => beep(frequency, 180, 0.07), i * 120)
  })
}

/** Random static crackle accompanying the pre-reveal flicker animation. Returns a stop function to cancel any pending blips early. */
export function playBootSequence(durationMs: number): () => void {
  const stepMs = 130
  const steps = Math.floor(durationMs / stepMs)
  const timeoutIds: number[] = []

  for (let i = 0; i < steps; i++) {
    const id = window.setTimeout(() => {
      const frequency = 180 + Math.random() * 420
      beep(frequency, 35, 0.03)
    }, i * stepMs)
    timeoutIds.push(id)
  }

  return () => {
    timeoutIds.forEach((id) => window.clearTimeout(id))
  }
}
