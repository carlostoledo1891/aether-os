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

  it('exports all numeric glass tokens used in map overlays', () => {
    // These tokens were referenced in production components — pin them so
    // a rename/removal fails here before reaching the Vercel build.
    expect(W.glass02).toBeDefined()   // glass02
    expect(W.glass03).toBeDefined()   // WeatherTileOverlay, CptecForecastCard rows
    expect(W.glass04).toBeDefined()   // HydroOverlay spring event block
    expect(W.glass05).toBeDefined()   // various overlays
    expect(W.glass06).toBeDefined()   // glassHover alias
    expect(W.glass07).toBeDefined()   // map overlay backgrounds
    expect(W.glass08).toBeDefined()   // WeatherTileOverlay (was incorrectly glass10)
    expect(W.glass12).toBeDefined()   // hydro node fill
  })

  it('does NOT export glass10 — the token that caused a build breakage', () => {
    // glass10 was referenced by WeatherTileOverlay before the fix; this test
    // ensures that (a) the bad token is gone and (b) any accidental re-add
    // fails immediately rather than at deploy time.
    expect((W as Record<string, unknown>)['glass10']).toBeUndefined()
  })

  it('exports radius scale with expected shape', () => {
    expect(typeof W.radius.xs).toBe('number')
    expect(typeof W.radius.sm).toBe('number')
    expect(typeof W.radius.md).toBe('number')
    expect(typeof W.radius.lg).toBe('number')
    // Values increase from xs → lg
    expect(W.radius.sm).toBeGreaterThan(W.radius.xs)
    expect(W.radius.md).toBeGreaterThan(W.radius.sm)
    expect(W.radius.lg).toBeGreaterThan(W.radius.md)
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
