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
        className="pointer-events-none absolute inset-0 m-auto w-[80vw] max-w-[600px] select-none md:w-[80vw]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
            width: 'min(150vw, 100vh)',
            // aspectRatio: '1116 / 1000',
            // overflow: 'hidden',
          }}
      >
        <div className="flex h-[100dvh] items-center justify-center">
        <img
          src={`${ASSET_PATH}/${encodeURIComponent('Background Monogram.png')}`}
          alt=""
          aria-hidden="true"
          className="w-full select-none "
        />
        </div>
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
          className="font-display italic text-display-sm"
        >
          {copy.cta.date}
        </motion.p>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-1 font-display italic text-display-sm"
        >
          {copy.cta.venue}
        </motion.p>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mt-6 font-sans text-body-lg text-white"
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
