import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function CameraRefSetter({ cameraRef }: { cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null> }) {
  const { camera } = useThree();
  useEffect(() => {
    cameraRef.current = camera as THREE.PerspectiveCamera;
    return () => { cameraRef.current = null; };
  }, [camera, cameraRef]);
  return null;
}

// Import GLB - Vite handles the space in "Jiva bottle.glb"
// Replace path if you move the file
import bottleModel from '../../materials/Jiva bottle.glb?url';

interface BottleModelProps {
  modelRef: React.MutableRefObject<THREE.Group | null>;
  onLoaded?: () => void;
}

function BottleModel({ modelRef, onLoaded }: BottleModelProps) {
  const { scene } = useGLTF(bottleModel);
  const groupRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    if (groupRef.current) {
      modelRef.current = groupRef.current;
      onLoaded?.();
    }
    return () => {
      modelRef.current = null;
    };
  }, [modelRef, onLoaded]);

  // Clone to avoid mutating the cached scene
  const clonedScene = scene.clone();

  return (
    <group ref={groupRef}>
      <primitive
        object={clonedScene}
        scale={2.5}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

interface SceneProps {
  modelRef: React.MutableRefObject<THREE.Group | null>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  onInvalidateReady?: (invalidate: () => void) => void;
  onModelLoaded?: () => void;
}

function InvalidateBridge({ onReady }: { onReady: (invalidate: () => void) => void }) {
  const { invalidate } = useThree();
  useEffect(() => {
    onReady(invalidate);
  }, [invalidate, onReady]);
  return null;
}

export function Scene({ modelRef, cameraRef, onInvalidateReady, onModelLoaded }: SceneProps) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.5]}
      frameloop="demand"
    >
      <CameraRefSetter cameraRef={cameraRef} />
      {onInvalidateReady && <InvalidateBridge onReady={onInvalidateReady} />}
      {/* Soft studio lighting - shadows disabled for performance */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, 2, 3]} intensity={0.6} />
      <directionalLight position={[0, -2, 2]} intensity={0.3} />
      <pointLight position={[0, 3, 4]} intensity={0.8} />

      {/* Subtle environment map for reflections */}
      <Environment preset="studio" />

      <Suspense
        fallback={
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="#2D4F3E" />
          </mesh>
        }
      >
        <BottleModel modelRef={modelRef} onLoaded={onModelLoaded} />
      </Suspense>
    </Canvas>
  );
}

// Preload the model for faster display
export function preloadBottleModel() {
  useGLTF.preload(bottleModel);
}
