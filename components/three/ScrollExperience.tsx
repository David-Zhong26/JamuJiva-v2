import React, { useRef, useLayoutEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene } from './Scene';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface IngredientCard {
  title: string;
  desc: string;
  color: string;
  angle: number; // degrees for position around the bottle
}

// Placeholder ingredient data - replace with real image URLs:
// Add imageUrl to IngredientCard and use <img src={item.imageUrl} /> in the card div below
const INGREDIENTS: IngredientCard[] = [
  { title: 'Turmeric', desc: 'Pure Central Javanese', color: '#F9D067', angle: -120 },
  { title: 'Ginger', desc: 'Cold-press ritual', color: '#F47C3E', angle: 0 },
  { title: 'Long Pepper', desc: 'Bio-available blend', color: '#2D4F3E', angle: 120 },
];

interface ScrollExperienceProps {
  email?: string;
  setEmail?: (email: string) => void;
  onJoin?: (e: React.FormEvent) => void;
  joined?: boolean;
}

export function ScrollExperience({ email = '', setEmail = () => {}, onJoin, joined = false }: ScrollExperienceProps) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const invalidateRef = useRef<(() => void) | null>(null);
  const [modelReady, setModelReady] = useState(false);

  const ingredientCardsRef = useRef<HTMLDivElement[]>([]);
  const ingredientsContainerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const section1TextRef = useRef<HTMLDivElement>(null);

  const handleInvalidateReady = useCallback((invalidate: () => void) => {
    invalidateRef.current = invalidate;
  }, []);

  const handleModelReady = useCallback(() => {
    setModelReady(true);
  }, []);

  useLayoutEffect(() => {
    if (!modelReady) return;

    const scrollWrapper = scrollWrapperRef.current;
    const canvas = canvasRef.current;
    if (!scrollWrapper || !canvas) return;

    let ctx: ReturnType<typeof gsap.context> | null = null;

    const setup = () => {
      requestAnimationFrame(() => {
        if (!cameraRef.current) {
          requestAnimationFrame(setup);
          return;
        }

        ctx = gsap.context(() => {
          const invalidate = () => invalidateRef.current?.();

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: scrollWrapper,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
              pin: canvas,
              onUpdate: invalidate,
            },
          });

          tl.to(cameraRef.current!.position, { z: 6, x: 0.3, y: 0.2, ease: 'power2.inOut' }, 0);

          const model = modelRef.current;
          if (model) {
            tl.to(model.rotation, { y: Math.PI * 0.25, ease: 'power2.inOut' }, 0.5);
          }

          if (ingredientsContainerRef.current) {
            tl.fromTo(ingredientsContainerRef.current, { opacity: 0 }, { opacity: 1, ease: 'power2.out' }, 1.5);
          }
          ingredientCardsRef.current.forEach((card, i) => {
            if (card) {
              tl.fromTo(
                card,
                { opacity: 0, scale: 0 },
                { opacity: 1, scale: 1, ease: 'back.out(1.4)' },
                1.8 + i * 0.1
              );
            }
          });

          tl.to(cameraRef.current!.position, { z: 9, x: 0, y: 0, ease: 'power2.inOut' }, 2.8);
          if (model) {
            tl.to(model.rotation, { y: Math.PI * 0.15, ease: 'power2.inOut' }, 2.8);
          }
          if (ctaRef.current) {
            tl.fromTo(ctaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: 'power2.out' }, 3.2);
          }

          if (section1TextRef.current) {
            gsap.fromTo(
              section1TextRef.current,
              { opacity: 0, x: -60 },
              {
                opacity: 1,
                x: 0,
                scrollTrigger: {
                  trigger: scrollWrapper,
                  start: 'top top',
                  end: '30% top',
                  scrub: 1,
                  onUpdate: invalidate,
                },
              }
            );
          }
        }, scrollWrapper);
      });
    };

    setup();

    return () => {
      ctx?.revert();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === scrollWrapper) t.kill();
      });
    };
  }, [modelReady]);

  return (
    <div ref={scrollWrapperRef} className="relative" style={{ height: '400vh' }}>
      {/* Sticky 3D canvas - full viewport, overlay sits on top */}
      <div
        ref={canvasRef}
        className="sticky top-0 left-0 w-full h-screen bg-[#F5F2ED]"
        style={{ zIndex: 0 }}
      >
        <Scene
          modelRef={modelRef}
          cameraRef={cameraRef}
          onInvalidateReady={handleInvalidateReady}
          onModelLoaded={handleModelReady}
        />
        {/* Overlay sections - positioned over the canvas (sticky with it) */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-16">
        {/* Section 1: Intro text (left) */}
        <div
          ref={section1TextRef}
          className="max-w-md opacity-0"
        >
          <span className="text-[#F47C3E] font-black tracking-widest uppercase text-sm">
            The Modern Elixir
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-[#2D4F3E] mt-2 leading-tight">
            Centuries of wisdom in every sip.
          </h2>
        </div>

        {/* Section 3: Ingredient cards - pop out around the bottle */}
        <div
          ref={ingredientsContainerRef}
          className="absolute inset-0 flex items-center justify-center opacity-0"
        >
          <div className="relative w-full max-w-4xl h-[60%] flex items-center justify-center">
            {INGREDIENTS.map((item, i) => (
              <div
                key={item.title}
                ref={(el) => {
                  if (el) ingredientCardsRef.current[i] = el;
                }}
                className="absolute flex flex-col items-center opacity-0"
                style={{
                  transform: `rotate(${item.angle}deg) translateY(-100px)`,
                }}
              >
                {/* TODO: Replace placeholder with <img src={item.imageUrl} alt={item.title} /> for real ingredient images */}
                <div
                  className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-2 border-white/50 shadow-xl flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: `${item.color}dd`,
                    transform: `rotate(${-item.angle}deg)`,
                  }}
                >
                  <span className="font-serif text-2xl font-black text-white">
                    {item.title.slice(0, 1)}
                  </span>
                  <span className="font-bold text-white/90 text-xs uppercase">
                    {item.title}
                  </span>
                </div>
                <p
                  className="text-[#2D4F3E] text-sm font-medium mt-2 text-center max-w-[100px]"
                  style={{ transform: `rotate(${-item.angle}deg)` }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: CTA at bottom */}
        <div
          ref={ctaRef}
          className="opacity-0 pointer-events-auto"
        >
          <h2 className="font-serif text-4xl md:text-6xl font-black text-[#2D4F3E] mb-4">
            BE THE FIRST TO SIP.
          </h2>
          {onJoin && !joined ? (
            <form
              onSubmit={onJoin}
              className="flex flex-col sm:flex-row gap-4 max-w-md"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-full border-2 border-[#2D4F3E]/20 bg-white font-medium text-[#2D4F3E] focus:outline-none focus:border-[#2D4F3E]"
              />
              <button
                type="submit"
                className="bg-[#2D4F3E] text-white px-8 py-4 rounded-full font-black hover:bg-[#F47C3E] transition-colors"
              >
                SECURE ACCESS
              </button>
            </form>
          ) : (
            <div className="bg-[#2D4F3E] text-white px-8 py-6 rounded-2xl font-black text-xl inline-block">
              YOU'RE IN.
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Invisible sections for scroll length */}
      <div className="scroll-section absolute opacity-0 pointer-events-none" style={{ top: '0', height: '25%' }} />
      <div className="scroll-section absolute opacity-0 pointer-events-none" style={{ top: '25%', height: '25%' }} />
      <div className="scroll-section absolute opacity-0 pointer-events-none" style={{ top: '50%', height: '25%' }} />
      <div className="scroll-section absolute opacity-0 pointer-events-none" style={{ top: '75%', height: '25%' }} />
    </div>
  );
}
