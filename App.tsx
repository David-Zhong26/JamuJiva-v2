
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import PosterCanvas from './components/PosterCanvas';
import ProductDive from './components/ProductDive';
import Features from './components/Features';
import Story from './components/Story';
import WaitlistSection from './components/WaitlistSection';
import Footer from './components/Footer';
import { motion, useScroll, useSpring } from "framer-motion";
import image1 from './materials/1.png';
import image2 from './materials/2.png';
import image3 from './materials/3.png';

const App: React.FC = () => {
  const backgroundImages = [image1, image2, image3];
  const [posterUrl, setPosterUrl] = useState<string>(image1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const currentImageIndex = useRef(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const generateNewPoster = useCallback(() => {
    setIsGenerating(true);
    // Cycle through the 3 background images
    currentImageIndex.current = (currentImageIndex.current + 1) % backgroundImages.length;
    setPosterUrl(backgroundImages[currentImageIndex.current]);
    setIsGenerating(false);
  }, [backgroundImages]);

  // Auto-cycle every 25 seconds
  useEffect(() => {
    generateNewPoster();
    const interval = setInterval(generateNewPoster, 25000);
    return () => clearInterval(interval);
  }, [generateNewPoster]);

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
        <section id="hero" className="min-h-screen flex items-center justify-center p-4 md:p-8">
          <PosterCanvas 
            posterUrl={posterUrl} 
            isGenerating={isGenerating} 
            email={email}
            setEmail={setEmail}
            onJoin={handleJoin}
            joined={joined}
          />
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
