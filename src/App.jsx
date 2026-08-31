import React from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HeroSection from './components/HeroSection.jsx';
import HeroSectionV2 from './components/HeroSectionV2.jsx';
import ProgramFlowSection from './components/ProgramFlowSection.jsx';
import CtaSection from './components/CtaSection.jsx';
import AttireSection from './components/AttireSection.jsx';
import FaqSection from './components/FaqSection.jsx';
import GallerySection from './components/GallerySection.jsx';
import RsvpPage from './components/RsvpPage.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Loader from './components/Loader.jsx';

function HomePage() {
  const navigate = useNavigate();
  // const location = useLocation();
  // // Visit /#/?hero=v2 to preview the tilt/gyro hero.
  // const useHeroV2 = new URLSearchParams(location.search).get('hero') === 'v2';

  return (
    <main>
      <HeroSectionV2 />
      {/* {useHeroV2 ? <HeroSectionV2 /> : <HeroSection />} */}
      <CtaSection onRsvpClick={() => navigate('/rsvp')} />
      <ProgramFlowSection />
      <AttireSection />
      <FaqSection />
      <GallerySection />
      <Footer />
    </main>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Loader />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rsvp" element={<RsvpPage />} />
      </Routes>
    </HashRouter>
  );
}
