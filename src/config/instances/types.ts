/**
 * Instance config — shared shape used by every Vero instance (meteoric,
 * maritime, _empty, and any future use case). Drives chrome copy, the
 * map starting view, KPI selection, and which data-service factory the
 * instance uses.
 *
 * Composition rule: instance configs MUST NOT introduce new component
 * primitives or design tokens. They are pure data.
 */

import type { ReactNode } from 'react'
import type { Lens } from 'shared/units/types'

export type InstanceSlug = 'meteoric' | 'maritime' | '_empty'

/** Camera preset for the instance's primary map. Matches MapBase's view shape. */
export interface InstanceCameraPreset {
  longitude: number
  latitude: number
  zoom: number
  pitch: number
  bearing: number
}

/** Brand strip copy shown in the workspace chrome header. */
export interface InstanceBrandCopy {
  brandLine: string
  productLine: string
  /** Optional one-line subtitle under the brand strip (e.g. tenant location). */
  contextLine?: string
}

/** Static KPI card definition rendered in the chrome KPI strip. */
export interface InstanceKpi {
  id: string
  label: string
  /** Static demo value — instance configs are pure data, no live computation. */
  value: string
  /** Optional sublabel/unit. */
  unit?: string
  /** Optional accent token name (must be one of the existing var(--w-*) tokens). */
  accentToken?: string
}

/** Picker card metadata used by EmptyShell to render "Pick a use case". */
export interface InstancePickerCard {
  /** Eyebrow line above the title (e.g. "Mining · Critical minerals"). */
  eyebrow: string
  title: string
  description: string
  /** Fictional or named tenant the instance demos. */
  tenant: string
  /** Inline link CTA copy ("Open instance"). */
  ctaLabel: string
}

/** Optional, instance-defined chrome icon glyph (a string only — no SVG components). */
export interface InstanceConfig {
  slug: InstanceSlug
  /** Short label used in URL-bar adjacent badges and breadcrumbs. */
  label: string
  brand: InstanceBrandCopy
  /** The map's initial camera. Maritime / Meteoric override; _empty falls back to a global view. */
  cameraPreset: InstanceCameraPreset
  /** Static demo KPI strip — composition only, no live data fetching. */
  kpis: InstanceKpi[]
  /** Card content for the EmptyShell picker. */
  pickerCard: InstancePickerCard
  /** Whether this instance is selectable from the EmptyShell picker. _empty itself is not. */
  selectable: boolean
  /** Inline glyph (single-character or short string) shown in the picker card. */
  glyph?: string
  /**
   * Optional render override for the workspace body. EmptyShell, Meteoric,
   * and Maritime each provide their own. Wrapped in <Suspense> by the
   * caller, so it can lazy-load.
   */
  renderWorkspace?: () => ReactNode
  /**
   * Optional instance-specific lens set. When provided, the workspace
   * `useLens(...)` hook falls back to these instead of the global
   * mining-shaped registry. The default lens (first in the list, unless
   * overridden by `defaultLensId`) is the one that loads on first paint.
   */
  lenses?: Lens[]
  defaultLensId?: string
}
