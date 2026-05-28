import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { EV_COLORS, clamp01, smoothStep } from './constants';
import type { EVChargingHero3DProps, SceneAnimationState } from './types';
import { CameraRig } from './CameraRig';

const GroundPlate = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]} receiveShadow>
    <circleGeometry args={[8, 48]} />
    <meshStandardMaterial color="#0a1119" metalness={0.2} roughness={0.86} />
  </mesh>
);

const BackArchitecture = () => (
  <group position={[0, -0.18, -2.6]}>
    {[-1.9, -0.65, 0.65, 1.9].map((x, index) => (
      <mesh key={`pillar-${x}`} position={[x, 0.4, 0]}>
        <boxGeometry args={[0.24, 1.05 + index * 0.08, 0.24]} />
        <meshStandardMaterial color="#111927" roughness={0.72} metalness={0.3} />
      </mesh>
    ))}
    <mesh position={[0, 1.06, 0]}>
      <boxGeometry args={[4.6, 0.12, 0.25]} />
      <meshStandardMaterial color="#131d2a" roughness={0.65} metalness={0.32} />
    </mesh>
  </group>
);

export const EVChargingScene = ({ progress = 0 }: EVChargingHero3DProps) => {
  const state = useMemo<SceneAnimationState>(() => {
    const p = clamp01(progress);
    return {
      chargeLevel: smoothStep(0, 0.72, p),
      disconnect: smoothStep(0.72, 0.9, p),
      depart: smoothStep(0.84, 1, p)
    };
  }, [progress]);

  return (
    <Canvas
      camera={{ position: [0, 0.82, 5.2], fov: 34 }}
      dpr={[1, 1.45]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[EV_COLORS.background]} />
      <fog attach="fog" args={[EV_COLORS.fog, 4.6, 10.8]} />

      <ambientLight intensity={0.27} color="#d5e6ee" />
      <directionalLight position={[-2.6, 3.1, 2]} intensity={0.56} color="#d2f4ff" />
      <pointLight position={[2.6, 1.2, 1.8]} intensity={0.42} color={EV_COLORS.secondaryGlow} />
      <pointLight position={[-2.2, 0.8, 1.4]} intensity={0.44} color={EV_COLORS.primaryGlow} />
      <spotLight position={[0.4, 4.4, 1.8]} angle={0.45} penumbra={0.56} intensity={0.48} color="#f4fbff" />

      <GroundPlate />
      <BackArchitecture />

      <group position={[0, 0.08, 0]}>
        <mesh position={[-0.35, -0.1, 0]}>
          <boxGeometry args={[2.4, 0.2, 1.2]} />
          <meshStandardMaterial color="#1d2735" roughness={0.38} metalness={0.46} />
        </mesh>
        <mesh position={[1.9, 0.2, -0.2]}>
          <boxGeometry args={[0.48, 1.24, 0.48]} />
          <meshStandardMaterial color="#a8b6c8" roughness={0.3} metalness={0.7} emissive={EV_COLORS.secondaryGlow} emissiveIntensity={0.08 + state.chargeLevel * 0.2} />
        </mesh>
      </group>

      <CameraRig />
    </Canvas>
  );
};
