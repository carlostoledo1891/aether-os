#!/usr/bin/env node
/**
 * fit-licence-hulls.mjs
 *
 * Adjusts licence polygons to tightly wrap their child drill holes
 * using a convex hull + radial buffer (~500 m ≈ 0.005°).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../src/data/geojson");

const LICENCE_PATH = resolve(DATA_DIR, "caldeira-licenses.geojson");
const DRILL_PATH = resolve(DATA_DIR, "caldeira-drillholes.geojson");
const BUFFER_DEG = 0.005; // ~500 m at this latitude

// ── Geometry helpers ─────────────────────────────────────────────

function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;
  const ring = polygon[0];
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i],
      [xj, yj] = ring[j];
    if (
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

function convexHull(points) {
  if (points.length < 3) return points;
  points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (O, A, B) =>
    (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0]);
  const lower = [];
  for (const p of points) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
    )
      lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
    )
      upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

function bufferHull(hull, bufferDeg) {
  const cx = hull.reduce((s, p) => s + p[0], 0) / hull.length;
  const cy = hull.reduce((s, p) => s + p[1], 0) / hull.length;
  return hull.map(([x, y]) => {
    const dx = x - cx,
      dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    return [x + (dx / dist) * bufferDeg, y + (dy / dist) * bufferDeg];
  });
}

// ── Main ─────────────────────────────────────────────────────────

const licences = JSON.parse(readFileSync(LICENCE_PATH, "utf-8"));
const drills = JSON.parse(readFileSync(DRILL_PATH, "utf-8"));

let updated = 0;

for (const lic of licences.features) {
  const poly = lic.geometry.coordinates;
  const childPoints = drills.features
    .filter((d) => pointInPolygon(d.geometry.coordinates, poly))
    .map((d) => [...d.geometry.coordinates]);

  if (childPoints.length < 3) {
    console.log(
      `  ⏭  ${lic.properties.name}: ${childPoints.length} drill(s) — kept original polygon`
    );
    continue;
  }

  const hull = convexHull(childPoints);
  const buffered = bufferHull(hull, BUFFER_DEG);
  buffered.push([...buffered[0]]); // close ring

  lic.geometry.coordinates = [buffered];
  updated++;
  console.log(
    `  ✅ ${lic.properties.name}: hull from ${childPoints.length} drills (${hull.length} vertices)`
  );
}

writeFileSync(LICENCE_PATH, JSON.stringify(licences, null, 2) + "\n");
console.log(
  `\nDone — ${updated}/${licences.features.length} licence polygons updated → ${LICENCE_PATH}`
);
