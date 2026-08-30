import React from 'react';
import { motion } from 'framer-motion';
import copy from '../content/copy.json';

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function FaqSection() {
  return (
    <section id="faq" className="w-full bg-[#122B27] px-4 py-20 snap-start md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={headerVariants}
          className="text-center"
        >
          <p className="font-sans text-label-md text-[#E5DBC9]">
            {copy.faq.subtitle}
          </p>
          <h2 className="mt-2 font-display italic text-display-sm text-[#E5DBC9] md:text-display-md">
            {copy.faq.title}
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={listVariants}
          className="mt-12 flex flex-col space-y-4 md:mt-16 md:space-y-6"
        >
          {copy.faq.questions.map((faq) => (
            <motion.div
              key={faq.question}
              variants={cardVariants}
              className="rounded-2xl border border-white/5 bg-black/25 p-6 md:p-8"
            >
              <h3 className="font-display text-lg font-semibold text-white md:text-xl">{faq.question}</h3>
              <p className="mt-3 font-display text-sm text-white/80 md:text-base">{faq.answer}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
