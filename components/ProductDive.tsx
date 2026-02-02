
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface CalloutProps {
  title: string;
  description: string;
  x: string;
  y: string;
  progress: any;
  range: [number, number];
  alignment: 'left' | 'right';
}

const Callout: React.FC<CalloutProps> = ({ 
  title, 
  description, 
  x, 
  y, 
  progress, 
  range,
  alignment 
}) => {
  // Smooth fade and slide in
  const opacity = useTransform(progress, [range[0], range[0] + 0.1, range[1] - 0.1, range[1]], [0, 1, 1, 0]);
  const translateX = useTransform(
    progress, 
    [range[0], range[0] + 0.1, range[1] - 0.1, range[1]], 
    [alignment === 'left' ? -40 : 40, 0, 0, alignment === 'left' ? -20 : 20]
  );
  const scale = useTransform(
    progress,
    [range[0], range[0] + 0.1, range[1] - 0.1, range[1]],
    [0.8, 1, 1, 0.9]
  );

  return (
    <motion.div 
      style={{ 
        top: y, 
        left: x, 
        opacity, 
        x: translateX,
        scale
      }}
      className={`absolute z-30 flex items-center gap-4 ${alignment === 'right' ? 'flex-row-reverse' : ''}`}
    >
      <motion.div 
        style={{ scale: useTransform(progress, [range[0], range[0] + 0.1], [0, 1]) }}
        className="w-3 h-3 rounded-full bg-[#F9D067] shadow-[0_0_15px_rgba(249,208,103,0.6)] border-2 border-white flex-shrink-0"
      />
      <motion.div 
        style={{ opacity: useTransform(progress, [range[0], range[0] + 0.15], [0, 1]) }}
        className={`max-w-[220px] ${alignment === 'right' ? 'text-right' : 'text-left'}`}
      >
        <h4 className="text-white font-serif text-xl md:text-2xl font-bold mb-1.5 leading-tight">{title}</h4>
        <p className="text-white/70 text-xs font-medium tracking-wide leading-relaxed">{description}</p>
      </motion.div>
      <motion.div 
        style={{ 
          scaleX: useTransform(progress, [range[0], range[0] + 0.1], [0, 1]),
          opacity: useTransform(progress, [range[0], range[0] + 0.1], [0, 0.4])
        }}
        className={`h-[1px] bg-white/40 w-12 ${alignment === 'right' ? '-mr-4' : '-ml-4'}`}
      />
    </motion.div>
  );
};

const ProductDive: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Ultra-smooth spring for premium feel
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 50, 
    damping: 25,
    mass: 0.5
  });

  // Phase 1: Product appears (0 - 0.15)
  const productInitialOpacity = useTransform(smoothProgress, [0, 0.1], [0, 1]);
  const productInitialScale = useTransform(smoothProgress, [0, 0.15], [0.6, 1]);

  // Phase 2: Product zooms in smoothly (0.15 - 0.7)
  const productZoomScale = useTransform(smoothProgress, [0.15, 0.7], [1, 3.5]);
  const productZoomY = useTransform(smoothProgress, [0.15, 0.7], ["0%", "10%"]);
  
  // Combined scale for smooth transition
  const finalScale = useTransform(
    smoothProgress,
    [0, 0.15, 0.7],
    [0.6, 1, 3.5]
  );

  // Product opacity - stays visible during zoom, fades at end
  const productOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.85, 1],
    [0, 1, 1, 0]
  );

  // Background transitions - very subtle
  const bgColor = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    ["#F5F2ED", "#F5F2ED", "#1a1a1a", "#2D4F3E"]
  );

  // Subtle background text (very minimal)
  const bgTextOpacity = useTransform(
    smoothProgress,
    [0, 0.2, 0.5],
    [0, 0.03, 0]
  );
  const bgTextY = useTransform(smoothProgress, [0, 0.5], [0, -100]);

  // Intro text fade
  const introOpacity = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 1, 0]);
  const introY = useTransform(smoothProgress, [0, 0.25], [0, -30]);

  // Final message
  const finalOpacity = useTransform(smoothProgress, [0.75, 0.85], [0, 1]);
  const finalScale = useTransform(smoothProgress, [0.75, 0.85], [0.95, 1]);
  const finalY = useTransform(smoothProgress, [0.75, 0.85], [20, 0]);

  return (
    <section ref={sectionRef} className="relative h-[400vh]">
      {/* Pinned container - stays in view during scroll */}
      <motion.div 
        style={{ backgroundColor: bgColor }}
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Very subtle background typography */}
        <motion.div 
          style={{ y: bgTextY, opacity: bgTextOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="font-serif text-[25vw] font-black text-[#F47C3E]/20 select-none whitespace-nowrap">
            RAW POTENCY
          </span>
        </motion.div>

        {/* Central Product Image - The Star */}
        <motion.div 
          style={{ 
            scale: finalScale,
            y: productZoomY,
            opacity: productOpacity
          }}
          className="relative z-20 w-[280px] md:w-[400px] aspect-[1/2] flex items-center justify-center"
        >
          <div className="w-full h-full relative">
            <img 
              src="https://images.unsplash.com/photo-1615485240384-552e40d70bad?q=80&w=1200&auto=format&fit=crop" 
              alt="Jamu Jiva Signature Bottle"
              className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl border-2 border-white/20"
            />
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-black/10 to-transparent"></div>
          </div>
        </motion.div>

        {/* Intro Message - appears first */}
        <motion.div 
          style={{ opacity: introOpacity, y: introY }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none"
        >
          <h3 className="font-serif text-4xl md:text-6xl font-bold text-[#2D4F3E] mb-3">
            ENGINEERED BY NATURE.
          </h3>
          <p className="text-[#2D4F3E]/70 font-medium tracking-wide text-sm uppercase">
            Scroll to explore
          </p>
        </motion.div>

        {/* Callouts - appear progressively during zoom */}
        <div className="absolute inset-0 z-30 pointer-events-none max-w-7xl mx-auto px-6">
          <Callout 
            title="Curcumin Gold" 
            description="Pure Central Javanese turmeric, extracted without high heat to preserve bio-compounds." 
            x="12%" 
            y="30%" 
            progress={smoothProgress} 
            range={[0.25, 0.45]} 
            alignment="left"
          />

          <Callout 
            title="Cold-Press Ritual" 
            description="Zero-oxygen extraction ensures no oxidation of flavor or medicine." 
            x="65%" 
            y="25%" 
            progress={smoothProgress} 
            range={[0.35, 0.55]} 
            alignment="right"
          />

          <Callout 
            title="Bio-Available" 
            description="A pinch of Javanese long pepper triples the absorption of our key ingredients." 
            x="18%" 
            y="70%" 
            progress={smoothProgress} 
            range={[0.45, 0.65]} 
            alignment="left"
          />

          <Callout 
            title="Ancient Wisdom" 
            description="Formulated with the knowledge of traditional Mbok Jamu healers." 
            x="70%" 
            y="65%" 
            progress={smoothProgress} 
            range={[0.55, 0.75]} 
            alignment="right"
          />
        </div>

        {/* Final Message - appears as zoom completes */}
        <motion.div 
          style={{ 
            opacity: finalOpacity,
            scale: finalScale,
            y: finalY
          }}
          className="absolute inset-0 bg-[#2D4F3E] flex items-center justify-center p-12 z-40"
        >
          <div className="max-w-4xl text-center">
            <motion.span 
              style={{ opacity: useTransform(smoothProgress, [0.75, 0.8], [0, 1]) }}
              className="text-[#F9D067] font-bold tracking-[0.3em] uppercase text-xs mb-6 block"
            >
              The Science of Spirit
            </motion.span>
            <motion.h2 
              style={{ opacity: useTransform(smoothProgress, [0.8, 0.85], [0, 1]) }}
              className="font-serif text-4xl md:text-8xl font-bold text-white leading-tight mb-6"
            >
              ROOTS <br /> REFINED.
            </motion.h2>
            <motion.p 
              style={{ opacity: useTransform(smoothProgress, [0.85, 0.9], [0, 1]) }}
              className="text-white/80 text-lg md:text-2xl font-light leading-relaxed max-w-2xl mx-auto"
            >
              We took the wisdom of the Mbok Jamu and the rigor of modern science to create the perfect 4oz tonic.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProductDive;
