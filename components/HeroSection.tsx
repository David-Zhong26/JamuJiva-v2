import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import demoJiva from '../materials/demo jiva.jpg';
import demoJivaBottle from '../materials/demo jiva removed.png';

interface HeroSectionProps {
  email: string;
  setEmail: (email: string) => void;
  onJoin: (e: React.FormEvent) => void;
  joined: boolean;
}

export function HeroSection({ email, setEmail, onJoin, joined }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={demoJiva}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D4F3E]/90 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/20 backdrop-blur-sm inline-block px-4 py-2 rounded-full text-white font-bold text-xs tracking-wider mb-6"
          >
            HERITAGE MEETS HUSTLE
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-[clamp(2.5rem,8vw,7rem)] font-black leading-[0.9] text-white tracking-tight"
          >
            DRINK THE <br />
            <span className="text-[#F9D067]">LIFE YOU</span> <br />
            DESERVE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/90 text-lg mt-6 max-w-xl"
          >
            Ancient Indonesian wellness, reimagined for the modern routine.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10"
          >
            {!joined ? (
              <form
                onSubmit={onJoin}
                className="flex flex-col sm:flex-row gap-4 max-w-md"
              >
                <input
                  type="email"
                  placeholder="Join the drop..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-6 py-4 rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm focus:outline-none focus:border-white font-medium text-white placeholder-white/60"
                />
                <button
                  type="submit"
                  className="bg-white text-[#F47C3E] px-8 py-4 rounded-full font-black hover:bg-[#F9D067] hover:text-[#2D4F3E] transition-all flex items-center justify-center gap-2"
                >
                  ACCESS <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="bg-[#2D4F3E] border border-white/30 px-8 py-6 rounded-full font-black text-white inline-block">
                YOU'RE ON THE LIST
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex justify-center"
        >
          <img
            src={demoJivaBottle}
            alt="Jamu Jiva"
            className="w-[70%] max-w-[400px] h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
