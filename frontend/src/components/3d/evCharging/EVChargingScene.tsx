import { Sparkles } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, type ReactNode } from 'react';
import { Group, MathUtils, MeshBasicMaterial } from 'three';
import { ChargingCable } from './ChargingCable';
import { EV_COLORS, clamp01, smoothStep } from './constants';
import { EnergyParticles } from './EnergyParticles';
import { FuturisticEV } from './FuturisticEV';
import { SmartChargingStation } from './SmartChargingStation';
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

const ChargingAura = ({ state }: { state: SceneAnimationState }) => {
  const material = useRef<MeshBasicMaterial>(null);

  useFrame((sceneState) => {
    if (!material.current) {
      return;
    }

    let aura = MathUtils.lerp(material.current.opacity, 0.2 + state.chargeLevel * 0.45 - state.depart * 0.1, 0.08);
    const pulse = 0.85 + Math.sin(sceneState.clock.elapsedTime * 1.9) * 0.15;
    aura *= pulse;
    material.current.opacity = aura;
  });

  return (
    <mesh position={[0.68 + state.depart * 1.2, 0.04, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.45, 1.5, 48]} />
      <meshBasicMaterial ref={material} color={EV_COLORS.primaryGlow} transparent opacity={0.2} />
    </mesh>
  );
};

const SceneMotion = ({ state, children }: { state: SceneAnimationState; children: ReactNode }) => {
  const root = useRef<Group>(null);

  useFrame((sceneState) => {
    if (!root.current) {
      return;
    }

    const t = sceneState.clock.elapsedTime;
    root.current.position.y = Math.sin(t * 0.45) * 0.05 + state.chargeLevel * 0.03;
    root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, -0.07 + state.depart * -0.12, 0.05);
  });

  return <group ref={root}>{children}</group>;
};

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

      <SceneMotion state={state}>
        <mesh position={[-0.28, -0.28, 0]}>
          <boxGeometry args={[4.2, 0.12, 2.4]} />
          <meshStandardMaterial color="#121a28" roughness={0.42} metalness={0.32} />
        </mesh>

        <mesh position={[-0.28, -0.2, 0]}>
          <boxGeometry args={[4, 0.06, 2.2]} />
          <meshStandardMaterial
            color="#162133"
            roughness={0.16}
            metalness={0.42}
            emissive={EV_COLORS.secondaryGlow}
            emissiveIntensity={0.03 + state.chargeLevel * 0.12}
          />
        </mesh>

        <FuturisticEV state={state} />
        <SmartChargingStation state={state} />
        <ChargingCable state={state} />
        <ChargingAura state={state} />
        <EnergyParticles state={state} />
      </SceneMotion>

      <Sparkles
        count={14}
        scale={[5, 1.6, 4]}
        size={1.1}
        speed={0.11}
        opacity={0.2}
        color={EV_COLORS.secondaryGlow}
      />

      <CameraRig />
    </Canvas>
  );
};
