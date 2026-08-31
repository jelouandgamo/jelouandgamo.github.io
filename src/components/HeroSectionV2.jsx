import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import copy from '../content/copy.json';
import { ASSET_PATH, HERO_LAYERS } from './HeroSection.jsx';

// Second hero: same layered artwork as HeroSection, but the layers drift under
// pointer movement on desktop and device-tilt (gyro) on touch devices. Each
// layer's drift distance comes from `layer.parallax` in HeroSection.jsx.

const LAYER_STAGGER = 0.12;
const LAYER_DURATION = 0.5;
const textDelay = HERO_LAYERS.length * LAYER_STAGGER + LAYER_DURATION;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: LAYER_STAGGER } },
};

const layerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: LAYER_DURATION, ease: 'easeOut' },
  },
};

// Spring that turns the raw -1..1 pointer/tilt signal into smooth motion.
const SPRING = { stiffness: 55, damping: 18, mass: 0.6 };

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

// Degrees of tilt that map to the full drift range on each axis.
const TILT_RANGE = 22;

/**
 * Returns springy -1..1 motion values (`x`, `y`) driven by the mouse on
 * desktop or the gyroscope on mobile, plus a `gyroState` + `enableGyro` pair
 * for the iOS permission prompt.
 */
function useTiltParallax() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  // 'idle' -> not a gyro device (desktop, or reduced motion)
  // 'prompt' -> needs a user tap to grant permission (iOS 13+)
  // 'active' -> listening to deviceorientation
  // 'denied' -> permission refused or unavailable
  const [gyroState, setGyroState] = useState('idle');

  // Desktop: follow the mouse relative to the viewport centre.
  useEffect(() => {
    if (prefersReducedMotion() || isTouchDevice()) return undefined;
    const onMove = (event) => {
      rawX.set(clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1));
      rawY.set(clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1));
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [rawX, rawY]);

  // Touch: decide whether we can listen straight away or need a permission tap.
  useEffect(() => {
    if (prefersReducedMotion() || !isTouchDevice()) return;
    if (typeof window.DeviceOrientationEvent === 'undefined') {
      setGyroState('denied');
      return;
    }
    const needsPermission =
      typeof window.DeviceOrientationEvent.requestPermission === 'function';
    setGyroState(needsPermission ? 'prompt' : 'active');
  }, []);

  // Touch: translate device tilt into the same -1..1 signal. The first reading
  // becomes the neutral pose so it works whatever angle the phone is held at.
  useEffect(() => {
    if (gyroState !== 'active') return undefined;
    let base = null;
    const onOrient = (event) => {
      const { beta, gamma } = event; // beta: front-back, gamma: left-right
      if (beta == null || gamma == null) return;
      if (!base) base = { beta, gamma };
      rawX.set(clamp((gamma - base.gamma) / TILT_RANGE, -1, 1));
      rawY.set(clamp((beta - base.beta) / TILT_RANGE, -1, 1));
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, [gyroState, rawX, rawY]);

  const enableGyro = useCallback(async () => {
    try {
      const result = await window.DeviceOrientationEvent.requestPermission();
      setGyroState(result === 'granted' ? 'active' : 'denied');
    } catch {
      setGyroState('denied');
    }
  }, []);

  return { x, y, gyroState, enableGyro };
}

function HeroLayer({ layer, index, scrollY, pointerX, pointerY }) {
  const strength = layer.parallax ?? 12;
  const x = useTransform(pointerX, (value) => value * strength);
  const y = useTransform(
    [scrollY, pointerY],
    ([scroll, pointer]) => scroll + pointer * strength,
  );

  return (
    <motion.img
      src={`${ASSET_PATH}/${encodeURIComponent(layer.file)}`}
      alt={layer.alt}
      aria-hidden={layer.alt ? undefined : true}
      variants={layerVariants}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: index + 1,
        x,
        y,
        willChange: 'transform',
      }}
      className="select-none"
    />
  );
}

export default function HeroSectionV2() {
  const sectionRef = useRef(null);
  const { x: pointerX, y: pointerY, gyroState, enableGyro } = useTiltParallax();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const monogramY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const layersY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -180]);

  const scrollToNextSection = () => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full h-[100dvh] overflow-hidden bg-[#1A302B] snap-start"
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center px-4 pt-24 pb-8 md:pt-28 md:pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="absolute mx-auto"
          style={{ width: 'min(150vw, 100vh)', aspectRatio: '1116 / 1000' }}
        >
          <div
            className="absolute"
            style={{
              width: '185.2%',
              left: '-44.9%',
              top: '-11%',
              aspectRatio: '3840 / 2160',
            }}
          >
            {HERO_LAYERS.map((layer, index) => (
              <HeroLayer
                key={layer.id}
                layer={layer}
                index={index}
                scrollY={layer.depth === 'slow' ? monogramY : layersY}
                pointerX={pointerX}
                pointerY={pointerY}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: textDelay, duration: 0.6 }}
          style={{ y: foregroundY }}
          className="relative z-30 w-full max-w-xl shrink-0 mt-96 text-center text-white md:mt-100"
        >
          <p className="font-sans text-body-lg text-white">{copy.hero.eyebrow}</p>

          <div className="mt-3 space-y-1 font-display italic text-display-md">
            <p>{copy.hero.headline}</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: textDelay + 0.5, duration: 0.6 }}
            className="mt-6 flex justify-center"
          >
            <button
              type="button"
              onClick={scrollToNextSection}
              aria-label="Scroll to next section"
            >
              <img src={`/assets/arrow-down.png`} alt="" />
            </button>
          </motion.div>
        </motion.div>

        {gyroState === 'prompt' && (
          <button
            type="button"
            onClick={enableGyro}
            className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/30 bg-black/20 px-4 py-2 font-sans text-body-sm text-white/90 backdrop-blur-sm"
          >
            Tap to bring the scene to life
          </button>
        )}
      </div>
    </section>
  );
}
