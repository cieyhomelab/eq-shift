import { describe, expect, it } from 'vitest'
import { formatElapsed } from './time'

describe('formatElapsed', () => {
  it('formats zero seconds', () => {
    expect(formatElapsed(0)).toBe('0:00')
  })

  it('zero-pads sub-10-second values', () => {
    expect(formatElapsed(7)).toBe('0:07')
  })

  it('rolls over past a minute', () => {
    expect(formatElapsed(65)).toBe('1:05')
  })
})
