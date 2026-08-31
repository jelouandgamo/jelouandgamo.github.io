import React, { useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import copy from '../content/copy.json';
import {
  cloudinaryUrl,
  fetchGalleryByTag,
  CLOUDINARY_GALLERY_TAG,
} from '../lib/cloudinary.js';

// Pixels per second the strip drifts leftward.
const SPEED = 45;

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function GallerySection() {
  const gallery = copy.gallery || {};
  const staticPhotos = gallery.photos || [];

  const [photoIds, setPhotoIds] = useState(staticPhotos);

  // If a Cloudinary tag is configured, replace the static list with a live one.
  useEffect(() => {
    if (!CLOUDINARY_GALLERY_TAG) return;

    let active = true;
    fetchGalleryByTag(CLOUDINARY_GALLERY_TAG)
      .then((list) => {
        if (active && list.length) setPhotoIds(list);
      })
      .catch((err) => console.warn('Falling back to static gallery list:', err));

    return () => {
      active = false;
    };
  }, []);

  // Duplicate the list so the strip can loop seamlessly.
  const items = useMemo(
    () => (photoIds.length ? [...photoIds, ...photoIds] : []),
    [photoIds]
  );

  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const loopWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);
  const nudgeRef = useRef(null);

  // Jump the strip one "page" left (dir = 1) or right (dir = -1). Pauses the
  // auto-drift while gliding, then normalises x back into one loop's range.
  const nudge = (dir) => {
    const loop = loopWidthRef.current || 0;
    const step = loop ? Math.min(280, loop * 0.8) : 280;
    nudgeRef.current?.stop();
    pausedRef.current = true;
    nudgeRef.current = animate(x, x.get() + dir * step, {
      type: 'spring',
      stiffness: 200,
      damping: 30,
      onComplete: () => {
        if (loop) {
          let v = x.get();
          while (v <= -loop) v += loop;
          while (v > 0) v -= loop;
          x.set(v);
        }
        pausedRef.current = reducedRef.current;
      },
    });
  };

  // Only pause-on-hover / scale-on-hover for devices with a real pointer.
  // On touch screens a tap fires mouseenter but never mouseleave, which would
  // leave the strip stuck paused forever.
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  // Respect users who prefer reduced motion - start paused for them.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mq.matches;
    pausedRef.current = mq.matches;
  }, []);

  // Measure half the (duplicated) track - that's one full loop.
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) loopWidthRef.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (pausedRef.current || !loopWidthRef.current) return;
    let next = x.get() - (SPEED * delta) / 1000;
    if (next <= -loopWidthRef.current) next += loopWidthRef.current;
    x.set(next);
  });

  if (!items.length) return null;

  return (
    <section
      id="gallery"
      className="w-full overflow-hidden bg-[#7A0C0C] py-20 snap-start md:py-28"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={headerVariants}
        className="mx-auto mb-12 max-w-3xl px-4 text-center md:mb-16 md:px-8"
      >
        <p className="font-sans text-label-md text-[#E5DBC9]">{gallery.subtitle}</p>
        <h2 className="mt-2 font-display italic text-display-sm text-[#E5DBC9] md:text-display-md">
          {gallery.title}
        </h2>
      </motion.div>

      <div
        className="relative"
        onMouseEnter={
          canHover
            ? () => {
                pausedRef.current = true;
              }
            : undefined
        }
        onMouseLeave={
          canHover
            ? () => {
                pausedRef.current = false;
              }
            : undefined
        }
      >
        {/* soft fade at both edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#7A0C0C] to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#7A0C0C] to-transparent md:w-28" />

        <button
          type="button"
          aria-label="Previous photos"
          onClick={() => nudge(1)}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#E5DBC9]/90 p-2 text-[#7A0C0C] shadow-lg transition hover:bg-[#E5DBC9] md:left-4 md:p-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next photos"
          onClick={() => nudge(-1)}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#E5DBC9]/90 p-2 text-[#7A0C0C] shadow-lg transition hover:bg-[#E5DBC9] md:right-4 md:p-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max">
          {items.map((publicId, i) => (
            <motion.figure
              key={`${publicId}-${i}`}
              whileHover={canHover ? { scale: 1.08, zIndex: 20 } : undefined}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="relative mr-4 h-64 w-48 flex-none overflow-hidden rounded-2xl shadow-lg md:mr-6 md:h-80 md:w-64"
            >
              <img
                src={cloudinaryUrl(publicId, { width: 500, height: 640 })}
                alt=""
                loading="lazy"
                draggable="false"
                className="h-full w-full select-none object-cover"
              />
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
