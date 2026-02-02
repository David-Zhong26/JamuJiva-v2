
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PosterCanvas from './components/PosterCanvas';
import ProductDive from './components/ProductDive';
import Features from './components/Features';
import Story from './components/Story';
import WaitlistSection from './components/WaitlistSection';
import Footer from './components/Footer';
import { GoogleGenAI } from "@google/genai";
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

  const generateNewPoster = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompts = [
        "High-end editorial lifestyle photograph of a modern Jamu turmeric drink in a minimalist glass. Bright, natural Balinese morning light. Vibrant orange and yellow hues, lush tropical green background. 8k resolution.",
        "Minimalist aesthetic Jamu bottle on a white marble surface, soft morning shadows, fresh turmeric roots nearby, architectural lighting, luxury wellness feel.",
        "Macro detail of fresh squeezed Jamu juice with ginger bubbles, golden hour lighting, vibrant orange tones, professional food photography."
      ];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: randomPrompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setPosterUrl(`data:image/png;base64,${part.inlineData.data}`);
      }
    } catch (error) {
      console.error("Failed to generate poster vibe:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-cycle every 25 seconds
  useEffect(() => {
    generateNewPoster();
    const interval = setInterval(generateNewPoster, 25000);
    return () => clearInterval(interval);
  }, []);

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
