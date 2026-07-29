# Building Height + Parallax Changes

## File: `src/components/BackgroundDecoration/index.tsx`

### 1. Building heights → 100%

Replace ALL `height: "NN%"` with `height: "100%"` across all three arrays.

**BUILDINGS_BG** (lines 26-38):
```
{ left: "2%", width: 50, height: "100%", angled: false, spine: false },
{ left: "8%", width: 65, height: "100%", angled: false, spine: false },
{ left: "15%", width: 45, height: "100%", angled: true, spine: false },
{ left: "22%", width: 70, height: "100%", angled: false, spine: false },
{ left: "30%", width: 55, height: "100%", angled: true, spine: false },
{ left: "38%", width: 60, height: "100%", angled: false, spine: false },
{ left: "46%", width: 50, height: "100%", angled: false, spine: false },
{ left: "55%", width: 65, height: "100%", angled: true, spine: false },
{ left: "63%", width: 45, height: "100%", angled: false, spine: false },
{ left: "70%", width: 55, height: "100%", angled: false, spine: false },
{ left: "78%", width: 60, height: "100%", angled: true, spine: false },
{ left: "86%", width: 50, height: "100%", angled: false, spine: false },
{ left: "92%", width: 65, height: "100%", angled: false, spine: false },
```

**BUILDINGS_MID** (all heights → "100%")

**BUILDINGS_FG** (all heights → "100%")

### 2. Angled clipPath deeper

Change from:
```
"polygon(0% 100%, 0% 25%, 50% 0%, 100% 25%, 100% 100%)"
```
→
```
"polygon(0% 100%, 0% 40%, 50% 0%, 100% 40%, 100% 100%)"
```

### 3. Invert + deepen scroll parallax

Line 115: `useTransform(scrollYProgress, [0, 1], [0, -5])` → `[0, 6]`
Line 116: `useTransform(scrollYProgress, [0, 1], [0, -12])` → `[0, 18]`
Line 117: `useTransform(scrollYProgress, [0, 1], [0, -20])` → `[0, 35]`

### 4. Deeper mouse drift

Line 119: `[-3, 3]` → `[-5, 5]`
Line 120: `[-7, 7]` → `[-14, 14]`
Line 121: `[-14, 14]` → `[-28, 28]`

### 5. Building gradient extends to 80% (since 100% tall)

Change `transparent 60%` to `transparent 80%` in both light and dark gradient strings.
Change spine height from `h-[15%]` to `h-[25%]`.
