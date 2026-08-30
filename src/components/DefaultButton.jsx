import React from 'react';
import { motion } from 'framer-motion';

const ASSET_PATH = '/assets/cta';

export default function DefaultButton({ label, className = '', ...props }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      className={`relative flex h-[74px] w-[252px] items-center justify-center bg-contain bg-center bg-no-repeat transition-transform hover:scale-105 ${className}`}
      style={{ backgroundImage: `url('${ASSET_PATH}/${encodeURIComponent('Button Group.png')}')` }}
      {...props}
    >
      <span className="mb-4 font-sans text-label-md text-[#173133]">
        {label}
      </span>
    </motion.button>
  );
}
