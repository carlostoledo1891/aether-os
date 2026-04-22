# Wave 1 — Mobile Safari smoke procedure

> Status: **procedure prepared, awaiting on-device run by CTO.**
> Plan reference: `.cursor/plans/wave_1_final_sprint_c23e42d0.plan.md` § 1.1.
> Done-checklist row: `AGENT.md` Deployment Parity Done Checklist (Wave 1
> public verifier line).

This file is the deterministic recipe a human runs on a real iPhone before
Wave 1 is considered launched. Do not skip steps. Do not run in iOS Safari's
Web Inspector first — the device-only smoke is the point.

## Pre-conditions

- Latest `main` is deployed to the staging environment (or production-equivalent).
- `verochain.co` (or the staging hostname) is reachable from the test device.
- The reference bundle hash is known. To find it: read the most recent
  `[seed] /verify/<hash>` line from the API server boot log, or fetch the
  hash directly:

  ```bash
  curl -s https://verochain.co/api/admin/verifier-stats | jq .
  ```

  …then pick any bundle hash it lists. For a fresh DB, the seeded reference
  bundle's hash is also persisted in `docs/REFERENCE_BUNDLE_HASH.txt` (when
  that anchor file is committed) and is the recommended target.

## Devices

Required:

- A real iPhone running iOS Safari (NOT Safari on macOS, NOT a simulator).
  Latest stable iOS preferred. Older iOS counts as a bonus pass — record
  the version regardless.

Nice-to-have (not blocking launch):

- iPad Safari, Android Chrome, desktop Firefox/Safari.

## Procedure

For each device:

1. Open Safari and clear the site cache for `verochain.co` (Settings →
   Safari → Advanced → Website Data, or "Clear History and Website Data").
2. Navigate to `https://verochain.co/verify/<reference-bundle-hash>`.
3. Confirm the **Loading** card appears within 2 seconds.
4. Confirm the card transitions to **Verifying N / N**.
5. Confirm the card transitions to a green **Valid — N events** verdict.
6. Tap **Re-verify in your tab**. Confirm the verdict re-appears (Verifying
   spinner cycles, then Valid). The button must NOT call the server again
   (network tab in Safari's web inspector, if used, should show no fetch
   on click — but the smoke does not require the inspector).
7. Tap **Download bundle JSON**. Confirm a file downloads with name
   `bundle-BDL-*.json` and that it parses as JSON in a text app.
8. Scroll to the **What is this?** explainer. Tap the
   `docs/spec/audit-event-v1.md` link. Confirm it opens to the spec on
   GitHub.
9. Rotate the device to landscape. Confirm the verdict card and bundle meta
   stay readable (no horizontal scroll on hash strings; the hash should
   wrap or truncate gracefully).
10. Force-quit Safari, reopen, paste the URL again. Confirm the cold-cache
    flow still completes within 5 seconds.

## Edge cases to capture

11. Open `https://verochain.co/verify/0000000000000000000000000000000000000000000000000000000000000000`
    (a deliberately wrong hash). Confirm a red **Bundle not found** card
    with the reason text and a link back to landing.
12. (Bonus) On a browser without `crypto.subtle` (e.g. very old corporate
    iOS via Lockdown Mode or an in-app webview), confirm the
    **Verifier unavailable in this browser** card appears with the chain
    hash, a copyable `curl` line, and the spec link. The browser must NOT
    silently fall back to "trust the server".

## Recording the result

Append a row below before flipping the launch switch.

| Date (UTC) | Tester | Device + iOS version | Result | Notes / artifacts |
|------------|--------|----------------------|--------|-------------------|
|            |        |                      |        |                   |

Failure modes that must block launch:

- Verdict never reaches **Valid** within 10 seconds on a clean cold load.
- "Re-verify in your tab" does not reproduce the verdict.
- "Download bundle JSON" produces a 0-byte file, an HTML error page, or
  fails to download at all.
- The page crashes Safari, hangs the tab for >15 seconds, or pegs CPU
  long enough to trigger the "Page Using Significant Energy" warning on
  visit (a long verification on a huge bundle is expected; persistent CPU
  after the verdict is not).

If any of those occur, file a ticket, halt the rest of the sprint, and
return to fix before re-running this procedure.

## After a passing run

1. Tick the Wave 1 row in `AGENT.md`'s Deployment Parity Done Checklist.
2. Cite the row above (date + device + tester) in the launch post under
   `docs/launch/wave-1-public-verifier.md` § "Smoke evidence".
3. Proceed with the rest of Day 4 (post + recording).

---

## Addendum — `/app/maritime` workspace smoke (Multi-Instance sprint, week 3)

> Status: **procedure prepared, awaiting on-device run.**
> Plan reference: `.cursor/plans/multi_instance_vero_*.plan.md` § Week 3.
> Done-checklist row: `AGENT.md` Deployment Parity Done Checklist (Multi-instance maritime line).

The Atlantic Maritime instance ships the same shell + audit-chain
runtime as the Caldeira workspace, so the verification path above
applies unchanged — except the URL is the maritime reference bundle
hash (printed at boot as `[seed] /verify/<hash>` for `BDL-...` rooted
at SITE-MARITIME).

In addition to the existing 12 checks, run these workspace checks for
`/app/maritime`:

1. Open `https://verochain.co/app/maritime` on a real iPhone in iOS Safari.
2. Confirm the brand strip shows **Atlantic Coast Maritime Authority** with
   the four KPI chips (`11 AOIs`, `78 vessels`, `4 dark`, `3 ISR`).
3. Confirm at least the following render on the map within 5 seconds:
   - colored AOI polygons (cyan, red, violet, green) with labels;
   - circle vessel markers — at least 4 of which pulse red as
     dark-vessel anomalies;
   - sensor coverage halos around shore radars / drones.
4. Confirm the **Dark · 4** alert ribbon strip appears beneath the
   chrome and that each alert chip is tappable.
5. Tap **Vessels** in the LensBar and confirm only vessel markers remain
   on the map (sensors, AOIs hidden / dimmed per lens).
6. Tap **Alerts** in the LensBar and confirm the map filters to alert
   markers only. Tap one alert chip in the ribbon and confirm a small
   "Selected …" pill appears at the bottom centre with the unit id.
7. Rotate to landscape. The map should occupy the full viewport with
   chrome + lens bar visible; no horizontal scroll.
8. Force-quit Safari, reopen, hit the URL again. Confirm the workspace
   reaches the same steady state within 8 seconds on a cold cache.
9. From the workspace, navigate to the maritime reference bundle's
   `/verify/<hash>` URL and run the existing 12-step verifier check
   above.

Failure modes that block launch (in addition to the verifier ones):

- The map fails to load tiles, throws a quota / 401 error, or pins the
  globe to (0,0).
- Animated vessel positions do not visibly update over a 30 second
  observation window (the maritime mock telemetry runs every 2 s).
- Dark-vessel ribbon does not appear, OR appears with `0` chips.
- Tapping a LensBar lens does not change the map state inside 1 s.

### Recording the result

| Date (UTC) | Tester | Device + iOS version | Workspace result | Verifier result | Notes |
|------------|--------|----------------------|------------------|-----------------|-------|
|            |        |                      |                  |                 |       |
