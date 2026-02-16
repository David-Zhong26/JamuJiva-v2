import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

import bottleModel from '../materials/Jiva bottle.glb?url';

function Bottle({ reduceMotion }: { reduceMotion: boolean }) {
  const { scene } = useGLTF(bottleModel);
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = scene.clone();

  const { invalidate } = useThree();

  useEffect(() => {
    if (reduceMotion) return;
    let id: number;
    const tick = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.003;
        invalidate();
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [reduceMotion, invalidate]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} scale={2.5} position={[0, 0, 0]} />
    </group>
  );
}

interface Ingredient3DProps {
  className?: string;
}

export function Ingredient3D({ className = '' }: Ingredient3DProps) {
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={`w-full h-[400px] md:h-[500px] ${className}`}>
      <Canvas
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop="demand"
      >
        <Suspense fallback={null}>
          <Bottle reduceMotion={reduceMotion} />
        </Suspense>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 2, 3]} intensity={0.5} />
        <pointLight position={[0, 3, 4]} intensity={0.6} />
      </Canvas>
    </div>
  );
}
