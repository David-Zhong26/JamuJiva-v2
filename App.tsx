import React, { useState } from 'react';
import Navbar from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import Features from './components/Features';
import { IngredientsSection } from './components/IngredientsSection';
import Story from './components/Story';
import WaitlistSection from './components/WaitlistSection';
import { FAQSection } from './components/FAQSection';
import Footer from './components/Footer';
import { motion, useScroll, useSpring } from 'framer-motion';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setJoined(true);
      setEmail('');
    }
  };

  return (
    <div className="relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#F47C3E] z-[60] origin-left"
        style={{ scaleX }}
      />
      <Navbar />
      <main>
        <HeroSection email={email} setEmail={setEmail} onJoin={handleJoin} joined={joined} />
        <Features />
        <IngredientsSection />
        <Story />
        <WaitlistSection email={email} setEmail={setEmail} onJoin={handleJoin} joined={joined} />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
