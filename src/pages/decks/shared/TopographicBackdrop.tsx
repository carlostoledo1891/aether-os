import { W, V } from '../../../theme/publicTheme'

/**
 * Abstract topographic / contour backdrop for deck covers. Pure SVG — no
 * external deps, no WebGL, safe inside headless snapshot tests. Replaces the
 * live MapBase previously mounted on cover slides.
 *
 * Renders as an `absolute; inset: 0; zIndex: 0` layer. Caller is expected to
 * place foreground content in a sibling with `position: relative; zIndex: 1`.
 */
export function TopographicBackdrop() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 45%, ${V}14 0%, transparent 65%),
            radial-gradient(ellipse 90% 70% at 50% 120%, ${V}10 0%, transparent 70%),
            linear-gradient(180deg, ${W.bg} 0%, ${W.canvas} 100%)
          `,
        }}
      />
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.45,
          mixBlendMode: 'screen',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.1) 85%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.1) 85%, transparent 100%)',
        }}
      >
        <defs>
          <linearGradient id="tb-stroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={V} stopOpacity="0.85" />
            <stop offset="100%" stopColor={V} stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#tb-stroke)" strokeWidth="1.1">
          {CONTOUR_PATHS.map((d, i) => (
            <path key={i} d={d} opacity={0.25 + (i % 5) * 0.12} />
          ))}
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 55% 45% at 50% 50%, transparent 0%, transparent 50%, ${W.bg}CC 100%)`,
        }}
      />
    </div>
  )
}

const CONTOUR_PATHS: readonly string[] = [
  'M 200 560 C 360 430 520 420 700 500 C 880 580 1060 600 1220 540 C 1360 490 1480 500 1580 540',
  'M 180 600 C 340 460 520 440 720 530 C 900 610 1080 630 1260 570 C 1400 520 1500 530 1590 570',
  'M 160 650 C 320 500 520 470 740 570 C 920 650 1100 670 1290 600 C 1430 550 1530 560 1595 600',
  'M 140 700 C 300 540 520 500 760 610 C 940 690 1120 710 1310 640 C 1460 590 1560 590 1600 640',
  'M 120 760 C 280 580 520 530 780 650 C 960 740 1140 760 1340 680 C 1480 630 1580 630 1600 680',
  'M 260 500 C 400 390 560 390 720 460 C 880 530 1040 550 1200 500 C 1340 460 1460 460 1560 500',
  'M 300 440 C 430 340 580 340 720 410 C 860 470 1020 500 1180 460 C 1310 430 1430 430 1520 460',
  'M 340 390 C 460 300 590 300 720 360 C 850 410 990 440 1160 410 C 1290 390 1400 390 1480 410',
  'M 380 340 C 490 260 600 260 720 310 C 840 350 970 380 1130 360 C 1260 340 1360 340 1440 360',
  'M 420 290 C 520 220 610 220 720 260 C 830 300 950 320 1100 310 C 1220 300 1320 300 1400 310',
  'M 460 240 C 550 180 620 180 720 210 C 820 240 930 260 1070 260 C 1180 260 1280 260 1360 260',
  'M 500 200 C 580 150 640 150 720 170 C 810 190 910 200 1040 210 C 1150 220 1240 220 1320 220',
  'M 200 820 C 360 720 520 720 700 790 C 870 850 1040 860 1220 810 C 1360 780 1480 790 1580 810',
  'M 180 860 C 340 760 520 750 720 820 C 890 880 1070 890 1260 840 C 1400 810 1510 820 1595 840',
  'M 160 900 C 320 800 520 790 740 860 C 910 910 1100 920 1290 870 C 1430 840 1540 850 1598 870',
  'M 560 560 C 610 520 670 520 720 560 C 770 600 820 600 880 560 C 930 530 980 530 1040 560',
  'M 580 600 C 640 560 690 560 730 600 C 780 640 830 640 880 600 C 930 570 990 570 1060 600',
  'M 600 640 C 650 600 700 600 740 640 C 790 680 840 680 890 640 C 940 610 1000 610 1080 640',
]
