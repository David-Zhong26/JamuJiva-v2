
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, ChevronDown } from 'lucide-react';
import cupImage from '../materials/cup.png';

interface PosterCanvasProps {
  sectionRef: React.RefObject<HTMLElement>;
  posterUrl: string;
  isGenerating: boolean;
  email: string;
  setEmail: (email: string) => void;
  onJoin: (e: React.FormEvent) => void;
  joined: boolean;
}

const PosterCanvas: React.FC<PosterCanvasProps> = ({ 
  sectionRef,
  posterUrl, 
  isGenerating, 
  email, 
  setEmail, 
  onJoin, 
  joined 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Track the section's scroll progress over its full 200vh height
  // This makes the animation span the entire scroll distance of the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // More gradual transitions - spread over longer scroll distance
  // Text moves more slowly
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  // Image scales more gradually from 1 to 1.3 (more zoom)
  const imageScale = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1.2, 1.4]);
  // Opacity fades more gradually, starting later
  const opacity = useTransform(scrollYProgress, [0.5, 0.9, 1], [1, 0.5, 0]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-7xl aspect-[4/5] md:aspect-[16/9] bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden border-[8px] md:border-[16px] border-white group"
    >
      <motion.div style={{ scale: imageScale, opacity }} className="absolute inset-0 z-0">
        <img 
          src={cupImage} 
          alt="Jamu Cup" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D4F3E]/80 via-transparent to-black/30"></div>
      </motion.div>

      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 md:p-16 text-white">
        <div className="flex justify-between items-start">
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="bg-white text-[#2D4F3E] px-5 py-2 rounded-xl font-black text-xs md:text-sm tracking-tighter rotate-[-2deg] shadow-xl"
          >
            HERITAGE MEETS HUSTLE
          </motion.div>
        </div>

        <motion.div style={{ y: textY, opacity }} className="max-w-4xl">
          <motion.h1 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-[clamp(2.5rem,10vw,8.5rem)] font-black leading-[0.8] tracking-tight"
          >
            DRINK THE <br />
            <span className="text-[#F9D067]">LIFE YOU</span> <br />
            DESERVE
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 flex items-center gap-4 text-[#F9D067] font-bold tracking-widest text-xs uppercase"
          >
            <span className="w-12 h-[1px] bg-[#F9D067]"></span>
            Experience the scroll
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="w-full md:max-w-md">
            {!joined ? (
              <motion.form 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                onSubmit={onJoin} 
                className="flex p-1.5 bg-white/20 backdrop-blur-2xl rounded-full border border-white/30"
              >
                <input 
                  type="email" 
                  placeholder="Join the drop..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-6 py-3 focus:outline-none placeholder-white/60 font-semibold"
                />
                <button type="submit" className="bg-white text-[#F47C3E] px-8 py-3 rounded-full font-black hover:bg-[#F9D067] hover:text-[#2D4F3E] transition-all flex items-center gap-2">
                  ACCESS <Send className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-[#2D4F3E] border border-white/30 px-8 py-4 rounded-full font-black">
                YOU'RE ON THE LIST 🔥
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCanvas;
