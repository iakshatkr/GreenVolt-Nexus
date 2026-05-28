import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, MathUtils, MeshStandardMaterial } from 'three';
import { EV_COLORS } from './constants';
import type { SceneAnimationState } from './types';

interface SmartChargingStationProps {
  state: SceneAnimationState;
}

export const SmartChargingStation = ({ state }: SmartChargingStationProps) => {
  const station = useRef<Group>(null);
  const coreMaterial = useRef<MeshStandardMaterial>(null);
  const ringMaterial = useRef<MeshStandardMaterial>(null);
  const indicatorMaterials = useRef<MeshStandardMaterial[]>([]);

  useFrame((sceneState) => {
    if (!station.current || !coreMaterial.current || !ringMaterial.current) {
      return;
    }

    const t = sceneState.clock.elapsedTime;
    const pulse = 0.84 + Math.sin(t * 2.6) * 0.16;
    const charging = state.chargeLevel * pulse;

    station.current.position.y = MathUtils.lerp(station.current.position.y, 0.06 + Math.sin(t * 0.6) * 0.01, 0.08);

    coreMaterial.current.emissiveIntensity = MathUtils.lerp(coreMaterial.current.emissiveIntensity, 0.24 + charging * 0.95, 0.08);
    ringMaterial.current.emissiveIntensity = MathUtils.lerp(ringMaterial.current.emissiveIntensity, 0.2 + charging * 0.72, 0.08);

    indicatorMaterials.current.forEach((material, index) => {
      const shift = (index + 1) * 0.6;
      const wave = 0.5 + Math.sin(t * 1.8 + shift) * 0.5;
      material.emissiveIntensity = 0.08 + state.chargeLevel * wave * 0.65;
    });
  });

  return (
    <group ref={station} position={[2.1, 0.06, -0.22]}>
      <mesh castShadow>
        <boxGeometry args={[0.46, 1.26, 0.5]} />
        <meshStandardMaterial color="#aebfd0" roughness={0.27} metalness={0.78} />
      </mesh>

      <mesh position={[0, 0.12, 0.27]}>
        <boxGeometry args={[0.22, 0.34, 0.02]} />
        <meshStandardMaterial color="#9ff5ff" emissive="#67e8f9" emissiveIntensity={0.3} transparent opacity={0.6} roughness={0.12} metalness={0.18} />
      </mesh>

      <mesh position={[0, -0.18, 0.27]}>
        <cylinderGeometry args={[0.07, 0.07, 0.03, 20]} />
        <meshStandardMaterial
          ref={coreMaterial}
          color="#d9f9ff"
          emissive={EV_COLORS.primaryGlow}
          emissiveIntensity={0.24}
          roughness={0.24}
          metalness={0.42}
        />
      </mesh>

      <mesh position={[0, -0.18, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.115, 0.01, 10, 48]} />
        <meshStandardMaterial
          ref={ringMaterial}
          color="#c7fbff"
          emissive={EV_COLORS.secondaryGlow}
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.36}
        />
      </mesh>

      {[-0.13, 0, 0.13].map((y, index) => (
        <mesh key={`indicator-${y}`} position={[0.17, y, 0.27]}>
          <boxGeometry args={[0.06, 0.04, 0.02]} />
          <meshStandardMaterial
            ref={(material) => {
              if (material) {
                indicatorMaterials.current[index] = material;
              }
            }}
            color="#a7f3d0"
            emissive={EV_COLORS.primaryGlow}
            emissiveIntensity={0.12}
            roughness={0.3}
            metalness={0.22}
          />
        </mesh>
      ))}
    </group>
  );
};
