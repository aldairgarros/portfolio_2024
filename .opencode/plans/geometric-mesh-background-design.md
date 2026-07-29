# Geometric Mesh Background — Design Spec

**Status**: Approved (2026-07-28)

## Direction
Futuristic, angular, layered. No curves. Think Tron data center meets cyberpunk wireframe.

## Layer Architecture (bottom to top)

| Layer | Name | Shapes | Movement |
|-------|------|--------|----------|
| 1 | Perspective Grid | Square wireframe grid, 60px, `rotateX(70deg)` | Scroll-linked drift 0.15x |
| 2 | Circuit Network | Angular `<polyline>` paths + diamond nodes (8px squares, rotated 45°) | Nodes pulse opacity 0.06→0.20, staggered |
| 3 | Angular Accent Bars | 2 hard-edged gradient rectangles (400×200px), tilted 30°/45° | Mouse-linked drift opposite cursor |
| 4 | Metallic Grain | SVG fractalNoise, baseFrequency 0.85, 4 octaves | Static film grain |
| 5 | Scan Lines | CSS repeating linear-gradient, 3px bars, 60px spacing | Sweep downward, 6s loop |

**Zero: `rounded-*`, `blur-*`, `border-radius` anywhere.**

## File Changes
- `src/components/BackgroundDecoration/index.tsx` — full rewrite
