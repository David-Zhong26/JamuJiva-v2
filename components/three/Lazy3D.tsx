import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import demoJivaBottle from '../../materials/demo jiva removed.png';

const ScrollExperience = lazy(() =>
  import('./ScrollExperience').then((m) => ({ default: m.ScrollExperience }))
);

// Detect reduced motion / low power / mobile - show poster + opt-in button
function shouldUseFallback(): boolean {
  if (typeof window === 'undefined') return true;
  // prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return true;
  // deviceMemory (Chrome/Edge) - 4GB or less
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory != null && nav.deviceMemory <= 4) return true;
  // Mobile user agent
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (mobile) return true;
  return false;
}

interface Lazy3DProps {
  email?: string;
  setEmail?: (email: string) => void;
  onJoin?: (e: React.FormEvent) => void;
  joined?: boolean;
}

export function Lazy3D({ email = '', setEmail = () => {}, onJoin, joined = false }: Lazy3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [userOptedIn, setUserOptedIn] = useState(false);
  const fallbackMode = useRef(shouldUseFallback());

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            break;
          }
        }
      },
      {
        rootMargin: '300px 0px',
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const use3D = shouldLoad && (!fallbackMode.current || userOptedIn);

  // Poster placeholder - shown before load or when in fallback mode
  if (!use3D) {
    return (
      <div
        ref={containerRef}
        className="relative w-full min-h-[100vh] bg-[#F5F2ED] flex flex-col items-center justify-center py-24 px-6"
      >
        <div className="max-w-md w-full flex flex-col items-center">
          <img
            src={demoJivaBottle}
            alt="Jamu Jiva"
            className="w-[60%] min-w-[200px] max-w-[320px] h-auto object-contain drop-shadow-2xl mb-8"
          />
          <h2 className="font-serif text-3xl md:text-5xl font-black text-[#2D4F3E] text-center mb-4">
            Centuries of wisdom in every sip.
          </h2>
          <p className="text-[#2D4F3E]/70 text-center mb-8">
            The Modern Elixir — Raw roots, cold-press ritual, bio-available blend.
          </p>
          {fallbackMode.current && (
            <button
              onClick={() => setUserOptedIn(true)}
              className="bg-[#2D4F3E] text-white px-8 py-4 rounded-full font-black hover:bg-[#F47C3E] transition-colors"
            >
              View 3D Experience
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Suspense
        fallback={
          <div className="min-h-[100vh] bg-[#F5F2ED] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <img
                src={demoJivaBottle}
                alt="Jamu Jiva"
                className="w-48 h-auto object-contain opacity-80 animate-pulse"
              />
              <p className="text-[#2D4F3E]/60 mt-4 font-medium">Loading 3D...</p>
            </div>
          </div>
        }
      >
        <ScrollExperience email={email} setEmail={setEmail} onJoin={onJoin} joined={joined} />
      </Suspense>
    </div>
  );
}
