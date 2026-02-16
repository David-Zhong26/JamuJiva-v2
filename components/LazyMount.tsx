import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import demoJivaBottle from '../materials/demo jiva removed.png';

const Ingredient3D = lazy(() =>
  import('./Ingredient3D').then((m) => ({ default: m.Ingredient3D }))
);

const ROOT_MARGIN = '300px 0px';

interface LazyMountProps {
  className?: string;
  placeholderClassName?: string;
}

export function LazyMount({ className = '', placeholderClassName = '' }: LazyMountProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldMount(true);
            break;
          }
        }
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {shouldMount ? (
        <Suspense
          fallback={
            <div
              className={`flex items-center justify-center bg-[#F5F2ED] ${placeholderClassName}`}
              style={{ minHeight: 400 }}
            >
              <img
                src={demoJivaBottle}
                alt="Jamu Jiva"
                className="w-64 h-auto object-contain opacity-80"
              />
            </div>
          }
        >
          <Ingredient3D />
        </Suspense>
      ) : (
        <div
          className={`flex items-center justify-center bg-[#F5F2ED] ${placeholderClassName}`}
          style={{ minHeight: 400 }}
        >
          <img
            src={demoJivaBottle}
            alt="Jamu Jiva"
            className="w-64 h-auto object-contain drop-shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
