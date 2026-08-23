import React from 'react';
import HeroSection from './components/HeroSection.jsx';
import ProgramFlowSection from './components/ProgramFlowSection.jsx';
import CtaSection from './components/CtaSection.jsx';
import AttireSection from './components/AttireSection.jsx';
import FaqSection from './components/FaqSection.jsx';

export default function App() {
  return (
    <main>
      <HeroSection />
      <CtaSection />
      <ProgramFlowSection />
      <AttireSection />
      <FaqSection />
    </main>
  );
}
