import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HERO_IMAGE_SRCS } from './HeroSection.jsx';

const ASSET_PATH = '/assets/nav';
const BG = '#1A302B';

// Minimum time the loader stays up even if everything is cached, so the intro
// never flashes. SAFETY caps it so a slow/broken asset can't trap the visitor.
const MIN_DURATION = 1900;
const SAFETY_TIMEOUT = 9000;

// Resolves once every hero image has finished (loaded or errored).
function preloadHeroImages() {
  return Promise.all(
    HERO_IMAGE_SRCS.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
          if (img.complete) resolve();
        }),
    ),
  );
}

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!visible) return undefined;

    const start = Date.now();
    let settled = false;

    const dismiss = () => {
      if (settled) return;
      settled = true;
      const elapsed = Date.now() - start;
      window.setTimeout(() => {
        setVisible(false);
      }, Math.max(0, MIN_DURATION - elapsed));
    };

    // Hold the loader until the hero artwork is actually decoded, not just
    // until the document fires `load` - the big PNGs are the slow part.
    preloadHeroImages().then(dismiss);
    const safety = window.setTimeout(dismiss, SAFETY_TIMEOUT);

    return () => {
      window.clearTimeout(safety);
    };
  }, [visible]);

  // Hold the page still behind the overlay.
  useEffect(() => {
    if (!visible) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ backgroundColor: BG }}
        >
          <motion.img
            src={`${ASSET_PATH}/${encodeURIComponent('Navigation Logo.png')}`}
            alt="Jelou & Gamo monogram"
            className="h-24 w-auto select-none md:h-28"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
            animate={{
              opacity: 1,
              scale: reduceMotion ? 1 : [0.9, 1, 0.97, 1],
            }}
            transition={{
              opacity: { duration: 0.9, ease: 'easeOut' },
              scale: reduceMotion
                ? { duration: 0 }
                : { duration: 2.4, ease: 'easeInOut', repeat: Infinity },
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
            className="mt-6 font-display text-[12px] font-normal uppercase leading-normal tracking-[6px] text-white/80"
          >
            Jelou &amp; Gamo
          </motion.p>

          <div className="mt-5 h-px w-32 overflow-hidden bg-white/15">
            {reduceMotion ? (
              <div className="h-full w-full bg-white/60" />
            ) : (
              <motion.div
                className="h-full w-1/2 bg-white/70"
                initial={{ x: '-100%' }}
                animate={{ x: '300%' }}
                transition={{ duration: 1.3, ease: 'easeInOut', repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
