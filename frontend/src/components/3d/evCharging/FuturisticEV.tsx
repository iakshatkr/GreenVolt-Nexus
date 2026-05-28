import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, MathUtils, MeshStandardMaterial } from 'three';
import { EV_COLORS } from './constants';
import type { SceneAnimationState } from './types';

interface FuturisticEVProps {
  state: SceneAnimationState;
}

const wheelPositions: [number, number, number][] = [
  [-1.2, -0.06, 0.72],
  [-1.2, -0.06, -0.72],
  [0.75, -0.06, 0.72],
  [0.75, -0.06, -0.72]
];

export const FuturisticEV = ({ state }: FuturisticEVProps) => {
  const car = useRef<Group>(null);
  const ringMaterials = useRef<MeshStandardMaterial[]>([]);
  const accentMaterials = useRef<MeshStandardMaterial[]>([]);
  const shellMaterial = useRef<MeshStandardMaterial>(null);

  useFrame((sceneState, delta) => {
    if (!car.current || !shellMaterial.current) {
      return;
    }

    const t = sceneState.clock.elapsedTime;
    const chargePulse = 0.82 + Math.sin(t * 2.1) * 0.08;
    const chargeGlow = state.chargeLevel * chargePulse;

    car.current.position.x = MathUtils.lerp(car.current.position.x, -0.6 + state.depart * 2.8, 0.04);
    car.current.position.y = MathUtils.lerp(car.current.position.y, 0.03 + Math.sin(t * 0.7) * 0.018, 0.08);
    car.current.rotation.y = MathUtils.lerp(car.current.rotation.y, -0.18 + state.depart * -0.06, 0.06);

    shellMaterial.current.envMapIntensity = 0.8 + chargeGlow * 0.55;

    accentMaterials.current.forEach((material) => {
      material.emissiveIntensity = MathUtils.lerp(material.emissiveIntensity, 0.18 + chargeGlow * 0.95, 0.08);
    });

    ringMaterials.current.forEach((material) => {
      material.emissiveIntensity = MathUtils.lerp(material.emissiveIntensity, 0.12 + chargeGlow * 0.8, 0.08);
    });

    const wheelSpin = delta * (0.18 + state.depart * 3.2);
    car.current.children.forEach((child) => {
      if (child.name.startsWith('wheel-')) {
        child.rotation.z -= wheelSpin;
      }
    });
  });

  return (
    <group ref={car} position={[-0.6, 0.03, 0]} rotation={[0, -0.18, 0]}>
      <mesh position={[-0.2, 0.18, 0]} castShadow>
        <boxGeometry args={[2.7, 0.5, 1.34]} />
        <meshStandardMaterial ref={shellMaterial} color={EV_COLORS.metal} roughness={0.24} metalness={0.72} envMapIntensity={0.8} />
      </mesh>

      <mesh position={[-0.26, 0.54, 0]} castShadow>
        <boxGeometry args={[1.62, 0.34, 1.18]} />
        <meshStandardMaterial color="#b7c7d9" roughness={0.2} metalness={0.7} />
      </mesh>

      <mesh position={[-0.2, 0.56, 0]} castShadow>
        <boxGeometry args={[1.28, 0.14, 1.04]} />
        <meshStandardMaterial color="#9fb0c3" roughness={0.1} metalness={0.55} transparent opacity={0.48} />
      </mesh>

      <mesh position={[1.07, 0.23, 0]} castShadow>
        <boxGeometry args={[0.46, 0.34, 1.02]} />
        <meshStandardMaterial color="#d2deea" roughness={0.3} metalness={0.62} />
      </mesh>

      <mesh position={[-0.2, 0.26, 0.69]}>
        <boxGeometry args={[2.3, 0.03, 0.04]} />
        <meshStandardMaterial
          ref={(material) => {
            if (material) {
              accentMaterials.current[0] = material;
            }
          }}
          color={EV_COLORS.primaryGlow}
          emissive={EV_COLORS.primaryGlow}
          emissiveIntensity={0.18}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[-0.2, 0.26, -0.69]}>
        <boxGeometry args={[2.3, 0.03, 0.04]} />
        <meshStandardMaterial
          ref={(material) => {
            if (material) {
              accentMaterials.current[1] = material;
            }
          }}
          color={EV_COLORS.secondaryGlow}
          emissive={EV_COLORS.secondaryGlow}
          emissiveIntensity={0.18}
          roughness={0.35}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[1.31, 0.23, 0]}>
        <boxGeometry args={[0.03, 0.16, 0.72]} />
        <meshStandardMaterial
          ref={(material) => {
            if (material) {
              accentMaterials.current[2] = material;
            }
          }}
          color={EV_COLORS.secondaryGlow}
          emissive={EV_COLORS.secondaryGlow}
          emissiveIntensity={0.2}
          roughness={0.28}
          metalness={0.24}
        />
      </mesh>

      {wheelPositions.map((position, index) => (
        <group key={`wheel-${index}`} name={`wheel-${index}`} position={position} rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.2, 18]} />
            <meshStandardMaterial color="#1d2532" roughness={0.42} metalness={0.58} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.22, 0.018, 10, 42]} />
            <meshStandardMaterial
              ref={(material) => {
                if (material) {
                  ringMaterials.current[index] = material;
                }
              }}
              color="#a5f3fc"
              emissive="#22d3ee"
              emissiveIntensity={0.14}
              roughness={0.3}
              metalness={0.46}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
