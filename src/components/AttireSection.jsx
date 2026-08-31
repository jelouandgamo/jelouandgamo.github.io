import React from 'react';
import { motion } from 'framer-motion';
import copy from '../content/copy.json';
import ScrollCue from './ScrollCue.jsx';

const ASSET_PATH = '/assets/attire';
const ICON_PATH = '/assets/Icons';

const FEATURE_ICONS = ['dress icon.png', 'shirt icon.png', 'sunset icon.png'];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
};

function FeatureList() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="flex flex-col gap-8"
    >
      {copy.attire.features.map((feature, index) => (
        <motion.div key={feature.title} variants={fadeUpVariants} className="flex items-start gap-5">
          <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-white shadow-sm">
            <img
              src={`${ICON_PATH}/${encodeURIComponent(FEATURE_ICONS[index])}`}
              alt=""
              aria-hidden="true"
              className="h-6 w-6 select-none"
            />
          </span>
          <div>
            <h3 className="font-display text-title-lg text-neutral-900">{feature.title}</h3>
            <p className="mt-1 font-sans text-body-lg text-neutral-600">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function AttireSection() {
  return (
    <section id="attire" className="relative w-full bg-[#EFECE1] px-6 pt-16 pb-20 snap-start md:h-[100dvh] md:overflow-hidden md:py-14">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:h-full md:grid-cols-2 md:gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="order-1 flex flex-col md:h-full md:justify-center"
        >
          <motion.p
            variants={fadeUpVariants}
            className="font-sans text-label-md text-neutral-900"
          >
            {copy.attire.subtitle}
          </motion.p>
          <motion.h2
            variants={fadeUpVariants}
            className="mt-3 font-display italic text-display-sm text-neutral-900 md:text-display-md"
          >
            {copy.attire.title}
          </motion.h2>
          <motion.p
            variants={fadeUpVariants}
            className="mt-6 font-sans text-body-lg text-neutral-600"
          >
            {copy.attire.intro}
          </motion.p>

          <div className="mt-10 hidden md:block">
            <FeatureList />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={imageVariants}
          className="order-2 md:h-full"
        >
          <img
            src={`${ASSET_PATH}/${encodeURIComponent('image 15.png')}`}
            alt="Illustration of the couple in a sunset garden"
            className="aspect-[4/5] w-full rounded-3xl object-cover shadow-md md:aspect-auto md:h-full"
          />
        </motion.div>

        <div className="order-3 md:hidden">
          <FeatureList />
        </div>
      </div>

      <ScrollCue className="mt-12 md:absolute md:inset-x-0 md:bottom-6 md:mt-0" />
    </section>
  );
}
