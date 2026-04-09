import { describe, it, expect } from 'vitest'
import { W, DOMAIN_COLORS, STATUS_PRIORITY } from './canvasTheme'

describe('canvasTheme W tokens', () => {
  it('exports all required surface tokens', () => {
    expect(W.bg).toBe('#07070E')
    expect(W.canvas).toBe('#060610')
    expect(W.panel).toBe('#0D0D1C')
    expect(W.surface).toBeDefined()
    expect(W.surfaceHigh).toBeDefined()
  })

  it('exports all required text tokens', () => {
    expect(W.text1).toBe('#ECECF8')
    expect(W.text2).toBe('#A0A0C8')
    expect(W.text3).toBe('#8888B8')
    expect(W.text4).toBe('#7878B0')
  })

  it('exports all accent colors', () => {
    expect(W.violet).toBe('#7C5CFC')
    expect(W.cyan).toBe('#00D4C8')
    expect(W.green).toBe('#22D68A')
    expect(W.amber).toBe('#F5A623')
    expect(W.red).toBe('#FF4D4D')
  })

  it('exports glow and subtle variants for all accents', () => {
    const accents = ['violet', 'cyan', 'green', 'amber', 'red'] as const
    for (const accent of accents) {
      const glowKey = `${accent}Glow` as keyof typeof W
      const subtleKey = `${accent}Subtle` as keyof typeof W
      expect(W[glowKey]).toBeDefined()
      expect(W[subtleKey]).toBeDefined()
    }
  })

  it('exports glass tokens', () => {
    expect(W.glass).toBeDefined()
    expect(W.glass02).toBeDefined()
    expect(W.glassHover).toBeDefined()
    expect(W.chromeBorder).toBeDefined()
    expect(W.hairlineBorder).toBeDefined()
    expect(W.chromeHeaderBg).toBeDefined()
  })
})

describe('DOMAIN_COLORS', () => {
  it('defines all five domains', () => {
    expect(Object.keys(DOMAIN_COLORS)).toEqual(
      expect.arrayContaining(['Extraction', 'Processing', 'Compliance', 'Environment', 'Critical'])
    )
  })

  it('each domain has border, bg, label, and text', () => {
    for (const domain of Object.values(DOMAIN_COLORS)) {
      expect(domain.border).toBeDefined()
      expect(domain.bg).toBeDefined()
      expect(domain.label).toBeDefined()
      expect(domain.text).toBeDefined()
    }
  })
})

describe('STATUS_PRIORITY', () => {
  it('failed has highest priority', () => {
    expect(STATUS_PRIORITY.failed).toBeGreaterThan(STATUS_PRIORITY.warning)
    expect(STATUS_PRIORITY.failed).toBeGreaterThan(STATUS_PRIORITY.running)
  })

  it('offline has lowest priority', () => {
    expect(STATUS_PRIORITY.offline).toBeLessThanOrEqual(STATUS_PRIORITY.idle)
  })
})
