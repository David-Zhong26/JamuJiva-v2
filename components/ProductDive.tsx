
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Callout: React.FC<{ 
  title: string; 
  description: string; 
  x: string; 
  y: string; 
  progress: any; 
  range: [number, number];
  alignment: 'left' | 'right';
}> = ({ title, description, x, y, progress, range, alignment }) => {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const translateX = useTransform(progress, range, [alignment === 'left' ? -30 : 30, 0, 0, alignment === 'left' ? -30 : 30]);

  return (
    <motion.div 
      style={{ top: y, left: x, opacity, x: translateX }}
      className={`absolute z-30 flex items-center gap-6 ${alignment === 'right' ? 'flex-row-reverse' : ''}`}
    >
      <div className="w-4 h-4 rounded-full bg-[#F9D067] shadow-[0_0_20px_rgba(249,208,103,0.8)] border-2 border-white"></div>
      <div className={`max-w-[200px] ${alignment === 'right' ? 'text-right' : 'text-left'}`}>
        <h4 className="text-white font-serif text-2xl font-black mb-1">{title}</h4>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-tight">{description}</p>
      </div>
      <div className={`h-[1px] bg-white/30 w-16 ${alignment === 'right' ? '-mr-6' : '-ml-6'}`}></div>
    </motion.div>
  );
};

const ProductDive: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 45, damping: 20 });

  // Main bottle transformations
  const bottleScale = useTransform(smoothProgress, [0, 0.8, 1], [0.8, 4, 12]);
  const bottleY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const bottleOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  
  // Background text parallax
  const bgTextY = useTransform(smoothProgress, [0, 1], [100, -200]);
  const bgTextOpacity = useTransform(smoothProgress, [0, 0.5, 0.8], [0.05, 0.1, 0]);

  // Background color shift
  const bgColor = useTransform(smoothProgress, [0, 0.5, 1], ["#F5F2ED", "#1a1a1a", "#2D4F3E"]);

  return (
    <section ref={sectionRef} className="relative h-[500vh]">
      <motion.div 
        style={{ backgroundColor: bgColor }}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-500"
      >
        {/* Large background typography */}
        <motion.div 
          style={{ y: bgTextY, opacity: bgTextOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="font-serif text-[30vw] font-black text-[#F47C3E] select-none whitespace-nowrap">
            RAW POTENCY
          </span>
        </motion.div>

        {/* Central Product Image (The Bottle) */}
        <motion.div 
          style={{ 
            scale: bottleScale, 
            y: bottleY,
            opacity: bottleOpacity
          }}
          className="relative z-20 w-[300px] md:w-[450px] aspect-[1/2] flex items-center justify-center"
        >
          {/* We'll use a stylized bottle-shaped container with a high-res image */}
          <div className="w-full h-full relative group">
            <img 
              src="https://images.unsplash.com/photo-1615485240384-552e40d70bad?q=80&w=1200&auto=format&fit=crop" 
              alt="Jamu Jiva Signature Bottle"
              className="w-full h-full object-cover rounded-[3rem] shadow-2xl border-4 border-white/10"
            />
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-black/20 to-transparent"></div>
          </div>
        </motion.div>

        {/* Dynamic Story Overlays */}
        <div className="absolute inset-0 z-30 pointer-events-none max-w-7xl mx-auto px-6">
          <motion.div 
            style={{ opacity: useTransform(smoothProgress, [0, 0.1, 0.2], [0, 1, 0]) }}
            className="absolute top-1/2 left-0 -translate-y-1/2"
          >
            <h3 className="font-serif text-5xl md:text-7xl font-black text-[#F47C3E] mb-4">ENGINEERED <br /> BY NATURE.</h3>
            <p className="text-[#2D4F3E] font-bold tracking-widest uppercase text-sm">Scroll to dismantle the ritual</p>
          </motion.div>

          {/* Callouts pinned to scroll points */}
          <Callout 
            title="Curcumin Gold" 
            description="Pure Central Javanese turmeric, extracted without high heat to preserve bio-compounds." 
            x="15%" 
            y="35%" 
            progress={smoothProgress} 
            range={[0.2, 0.35]} 
            alignment="left"
          />

          <Callout 
            title="Cold-Press Ritual" 
            description="Zero-oxygen extraction ensures no oxidation of flavor or medicine." 
            x="60%" 
            y="25%" 
            progress={smoothProgress} 
            range={[0.4, 0.55]} 
            alignment="right"
          />

          <Callout 
            title="Bio-Available" 
            description="A pinch of Javanese long pepper triples the absorption of our key ingredients." 
            x="20%" 
            y="65%" 
            progress={smoothProgress} 
            range={[0.6, 0.75]} 
            alignment="left"
          />
        </div>

        {/* Macro Transition (Final Phase) */}
        <motion.div 
          style={{ opacity: useTransform(smoothProgress, [0.8, 0.9], [0, 1]) }}
          className="absolute inset-0 bg-[#2D4F3E] flex items-center justify-center p-12"
        >
          <div className="max-w-3xl text-center">
            <motion.span 
              style={{ y: useTransform(smoothProgress, [0.8, 1], [50, 0]) }}
              className="text-[#F9D067] font-black tracking-[0.4em] uppercase text-sm mb-8 block"
            >
              The Science of Spirit
            </motion.span>
            <motion.h2 
              style={{ scale: useTransform(smoothProgress, [0.8, 1], [0.9, 1]) }}
              className="font-serif text-5xl md:text-9xl font-black text-white leading-tight mb-8"
            >
              ROOTS <br /> REFINED.
            </motion.h2>
            <p className="text-white/70 text-xl md:text-3xl font-medium leading-relaxed">
              We took the wisdom of the Mbok Jamu and the rigor of modern science to create the perfect 4oz tonic. 
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProductDive;
