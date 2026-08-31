import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
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

  // Respect users who prefer reduced motion - start paused for them.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
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
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        {/* soft fade at both edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#7A0C0C] to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#7A0C0C] to-transparent md:w-28" />

        <motion.div ref={trackRef} style={{ x }} className="flex w-max">
          {items.map((publicId, i) => (
            <motion.figure
              key={`${publicId}-${i}`}
              whileHover={{ scale: 1.08, zIndex: 20 }}
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
