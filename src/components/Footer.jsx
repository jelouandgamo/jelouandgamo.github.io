import React from 'react';
import { motion } from 'framer-motion';


const fadeUp = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#0F2522] snap-start">
      <motion.div
        {...fadeUp}
        className="mx-auto flex max-w-xl flex-col items-center space-y-4 px-6 py-12 text-center"
      >
        {/* <img
          src={`${ASSET_PATH}/${encodeURIComponent('Navigation Logo.png')}`}
          alt="Jelou & Gamo monogram"
          className="h-12 w-auto select-none"
        /> */}

        <p className="font-display italic text-headline-sm text-[#EAE3D9]/90 md:text-headline-md">
          Jelou &amp; Gamo
        </p>

        <div className="space-y-1 text-xs tracking-wider text-[#EAE3D9]/70 md:text-sm">
          <p>
            Designed by <span className="text-[#A3542B]">Gamo Tuaño</span>
          </p>
          <p>
            Developed by <span className="text-[#A3542B]">Jean Tiston</span> <br />
            <sub>Development of this website is AI-assisted </sub>
          </p>
        </div>

        <div className="my-4 h-[1px] w-24 bg-white/10" />

        <p className="text-xs tracking-wider text-[#EAE3D9]/60 md:text-sm">
          Made with love for our special day.
        </p>
      </motion.div>
    </footer>
  );
}
