import React from 'react';
import { motion } from 'framer-motion';

// Small "keep scrolling" affordance that jumps to the next full-height
// section. Mirrors the arrow button in the hero.
export default function ScrollCue({ className = '' }) {
  const scrollToNextSection = (event) => {
    event.currentTarget
      .closest('section')
      ?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`flex justify-center ${className}`}
    >
      <button
        type="button"
        onClick={scrollToNextSection}
        aria-label="Scroll to next section"
        className="p-2 transition-transform hover:translate-y-0.5"
      >
        <img src="/assets/arrow-down.png" alt="" />
      </button>
    </motion.div>
  );
}
