import React from 'react';
import { motion } from 'framer-motion';
import copy from '../content/copy.json';

const ASSET_PATH = '/assets/program';

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1 },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export default function ProgramFlowSection() {
  return (
    <section id="program" className="flex min-h-[100dvh] w-full flex-col justify-center bg-white px-6 py-20 snap-start md:py-28">
      <div className="mx-auto w-full max-w-2xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          variants={headerVariants}
          className="text-left md:text-center"
        >
          <p className="font-display text-label-md uppercase tracking-[0.3em] text-[#A3542B]">
            {copy.program.subtitle}
          </p>
          <h2 className="mt-2 font-display italic text-display-sm text-neutral-900 md:text-display-md">
            {copy.program.title}
          </h2>
        </motion.div>

        <div className="relative mt-16">
          <motion.div
            aria-hidden="true"
            className="absolute left-6 top-0 bottom-0 w-px bg-[#EAE3D9]"
            style={{ transformOrigin: 'top' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            variants={lineVariants}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={listVariants}
            className="relative flex flex-col gap-12"
          >
            {copy.program.schedule.map((event) => (
              <motion.div
                key={event.title}
                variants={itemVariants}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative flex gap-6"
              >
                <img
                  src={`${ASSET_PATH}/${encodeURIComponent('Program FlowPlaceholder.png')}`}
                  alt=""
                  aria-hidden="true"
                  className="relative z-10 h-12 w-12 flex-none select-none"
                />

                <div className="pt-1">
                  <p className="font-display text-label-md tracking-[0.15em] text-[#A3542B]">
                    {event.time}
                  </p>
                  <h3 className="mt-1 font-display text-title-sm text-neutral-900">
                    {event.title}
                  </h3>
                  <p className="mt-1 font-display text-body-lg leading-relaxed text-neutral-600">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
