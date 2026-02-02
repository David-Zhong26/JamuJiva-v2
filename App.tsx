
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import PosterCanvas from './components/PosterCanvas';
import ProductDive from './components/ProductDive';
import Features from './components/Features';
import Story from './components/Story';
import WaitlistSection from './components/WaitlistSection';
import Footer from './components/Footer';
import { motion, useScroll, useSpring } from "framer-motion";

const App: React.FC = () => {
  const [posterUrl, setPosterUrl] = useState<string>('https://images.unsplash.com/photo-1615485240384-552e40d70bad?q=80&w=2000&auto=format&fit=crop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const generateNewPoster = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Use Unsplash API to fetch high-quality images
      // Users should set VITE_UNSPLASH_ACCESS_KEY in their .env.local file
      // Also supports UNSPLASH_ACCESS_KEY for backward compatibility (via vite.config.ts define)
      const apiKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || (typeof __UNSPLASH_ACCESS_KEY__ !== 'undefined' ? __UNSPLASH_ACCESS_KEY__ : '');
      
      // Search queries for Jamu-related images
      const searchQueries = [
        'turmeric drink',
        'ginger turmeric wellness',
        'healthy beverage',
        'golden milk',
        'turmeric latte',
        'herbal drink',
        'wellness drink',
        'natural beverage'
      ];
      
      const randomQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];
      
      if (apiKey) {
        // Use Unsplash API if key is provided
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=${encodeURIComponent(randomQuery)}&orientation=landscape&w=2000&client_id=${apiKey}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.urls && data.urls.regular) {
            setPosterUrl(data.urls.regular);
            setIsGenerating(false);
            return;
          }
        }
      }
      
      // Fallback: Use curated Unsplash image IDs (no API key required)
      const fallbackImages = [
        'https://images.unsplash.com/photo-1615485240384-552e40d70bad?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1543083115-638c32cd3d58?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=2000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?q=80&w=2000&auto=format&fit=crop'
      ];
      const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
      setPosterUrl(randomImage);
    } catch (error) {
      console.error("Failed to fetch poster image:", error);
      // Use default fallback on error
      setPosterUrl('https://images.unsplash.com/photo-1615485240384-552e40d70bad?q=80&w=2000&auto=format&fit=crop');
    } finally {
      setIsGenerating(false);
    }
  }, []);

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
