
import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import PosterCanvas from './components/PosterCanvas';
import ProductDive from './components/ProductDive';
import Features from './components/Features';
import Story from './components/Story';
import WaitlistSection from './components/WaitlistSection';
import Footer from './components/Footer';
import { motion, useScroll, useSpring } from "framer-motion";
import demoJiva from './materials/demo jiva.jpg';

const App: React.FC = () => {
  const [posterUrl] = useState<string>(demoJiva);
  const [isGenerating] = useState(false);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
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
        <section ref={heroSectionRef} id="hero" className="h-[200vh] flex items-center justify-center pt-0 pb-2 md:pb-4">
          <div className="sticky top-0 w-full flex items-center justify-center pt-0 pb-2">
            <PosterCanvas 
              sectionRef={heroSectionRef}
              posterUrl={posterUrl} 
              isGenerating={isGenerating} 
              email={email}
              setEmail={setEmail}
              onJoin={handleJoin}
              joined={joined}
            />
          </div>
        </section>

        <ProductDive />
        
        <Features />
        <Story />
        <WaitlistSection email={email} setEmail={setEmail} onJoin={handleJoin} joined={joined} />
      </main>

      <Footer />
    </div>
  );
};

export default App;
