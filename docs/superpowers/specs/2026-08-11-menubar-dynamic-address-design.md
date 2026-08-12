# MenuBar Dynamic Address

**Date:** 2026-08-11
**Status:** Design

## Summary

Replace sticky terminal titles (commit `7e8b624`) with a dynamic path address in the MenuBar. As the user scrolls, the MenuBar displays a terminal-style path (`@username:~/section` or `@username:~/section/card`) matching the most visible content. Reverts the sticky titles commit.

## Architecture

An `ActiveSectionProvider` runs a single `IntersectionObserver`. Sections and cards register themselves with the observer via a `useActiveSection(path)` hook that returns a ref callback. The observer tracks intersection ratios for all registered elements and exposes the highest-ratio visible element's path through React context. The MenuBar consumes the path and renders it with a CSS fade-in animation on change.

```
ActiveSectionProvider (IntersectionObserver)
  ├─ useActiveSection(path) → ref (used by sections/cards)
  └─ Context value: { activePath }
       └─ MenuBar reads activePath → renders @user:~/...
```

## Files

| Action | File                                     | Change                                          |
| ------ | ---------------------------------------- | ----------------------------------------------- |
| Revert | `src/components/TerminalFrame/index.tsx` | Remove sticky classes from title bars           |
| Create | `src/context/ActiveSectionContext.tsx`   | Context, Provider, IntersectionObserver         |
| Modify | `src/modules/MenuBar/index.tsx`          | Dynamic path rendering with animation           |
| Modify | `src/pages/home/index.tsx`               | Register sections/cards with `useActiveSection` |
| Modify | `src/pages/Layout.tsx`                   | Wrap with `<ActiveSectionProvider>`             |
| Modify | `src/globals.css`                        | Add `fade-in` keyframe                          |

## Components

### ActiveSectionContext (new file: `src/context/ActiveSectionContext.tsx`)

**Exports:**

- `<ActiveSectionProvider>` — wraps children, runs one `IntersectionObserver`, provides `activePath` via context
- `useActiveSection(path: string)` — returns a `RefCallback<HTMLElement>`; registers element with observer on mount, unregisters on unmount
- `useActivePath()` — returns `activePath: string | null` for consumers like MenuBar

**Observer config:**

- `threshold`: `[0, 0.25, 0.5, 0.75, 1.0]` — granular ratio tracking
- `rootMargin`: `"0px 0px -10% 0px"` — slight bottom margin to favor elements near top
- Tracks `Map<Element, { path, ratio }>`; on intersection callback updates ratio; sets `activePath` to the entry with the highest ratio > 0, or `null` when no element is visible

### MenuBar display

```tsx
@<span>{username}</span>:<span key={activePath} className="animate-fade-in">
  {activePath ?? "~"}
</span>
```

The `key={activePath}` forces a remount on every path change, re-triggering the CSS animation. No animation library needed.

### fade-in animation (src/globals.css)

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Path Mapping

Each section/card registers with `useActiveSection`:

| Element                                    | Path                     |
| ------------------------------------------ | ------------------------ |
| Hero section                               | `null` → renders `~`     |
| Projects section (TerminalFrame)           | `~/projects`             |
| Project card "Atalaia Pro" (TerminalPanel) | `~/projects/atalaia-pro` |
| Project card "Penhor"                      | `~/projects/penhor`      |
| Project card "Bolso Bom"                   | `~/projects/bolso-bom`   |
| Project card "Musica Show"                 | `~/projects/musica-show` |
| Expertise section (TerminalFrame)          | `~/expertise`            |
| Each expertise capability TerminalPanel    | `~/expertise/{slug}`     |
| About section                              | `~/about`                |
| Education section                          | `~/education`            |

Path segments are slugified, lowercase, hyphenated — file-system-like, language-independent (same in both locales).

## Edge Cases

- **No element visible** → `activePath = null`, MenuBar shows `~`
- **Two elements partially visible** → highest intersection ratio wins
- **Fast scrolling** → path updates per observer callback, no debounce needed
- **MenuBar dropdown** — TerminalFrame without title, unaffected
- **Contact bar** — unchanged
- **ContactFooter** — deliberately not registered: it is `fixed` and always visible, so its intersection ratio would be permanently 1.0 and it would dominate the ratio race, pinning the path to `~/contact`. Scrolled to the page bottom, the last section (Education) remains the active path.

## Revert

Undo commit `7e8b624` by removing:

- `sticky top-14 z-20 backdrop-blur-md` from TerminalFrame title bar
- `sticky top-[6.25rem] z-10 backdrop-blur-md` from TerminalPanel title bar
