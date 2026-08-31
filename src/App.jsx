import React from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection.jsx';
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

  return (
    <main>
      <HeroSection />
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
