/**
 * Scroll progress windows for each marketing beat — single source of truth
 * for `ScrollyExperience` and `StoryChapterRail`. Keep in sync with copy/acts.
 */
export const MARKETING_CHAPTER_RANGES = [
  [0.0, 0.16],
  [0.19, 0.34],
  [0.37, 0.51],
  [0.54, 0.69],
  [0.71, 0.84],
  [0.87, 1.0],
] as const

export function getMarketingBeatCount(): number {
  return MARKETING_CHAPTER_RANGES.length
}

/** Active beat index for scroll progress `t` ∈ [0, 1] (handles camera-fly gaps between ranges). */
export function getMarketingBeatIndexForProgress(t: number): number {
  const clamped = Math.max(0, Math.min(1, t))
  const firstEnd = MARKETING_CHAPTER_RANGES[0][1]
  if (clamped <= firstEnd) return 0
  for (let i = 1; i < MARKETING_CHAPTER_RANGES.length; i++) {
    const start = MARKETING_CHAPTER_RANGES[i][0]
    const end = MARKETING_CHAPTER_RANGES[i][1]
    if (clamped < start) return i - 1
    if (clamped <= end) return i
  }
  return MARKETING_CHAPTER_RANGES.length - 1
}

/** Scroll progress at the midpoint of a beat’s range (for chapter navigation). */
export function getMarketingProgressForBeatMid(beatIdx: number): number {
  const row = MARKETING_CHAPTER_RANGES[beatIdx]
  if (!row) return 0
  const [a, c] = row
  return (a + c) / 2
}
