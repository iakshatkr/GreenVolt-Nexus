import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { BufferAttribute, MathUtils, Points } from 'three';
import { EV_COLORS } from './constants';
import type { SceneAnimationState } from './types';

interface EnergyParticlesProps {
  state: SceneAnimationState;
}

interface ParticleSeed {
  x: number;
  y: number;
  z: number;
  phase: number;
}

export const EnergyParticles = ({ state }: EnergyParticlesProps) => {
  const points = useRef<Points>(null);

  const seeds = useMemo<ParticleSeed[]>(() => {
    return Array.from({ length: 46 }, (_, index) => {
      const angle = (index / 46) * Math.PI * 2;
      const radius = 1.4 + ((index * 37) % 9) * 0.1;
      return {
        x: Math.cos(angle) * radius,
        y: ((index % 7) - 3) * 0.1,
        z: Math.sin(angle) * radius * 0.72,
        phase: (index * 0.37) % (Math.PI * 2)
      };
    });
  }, []);

  const initial = useMemo(() => {
    const array = new Float32Array(seeds.length * 3);
    seeds.forEach((seed, index) => {
      array[index * 3] = seed.x;
      array[index * 3 + 1] = seed.y;
      array[index * 3 + 2] = seed.z;
    });
    return array;
  }, [seeds]);

  useFrame((sceneState) => {
    if (!points.current) {
      return;
    }

    const t = sceneState.clock.elapsedTime;
    const attribute = points.current.geometry.getAttribute('position') as BufferAttribute;
    const array = attribute.array as Float32Array;

    seeds.forEach((seed, index) => {
      const stride = index * 3;
      const swirl = Math.sin(t * 0.35 + seed.phase) * 0.08;
      const drift = state.chargeLevel * 0.32;
      const disperse = state.disconnect * 1.1 + state.depart * 1.7;

      array[stride] = seed.x + Math.cos(seed.phase + t * 0.48) * drift + seed.x * disperse * 0.22;
      array[stride + 1] = seed.y + swirl + Math.sin(seed.phase + t * 0.7) * 0.06 + state.depart * 0.28;
      array[stride + 2] = seed.z + Math.sin(seed.phase + t * 0.46) * drift + seed.z * disperse * 0.2;
    });

    attribute.needsUpdate = true;

    const material = points.current.material;
    if ('opacity' in material) {
      material.opacity = MathUtils.lerp(material.opacity, 0.22 + state.chargeLevel * 0.24 - state.depart * 0.1, 0.08);
    }
  });

  return (
    <points ref={points} position={[0.2, 0.42, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={initial} count={initial.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={EV_COLORS.secondaryGlow}
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.28}
        depthWrite={false}
      />
    </points>
  );
};
