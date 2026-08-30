import React from 'react';
import { motion } from 'framer-motion';
import copy from '../content/copy.json';
import DefaultButton from './DefaultButton.jsx';

const ASSET_PATH = '/assets/cta';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CtaSection({ onRsvpClick }) {
  return (
    <section id="venue" className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#7A0C0C] px-6 snap-start">
      <motion.div
        className="pointer-events-none absolute inset-0 m-auto w-[80vw] max-w-[600px] mt-60 select-none md:w-[80vw] md:mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.img
          src={`${ASSET_PATH}/${encodeURIComponent('Background Monogram.png')}`}
          alt=""
          aria-hidden="true"
          className="w-full select-none"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        transition={{ staggerChildren: 0.2 }}
        className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center text-white"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-display italic text-headline-md md:text-display-sm"
        >
          {copy.cta.date}
        </motion.p>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-1 font-display italic text-headline-sm md:text-headline-lg"
        >
          {copy.cta.venue}
        </motion.p>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-6 font-display text-body-lg leading-relaxed text-white/90"
        >
          {copy.cta.invitationLines.map((line, index) => (
            <React.Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </motion.p>

        <DefaultButton
          label={copy.cta.rsvpButton}
          onClick={onRsvpClick}
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-8"
        />
      </motion.div>
    </section>
  );
}
