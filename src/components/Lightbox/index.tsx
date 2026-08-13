import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuChevronLeft, LuChevronRight, LuX } from "react-icons/lu";
import { useTranslation } from "react-i18next";

export interface LightboxImage {
  src: string;
  alt?: string;
}

interface Props {
  images: LightboxImage[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, open, onClose }: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "lightbox" });
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const touchRef = useRef<{ startX: number; startDist: number; startZoom: number } | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [open, initialIndex]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const prev = useCallback(() => {
    if (images.length <= 1) return;
    setIndex((i) => (i - 1 + images.length) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  const next = useCallback(() => {
    if (images.length <= 1) return;
    setIndex((i) => (i + 1) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose, prev, next]);

  useEffect(() => {
    if (!open || images.length <= 1) return;
    const preload = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    const prevIdx = (index - 1 + images.length) % images.length;
    const nextIdx = (index + 1) % images.length;
    preload(images[prevIdx].src);
    preload(images[nextIdx].src);
  }, [open, index, images]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      touchRef.current = { startX: 0, startDist: dist, startZoom: zoom };
    } else if (e.touches.length === 1) {
      touchRef.current = { startX: e.touches[0].clientX, startDist: 0, startZoom: zoom };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    if (e.touches.length === 2 && touchRef.current.startDist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const newZoom = Math.max(
        1,
        Math.min(3, touchRef.current.startZoom * (dist / touchRef.current.startDist)),
      );
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    if (e.changedTouches.length === 1 && touchRef.current.startDist === 0) {
      const diff = e.changedTouches[0].clientX - touchRef.current.startX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) prev();
        else next();
      }
    }
    touchRef.current = null;
  };

  const handleDoubleClick = () => {
    if (zoom > 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(2);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-none"
            aria-label={t("close")}
          >
            <LuX size={28} />
          </button>

          {/* Counter */}
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-sm text-white/60 font-mono">
            {index + 1} / {images.length}
          </span>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-4 z-10 p-2 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-none"
              aria-label={t("previous")}
            >
              <LuChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <div className="flex items-center justify-center w-full h-full p-16">
            <img
              src={images[index].src}
              alt={images[index].alt ?? ""}
              className="max-w-[90vw] max-h-[85vh] object-contain select-none"
              style={{
                transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                cursor: zoom > 1 ? "grab" : "zoom-in",
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleDoubleClick}
              draggable={false}
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-4 z-10 p-2 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-none"
              aria-label={t("next")}
            >
              <LuChevronRight size={28} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
