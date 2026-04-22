# Wave 1 — 90-second verifier screen recording runbook

**Owner:** CTO
**Hosting target:** committed under `docs/launch/wave-1-verifier.mp4` for
the canonical copy; optionally mirrored at a Loom / YouTube link
captured below for the social posts.
**Reference URL:** <https://verochain.co/verify/c1a32f57bf64b88c845166007e16f12a3522589dcc4f90cad572f14ba8512d1a>

This is the deterministic shot list for the 90-second screen recording
the launch post (`docs/launch/wave-1-public-verifier.md`) embeds. The
recording cannot be authored by the agent; it must be captured by a
human against the deployed staging URL with the seeded reference bundle
present. Follow the storyboard exactly — the cuts are timed so the
verdict lands at the same moment in the LinkedIn 16:9 crop, the X 1:1
crop, and the embedded `<video>` tag in `/trust`.

## Pre-flight

Run these before opening the recorder so the take is single-cut:

- [ ] `npm run verify:release` is green on the SHA we're recording.
- [ ] The staging deploy points at the same SHA (check
      `__VERO_RUNTIME_CONFIG__` in DevTools).
- [ ] `docs/REFERENCE_BUNDLE_HASH.txt` matches the URL above
      (`server/src/__tests__/referenceBundle.test.ts` passes).
- [ ] Browser is **Chrome stable**, fresh profile, no extensions, 1440×900
      window, OS dark mode, system zoom 100%, "Hide bookmarks bar".
- [ ] Throttling: DevTools "No throttling". The point of the recording
      is to show the verdict actually *is* fast on a real machine.
- [ ] Close DevTools before recording (the verifier bus opens it; close
      it for the take).
- [ ] Audio: muted. We add narration in post if at all.

## Recording config

- Tool: macOS QuickTime "New Screen Recording" → "Selected Portion".
- Selection: just the browser window (no menu bar, no dock).
- FPS: 30. Cursor: shown. Click highlight: on.
- Output: H.264 1920×1080, ≤ 8 MB target. Trim to **≤ 90 seconds**.
  If the cut runs long, drop the explainer card pause first, then the
  re-verify pause.

## Storyboard (90 s budget)

| t (s) | Action | What the viewer sees |
|------:|--------|----------------------|
| 0–5   | Address bar already focused. Type / paste the verifier URL slowly. | URL bar fills. No tab content yet. |
| 5–7   | Press Return. | Loading card "Fetching bundle … from /api/public/bundles" (≤2 s). |
| 7–12  | Verdict resolves. | Verdict card flashes from cyan "Verifying" → green "Valid — N events". Pause 5 s on the green card so screenshots can be lifted from this frame. |
| 12–22 | Scroll slowly to the Bundle metadata card. | "Live data" badge visible. Bundle ID, root unit, claim, chain segment, root hash on screen. |
| 22–32 | Scroll back up to the Verdict card. Click **Re-verify in your tab**. | Card flashes to "Verifying 0/N" and back to green within 1–2 s. This is the moment the viewer realises it ran in their tab. |
| 32–44 | Click **Download bundle JSON**. | Browser save dialog opens; cancel after 1 s so the dialog flickers but doesn't dominate the recording. |
| 44–60 | Cmd+T to open a new tab. Paste the same URL. | A second tab loads, verdict resolves green again — proves the URL is content-addressed and reproducible. |
| 60–75 | Switch to the new tab. Open DevTools → Network. Filter to `verifier-telemetry`. Click **Re-verify in your tab**. | Network panel shows a single `204 POST verifier-telemetry`. Demonstrates the timing telemetry is honest, anonymous, and minimal. |
| 75–90 | Close DevTools. Highlight the URL bar one more time. Cut. | Final frame is the green verdict + reference URL visible. This is the OG-image / thumbnail crop. |

## Post-production

- Trim to ≤ 90 s.
- Export at 1920×1080 H.264, single audio track muted.
- Save as `docs/launch/wave-1-verifier.mp4`. **Do not** check in a
  >25 MB asset — re-encode if necessary; LinkedIn caps social uploads
  at ~200 MB but our repo cap is 25 MB to keep clones cheap.
- Generate a 1280×720 still of the green verdict frame and save it as
  `docs/launch/wave-1-verifier-poster.png`. The `<video>` tag in the
  trust page uses this as the `poster=` attribute.

## Hosted mirror (fill in before launch)

| Channel | URL | Captured by | Date |
|---------|-----|-------------|------|
| Loom (CTO master copy) | TBD | TBD | TBD |
| YouTube unlisted | TBD | TBD | TBD |
| LinkedIn native upload | (uploaded with post, no URL until live) | TBD | TBD |
| X / Twitter native | (uploaded with thread, no URL until live) | TBD | TBD |

When the recording is captured and committed, append a row to the
"Cross-publish targets" checklist in
[`docs/launch/wave-1-public-verifier.md`](./wave-1-public-verifier.md)
and tick the "screen recording committed" line in the launch
acceptance section of that file.

## Why this isn't a generated artifact

The recording is the only piece of the launch that has to be captured
against a real browser running real CPU on a real machine. An
animation rendered by the agent would defeat the purpose of the
launch — the entire point is "your machine ran it". The agent
contributes the storyboard, the pre-flight checklist, and the
verification that the underlying URL is deterministic; the human
contributes the cursor, the tab, and the take.
