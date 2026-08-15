# Code Reusability & Organization Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish + de-duplicate the in-flight refactor: extract shared animation constants, skill-image handling, section headers, and the section-ref hook; remove dead code (ToolPanel, Chip, Card variant/icon/title) and fix 2 stale Card tests.

**Architecture:** A sequence of small, independently verifiable tasks. No runtime behavior or visual changes.

**Tech Stack:** React 19 + TS strict, framer-motion, Tailwind v4, Vitest + RTL, eslint-plugin-react-hooks.

**Baseline:** Current working tree already contains the in-flight refactor (uncommitted). `Card.test.tsx` has 2 known failures. Do not touch TerminalFrame, BackgroundDecoration, Hero, Contact, MenuBar, Lightbox, ProjectDetail.

## Global Constraints

- Use `@/` path alias for all internal imports.
- No hardcoded user-facing strings in components — text lives in `src/locales/{en,br}.json`.
- TypeScript strict mode on; `noUnusedLocals`/`noUnusedParameters` enabled.
- Preserve the code-as-UI aesthetic (emerald accents, mono fonts, terminal chrome).
- `useSectionRefs` callers must pass module-scope (stable) path maps.

---

### Task 1: Shared lib helpers — `src/lib/motion.ts`, `src/lib/assets.ts`

**Files:**

- Add: `src/lib/motion.ts`, `src/lib/assets.ts`

- [ ] **Step 1: `src/lib/motion.ts`**

```ts
import type { Variants } from "framer-motion";

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
```

- [ ] **Step 2: `src/lib/assets.ts`**

```ts
export function skillImageSrc(fileName: string): string {
  return `skill_images/${fileName}`;
}
```

- [ ] **Step 3: Verify**: `npm run typecheck`

---

### Task 2: Shared components — `SkillIcon`, `SectionHeader`

**Files:**

- Add: `src/components/SkillIcon/index.tsx`
- Add: `src/components/SectionHeader/index.tsx`
- Add: `src/components/SkillIcon/SkillIcon.test.tsx`
- Add: `src/components/SectionHeader/SectionHeader.test.tsx`

- [ ] **Step 1: `SkillIcon`** — wraps the repeated skill-image `<img>`:

```tsx
interface SkillIconProps {
  imageSrc: string;
  className?: string;
  width?: number;
  height?: number;
}

export function SkillIcon({ imageSrc, className = "", width, height }: SkillIconProps) {
  return (
    <img
      src={skillImageSrc(imageSrc)}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      className={cn("object-contain", className)}
    />
  );
}
```

- [ ] **Step 2: `SectionHeader`** — centered title block used by Projects/Experiences/Credentials/Expertise:

```tsx
interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

export function SectionHeader({ title, subtitle, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-6 p-6 text-center">
      <h3 className="font-bold text-4xl sm:text-3xl tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      {subtitle && (
        <p className="text-lg font-mono text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      )}
      {description && (
        <p className="text-zinc-700 dark:text-zinc-200 text-2xl font-bold max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Tests** — render assertions for title, optional subtitle/description, and (SkillIcon) src/alt/loading attributes.
- [ ] **Step 4: Verify**: `npm test -- --run src/components/SkillIcon src/components/SectionHeader`

---

### Task 3: Simplify `Card` + fix tests

**Files:**

- Modify: `src/components/Card/index.tsx`
- Modify: `src/components/Card/Card.test.tsx`

- [ ] **Step 1:** Remove `Chip` export, `variant` prop, `icon`/`title` props. Keep `shade` (default `"soft"`), `className`, `children`. Body wrapper `p-6 sm:p-8` stays; header block goes away.
- [ ] **Step 2:** Update `Card.test.tsx`: drop Chip/variant/title/icon tests; fix shade assertions to match `SECTION_SHADES` (`soft` → `bg-zinc-50 dark:bg-zinc-950`, `gray` → `bg-zinc-100 dark:bg-zinc-900`; `white`/`green` stay).
- [ ] **Step 3: Verify**: `npm test -- --run src/components/Card`

---

### Task 4: `useSectionRefs` hook

**Files:**

- Modify: `src/context/ActiveSectionContext.tsx`

- [ ] **Step 1:** Add (single `useContext` + `useMemo`, no hooks-in-loop):

```tsx
export function useSectionRefs(
  paths: Record<string, string>,
): Record<string, RefCallback<HTMLElement>> {
  const context = useContext(ActiveSectionContext);
  if (!context) throw new Error("useSectionRefs must be used within ActiveSectionProvider");
  const { register } = context;
  return useMemo(() => {
    const refs: Record<string, RefCallback<HTMLElement>> = {};
    for (const [id, path] of Object.entries(paths)) {
      refs[id] = (element: HTMLElement | null) => {
        if (element) register(element, path);
      };
    }
    return refs;
  }, [register, paths]);
}
```

- [ ] **Step 2: Verify**: `npm run typecheck`

---

### Task 5: Experiences — delete ToolPanel, use shared pieces

**Files:**

- Delete: `src/modules/Experiences/ToolPanel.tsx`, `src/modules/Experiences/ToolPanel.test.tsx`
- Modify: `src/modules/Experiences/index.tsx`

- [ ] **Step 1:** Delete ToolPanel files.
- [ ] **Step 2:** Local `interface ToolItem { id: string; label: string; imageSrc: string }` (replaces the import from ToolPanel).
- [ ] **Step 3:** Use `fadeUpVariants` from `@/lib/motion`; replace the inline tool-grid `<img>` with `SkillIcon` (keep the dynamic `size-${imgSize / 4}` class logic via className, and `width`/`height` = imgSize).
- [ ] **Step 4:** Use `SectionHeader` for the title/start–end/description block (note: current markup is `flex flex-col gap-6 p-6 text-center` — verify SectionHeader matches exactly, adjusting classNames if needed).
- [ ] **Step 5:** Extract the 2× "`>` arrow-list" into a local `BulletList` helper within the file.
- [ ] **Step 6:** Replace the per-item ref record with `useSectionRefs` (module-scope path map).
- [ ] **Step 7: Verify**: `npm test -- --run src/modules/Experiences`

---

### Task 6: Projects, Credentials, Expertise, Skill

**Files:**

- Modify: `src/modules/Projects/index.tsx`
- Modify: `src/modules/Credentials/index.tsx`
- Modify: `src/modules/Expertise/index.tsx`
- Modify: `src/modules/Expertise/Skill.tsx`

- [ ] **Step 1: Projects** — `fadeUpVariants` + `SectionHeader` + `useSectionRefs(PROJECT_PATHS)` (already module-scope).
- [ ] **Step 2: Credentials** — `fadeUpVariants` + `SectionHeader` (subtitle = institution (period); keep its different layout — icon + card are untouched).
- [ ] **Step 3: Expertise** — `staggerContainerVariants` + `fadeUpVariants` + `SectionHeader` (title-only); derive module-scope path map `Object.fromEntries(expertise.map((c) => [c.id, \`~/expertise/${c.id}\`]))`; remove the hardcoded `capabilityRefs` and the DEV warning block.
- [ ] **Step 4: Skill.tsx** — use `SkillIcon` (size-4.5 via className, width/height 18).
- [ ] **Step 5: Verify**: `npm test -- --run src/modules` + `npm run typecheck`

---

### Task 7: Full verification

- [ ] **Step 1**: `npm test`
- [ ] **Step 2**: `npm run typecheck`
- [ ] **Step 3**: `npm run lint`
- [ ] **Step 4**: `npm run build`
- [ ] **Step 5**: Grep cleanliness: no `ToolPanel`, no `skill_images/` template literals, no `variant="item"`, no `Chip`, no duplicate `itemVariants`/`containerVariants` definitions.
