import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import copy from '../content/copy.json';

export const ASSET_PATH = '/assets/hero2';

// All hero2 layers share the same 3840x2160 canvas (confirmed against the
// source PNGs), so stacking them at identical size/position reproduces the
// composite exactly - no manual coordinate guessing needed. Order matches
// the exported stacking order (back to front).
//
// `parallax` is the max pixel offset a layer drifts under pointer / gyro
// movement in HeroSectionV2 (0 = pinned). Back layers drift least, the
// foreground fish drift most, which reads as depth.
export const HERO_LAYERS = [
  { id: 'monogram', file: 'monogram.svg', alt: '', depth: 'slow', parallax: 6 },
  { id: 'flower-pink-rt', file: '2a Flower Pink Right Top.png', alt: '', depth: 'mid', parallax: 16 },
  { id: 'flower-white-rt', file: '2b Flower White Right Top.png', alt: '', depth: 'mid', parallax: 18 },
  { id: 'flower-yellow-rt', file: '2c Flower Yellow Right Top.png', alt: '', depth: 'mid', parallax: 20 },
  { id: 'flower-red-lt', file: '3a Flower Red Left Top.png', alt: '', depth: 'mid', parallax: 16 },
  { id: 'flower-pink-lt', file: '3b Flower Pink Left Top.png', alt: '', depth: 'mid', parallax: 18 },
  { id: 'vesta', file: '4a Vesta.png', alt: 'Vesta the cat', depth: 'mid', parallax: 10 },
  { id: 'couple', file: '4b JelouGamo.png', alt: 'Jelou and Gamo illustrated together', depth: 'mid', parallax: 7 },
  { id: 'flower-white1-rb', file: '5a Flower White 1 Right Bottom.png', alt: '', depth: 'mid', parallax: 24 },
  { id: 'flower-white2-rb', file: '5b Flower White 2 Right Bottom.png', alt: '', depth: 'mid', parallax: 26 },
  { id: 'flower-yellow-rb', file: '5c Flower Yellow Right Bottom.png', alt: '', depth: 'mid', parallax: 28 },
  { id: 'flower-pink-rb', file: '5d Flower Pink Right Bottom.png', alt: '', depth: 'mid', parallax: 26 },
  { id: 'flower-red-lb', file: '6a Flower Red Left Bottom.png', alt: '', depth: 'mid', parallax: 24 },
  { id: 'fish-left-1', file: '7a Fish Left 1.png', alt: '', depth: 'mid', parallax: 40 },
  { id: 'fish-left-2', file: '7b Fish Left 2.png', alt: '', depth: 'mid', parallax: 46 },
  { id: 'fish-right', file: '8a Fish Right.png', alt: '', depth: 'mid', parallax: 44 },
];

// Full URLs for every hero layer, so the first-load loader can preload the
// heavy artwork before it hands the screen over.
export const HERO_IMAGE_SRCS = HERO_LAYERS.map(
  (layer) => `${ASSET_PATH}/${encodeURIComponent(layer.file)}`,
);

const LAYER_STAGGER = 0.12;
const LAYER_DURATION = 0.5;
const textDelay = HERO_LAYERS.length * LAYER_STAGGER + LAYER_DURATION;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: LAYER_STAGGER },
  },
};

const layerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: LAYER_DURATION, ease: 'easeOut' },
  },
};

export default function HeroSection() {
  const sectionRef = useRef(null);

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
          style={{
            width: 'min(150vw, 100vh)',
            aspectRatio: '1116 / 1000',
            // overflow: 'hidden',
          }}
        >
          {/* The shared 3840x2160 canvas has huge transparent padding around the
              artwork (content only fills roughly the middle 54% x 86%). Rendering
              it at full canvas size wastes most of the box on empty space, so the
              layer stack is scaled up and shifted to crop tightly to the content. */}
          <div
            className="absolute"
            style={{ width: '185.2%', left: '-44.9%', top: '-11%', aspectRatio: '3840 / 2160' }}
          >
            {HERO_LAYERS.map((layer, index) => (
              <motion.img
                key={layer.id}
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
                  y: layer.depth === 'slow' ? monogramY : layersY,
                }}
                className="select-none"
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
          <p className="font-sans text-body-lg text-white">
            {copy.hero.eyebrow}
          </p>

          <div className="mt-3 space-y-1 font-display italic text-display-md">
            <p>{copy.hero.headline}</p>
            {/* <p>Saturday, 6th March 2027</p> */}
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

            {/* <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">
              <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.2" />
            </svg> */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
