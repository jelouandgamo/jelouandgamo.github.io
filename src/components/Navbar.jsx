import React, { useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import copy from '../content/copy.json';
import { useLocation, useNavigate } from 'react-router-dom';
import DefaultButton from './DefaultButton.jsx';

const ASSET_PATH = '/assets/nav';
const OVERLAY_BG = '#112522';

// Links point at section ids on the home page. `to: '/rsvp'` routes instead.
const NAV_LINKS = [
  { label: 'HOME', target: 'home' },
  { label: 'VENUE', target: 'venue' },
  { label: 'ATTIRE', target: 'attire' },
  { label: 'PROGRAM', target: 'program' },
  { label: 'FAQ', target: 'faq' },
];

const HIDE_THRESHOLD = 80;

const overlayVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut', when: 'beforeChildren' },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  // Smart sticky header: hide on scroll down past the threshold, reveal on any
  // upward scroll. Skipped while the overlay menu is open.
  useMotionValueEvent(scrollY, 'change', (current) => {
    if (menuOpen) return;
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > HIDE_THRESHOLD) {
      setHidden(true);
    } else if (current < previous) {
      setHidden(false);
    }
  });

  // Lock body scroll while the full-screen menu is open.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [menuOpen]);

  // Close the menu on Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigate = (link) => {
    setMenuOpen(false);

    if (link.to) {
      navigate(link.to);
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      // Wait for the home route to mount before scrolling to the section.
      window.setTimeout(() => scrollToSection(link.target), 120);
    } else {
      scrollToSection(link.target);
    }
  };

  const goToRsvp = () => {
    setMenuOpen(false);
    navigate('/rsvp');
  };

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: hidden ? '-100%' : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
      >
        <button
          type="button"
          onClick={() => handleNavigate(NAV_LINKS[0])}
          aria-label="Jelou & Gamo — home"
          className="flex items-center"
        >
          <img
            src={`${ASSET_PATH}/${encodeURIComponent('Navigation Logo.png')}`}
            alt="Jelou & Gamo monogram"
            className="h-10 w-auto select-none"
          />
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="transition-transform hover:scale-105"
        >
          <img
            src={`${ASSET_PATH}/${encodeURIComponent('Navigation Menu Button.png')}`}
            alt=""
            aria-hidden="true"
            className="h-11 w-auto select-none"
          />
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="overlay-menu"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-50 flex flex-col"
            style={{ backgroundColor: OVERLAY_BG }}
          >
            <div className="flex justify-end px-6 py-4">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="transition-transform hover:scale-105"
              >
                <img
                  src={`${ASSET_PATH}/${encodeURIComponent('Navigation Close Button.png')}`}
                  alt=""
                  aria-hidden="true"
                  className="h-11 w-auto select-none"
                />
              </button>
            </div>

            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
            >
              <motion.img
                variants={itemVariants}
                src={`${ASSET_PATH}/${encodeURIComponent('Navigation Logo.png')}`}
                alt="Jelou & Gamo monogram"
                className="h-20 w-auto select-none md:h-24"
              />

              <motion.div variants={itemVariants} className="space-y-2 text-center text-white">
                <p className="font-display text-[12px] font-normal uppercase leading-normal tracking-[6px]">
                  JELOU &amp; GAMO
                </p>
                <p className="font-display text-[12px] font-normal uppercase leading-normal tracking-[6px]">
                  {copy.cta.date}
                </p>
              </motion.div>

              <DefaultButton
                variants={itemVariants}
                label="RSVP"
                onClick={goToRsvp}
              />

              <motion.ul
                variants={listVariants}
                className="flex flex-col items-center gap-6"
              >
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.label} variants={itemVariants}>
                    <motion.button
                      type="button"
                      onClick={() => handleNavigate(link)}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="font-display text-[12px] font-normal uppercase leading-normal tracking-[6px] text-white"
                    >
                      {link.label}
                    </motion.button>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
