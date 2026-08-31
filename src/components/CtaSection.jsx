import React from 'react';
import { motion } from 'framer-motion';
import copy from '../content/copy.json';
import DefaultButton from './DefaultButton.jsx';
import ScrollCue from './ScrollCue.jsx';

const ASSET_PATH = '/assets/cta';
const INVITE_PATH = `${ASSET_PATH}/invite`;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Save each invitation card in turn. The browser fires one download per
// synthetic click; a small stagger keeps them from being merged or blocked.
function downloadInvitation() {
  copy.cta.inviteFiles.forEach((file, index) => {
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = `${INVITE_PATH}/${file.src}`;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }, index * 400);
  });
}

export default function CtaSection({ onRsvpClick }) {
  return (
    <section id="venue" className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#7A0C0C] px-6 snap-start">
      <motion.div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <img
          src={`${ASSET_PATH}/${encodeURIComponent('Background Monogram.png')}`}
          alt=""
          aria-hidden="true"
          className="w-[160vw] max-w-none shrink-0 select-none md:w-[50vw]"
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

        <motion.button
          type="button"
          onClick={downloadInvitation}
          variants={fadeUp}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-sans text-label-md text-white underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white"
        >
          {copy.cta.downloadButton}
        </motion.button>

      </motion.div>

      <ScrollCue className="absolute inset-x-0 bottom-6 z-10" />
    </section>
  );
}
