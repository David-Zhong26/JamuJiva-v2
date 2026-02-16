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
}

function BottleModel({ modelRef }: BottleModelProps) {
  const { scene } = useGLTF(bottleModel);
  const groupRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    if (groupRef.current) {
      modelRef.current = groupRef.current;
    }
    return () => {
      modelRef.current = null;
    };
  }, [modelRef]);

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
}

export function Scene({ modelRef, cameraRef }: SceneProps) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 2]}
    >
      <CameraRefSetter cameraRef={cameraRef} />
      {/* Soft studio lighting + subtle environment */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
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
        <BottleModel modelRef={modelRef} />
      </Suspense>
    </Canvas>
  );
}

// Preload the model for faster display
export function preloadBottleModel() {
  useGLTF.preload(bottleModel);
}
