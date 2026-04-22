/**
 * Cross-component pub/sub for the marketing globe experience.
 *
 * Three channels:
 *   1. Progress channel — scroll position normalised to [0, 1]. The
 *      `useScrollDriver` hook publishes; the camera driver, the
 *      moving-pin overlay (region swap), and any scroll-aware UI
 *      subscribe.
 *   2. Chain channel — synthetic audit-chain events. The pin overlay
 *      and scrollytelling triggers publish; the AuditTicker,
 *      LiveCounter, and ProvenanceCard overlay subscribe.
 *   3. Provenance channel — fired when a hash chip is clicked. The
 *      ProvenanceCardOverlay subscribes.
 *
 * Pure module-level state — no React, no MapLibre. Safe to import
 * from anywhere on the public marketing tree.
 */

import { cameraAt, type CameraSample, type Region } from './cameraPath'

// ─── Progress + camera channel ────────────────────────────────────────────

let progress = 0
let lastSample: CameraSample = cameraAt(0)

type ProgressListener = (t: number) => void
type CameraListener = (sample: CameraSample) => void
type RegionListener = (region: Region) => void

const progressListeners = new Set<ProgressListener>()
const cameraListeners = new Set<CameraListener>()
const regionListeners = new Set<RegionListener>()

export function getScrollProgress(): number {
  return progress
}

export function getCameraSample(): CameraSample {
  return lastSample
}

export function getCurrentRegion(): Region {
  return lastSample.region
}

export function setScrollProgress(t: number): void {
  // No early-out on equal values — the camera path uses ease-in-out
  // and consumers (notably the camera driver) batch via rAF, so we
  // pass every change through. Region listeners are cheap (one-line
  // diff check below).
  progress = t
  const next = cameraAt(t)
  const regionChanged = next.region !== lastSample.region
  lastSample = next

  cameraListeners.forEach((cb) => cb(next))
  progressListeners.forEach((cb) => cb(t))
  if (regionChanged) regionListeners.forEach((cb) => cb(next.region))
}

export function subscribeToProgress(cb: ProgressListener): () => void {
  progressListeners.add(cb)
  return () => progressListeners.delete(cb)
}

export function subscribeToCamera(cb: CameraListener): () => void {
  cameraListeners.add(cb)
  return () => cameraListeners.delete(cb)
}

export function subscribeToRegion(cb: RegionListener): () => void {
  regionListeners.add(cb)
  return () => regionListeners.delete(cb)
}

// ─── Chain channel ────────────────────────────────────────────────────────

export type ChainEventKind = 'asset' | 'sensor' | 'alert' | 'license' | 'assay'

export interface ChainEvent {
  /** Synthetic SHA-256-style hex (16 chars shown, 64 chars total). */
  hash: string
  /** Block index — strictly monotonic across the visit. */
  block: number
  /** Time emitted (ms epoch). */
  ts: number
  /** Originating coords for camera flyback. */
  lng: number
  lat: number
  kind: ChainEventKind
  /** Originating pin/route id (for trace-back display). */
  source: string
  /** Human-readable label, e.g. "AST-1041 · checkpoint". */
  label: string
  /** Optional witness/operator name. */
  witness?: string
  /** Optional evidence list shown on the provenance card. */
  evidence?: string[]
}

type ChainListener = (event: ChainEvent) => void

const chainListeners = new Set<ChainListener>()
let blockCounter = 0
let lastHash = '0000000000000000000000000000000000000000000000000000000000000000'
const recent: ChainEvent[] = []
const MAX_RECENT = 32

export function getRecentChain(): ChainEvent[] {
  return recent.slice()
}

export function getChainHead(): { hash: string; block: number } {
  return { hash: lastHash, block: blockCounter }
}

export function emitChainEvent(
  partial: Omit<ChainEvent, 'hash' | 'block' | 'ts'>,
): ChainEvent {
  blockCounter += 1
  const hash = synthHash(lastHash, partial.source, blockCounter, partial.lng, partial.lat)
  lastHash = hash
  const event: ChainEvent = {
    ...partial,
    hash,
    block: blockCounter,
    ts: Date.now(),
  }
  recent.unshift(event)
  if (recent.length > MAX_RECENT) recent.length = MAX_RECENT
  chainListeners.forEach((cb) => cb(event))
  return event
}

export function subscribeToChain(cb: ChainListener): () => void {
  chainListeners.add(cb)
  return () => chainListeners.delete(cb)
}

// ─── Synthetic hashing ────────────────────────────────────────────────────

/**
 * Deterministic non-crypto SHA-style hex string. Keeps the demo honest
 * (label says "synthetic") but visually indistinguishable from a real
 * SHA-256 for award-grade craft.
 */
function synthHash(prev: string, source: string, block: number, lng: number, lat: number): string {
  const seed = `${prev}|${source}|${block}|${lng.toFixed(5)}|${lat.toFixed(5)}|${performance.now()}`
  const h1 = fnv1a(seed)
  const h2 = fnv1a(seed + ':a')
  const h3 = fnv1a(seed + ':b')
  const h4 = fnv1a(seed + ':c')
  return [h1, h2, h3, h4].map((n) => n.toString(16).padStart(16, '0')).join('')
}

function fnv1a(input: string): bigint {
  let hash = 0xcbf29ce484222325n
  const PRIME = 0x100000001b3n
  for (let i = 0; i < input.length; i++) {
    hash ^= BigInt(input.charCodeAt(i))
    hash = BigInt.asUintN(64, hash * PRIME)
  }
  return hash
}

// ─── Provenance (click-to-trace) channel ──────────────────────────────────
//
// AuditTicker calls `openProvenance(event)` when a hash chip is clicked.
// The ProvenanceCardOverlay subscribes and reveals itself.

export interface ProvenanceTrigger {
  event: ChainEvent
}

type ProvenanceListener = (trigger: ProvenanceTrigger | null) => void

const provenanceListeners = new Set<ProvenanceListener>()

export function openProvenance(event: ChainEvent): void {
  provenanceListeners.forEach((cb) => cb({ event }))
}

export function closeProvenance(): void {
  provenanceListeners.forEach((cb) => cb(null))
}

export function subscribeToProvenance(cb: ProvenanceListener): () => void {
  provenanceListeners.add(cb)
  return () => provenanceListeners.delete(cb)
}
