/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefCallback,
} from "react";

interface ActiveSectionContextValue {
  activePath: string | null;
  register: (element: HTMLElement, path: string) => () => void;
}

const ActiveSectionContext = createContext<ActiveSectionContextValue | null>(null);

const THRESHOLDS = [0, 0.25, 0.5, 0.75, 1.0];
const ROOT_MARGIN = "0px 0px -10% 0px";

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [activePath, setActivePath] = useState<string | null>(null);
  const entriesRef = useRef(new Map<Element, { path: string; ratio: number }>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback((updates: IntersectionObserverEntry[]) => {
    const entries = entriesRef.current;
    for (const update of updates) {
      const entry = entries.get(update.target);
      if (entry) entry.ratio = update.intersectionRatio;
    }
    let bestPath: string | null = null;
    let bestRatio = 0;
    for (const { path, ratio } of entries.values()) {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestPath = path;
      }
    }
    setActivePath(bestPath);
  }, []);

  const register = useCallback(
    (element: HTMLElement, path: string) => {
      observerRef.current ??= new IntersectionObserver(handleIntersect, {
        root: null,
        rootMargin: ROOT_MARGIN,
        threshold: THRESHOLDS,
      });
      entriesRef.current.set(element, { path, ratio: 0 });
      observerRef.current.observe(element);
      return () => {
        observerRef.current?.unobserve(element);
        entriesRef.current.delete(element);
      };
    },
    [handleIntersect],
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const value = useMemo(() => ({ activePath, register }), [activePath, register]);

  return <ActiveSectionContext.Provider value={value}>{children}</ActiveSectionContext.Provider>;
}

export function useActivePath(): string | null {
  const context = useContext(ActiveSectionContext);
  if (!context) throw new Error("useActivePath must be used within ActiveSectionProvider");
  return context.activePath;
}

export function useActiveSection(path: string): RefCallback<HTMLElement> {
  const context = useContext(ActiveSectionContext);
  if (!context) throw new Error("useActiveSection must be used within ActiveSectionProvider");
  const { register } = context;
  return useCallback(
    (element: HTMLElement | null) => {
      if (element) return register(element, path);
    },
    [register, path],
  );
}
