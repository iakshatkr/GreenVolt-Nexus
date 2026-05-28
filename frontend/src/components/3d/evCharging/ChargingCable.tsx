import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Group, MathUtils, Mesh } from 'three';
import { EV_COLORS } from './constants';
import type { SceneAnimationState } from './types';

interface ChargingCableProps {
  state: SceneAnimationState;
}

const bezierPoint = (
  t: number,
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number]
): [number, number, number] => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;

  return [
    uu * p0[0] + 2 * u * t * p1[0] + tt * p2[0],
    uu * p0[1] + 2 * u * t * p1[1] + tt * p2[1],
    uu * p0[2] + 2 * u * t * p1[2] + tt * p2[2]
  ];
};

export const ChargingCable = ({ state }: ChargingCableProps) => {
  const pulses = useRef<Mesh[]>([]);
  const pulseOffsets = useMemo(() => [0, 0.21, 0.43, 0.66], []);

  const carAnchorX = -0.08 + state.depart * 2.8;
  const stationPort: [number, number, number] = [2.1, -0.12, 0.06];
  const carPortConnected: [number, number, number] = [carAnchorX + 1.02, 0.28, 0.62];
  const carPortDetached: [number, number, number] = [2.02, -0.04, 0.26];

  const end: [number, number, number] = [
    MathUtils.lerp(carPortConnected[0], carPortDetached[0], state.disconnect),
    MathUtils.lerp(carPortConnected[1], carPortDetached[1], state.disconnect),
    MathUtils.lerp(carPortConnected[2], carPortDetached[2], state.disconnect)
  ];

  const control: [number, number, number] = [
    MathUtils.lerp(1.25, 2.06, state.disconnect),
    0.56,
    MathUtils.lerp(0.68, 0.22, state.disconnect)
  ];

  const cablePoints = useMemo(() => {
    return Array.from({ length: 18 }, (_, index) => {
      const t = index / 17;
      return bezierPoint(t, stationPort, control, end);
    });
  }, [control, end]);

  useFrame((sceneState) => {
    const t = sceneState.clock.elapsedTime;
    const active = Math.max(0.08, 1 - state.disconnect);

    pulses.current.forEach((pulse, index) => {
      if (!pulse) {
        return;
      }

      const travel = (t * 0.45 + pulseOffsets[index]) % 1;
      const p = bezierPoint(travel, stationPort, control, end);
      pulse.position.set(p[0], p[1], p[2]);

      const pulseScale = 0.72 + Math.sin(t * 3 + index) * 0.16;
      pulse.scale.setScalar(active * pulseScale);
      pulse.visible = state.disconnect < 0.98;
    });
  });

  return (
    <group>
      <Line
        points={cablePoints}
        color={EV_COLORS.secondaryGlow}
        lineWidth={2.2}
        transparent
        opacity={0.88 * (1 - state.disconnect * 0.72)}
      />

      {pulseOffsets.map((_, index) => (
        <mesh
          key={`pulse-${index}`}
          ref={(mesh) => {
            if (mesh) {
              pulses.current[index] = mesh;
            }
          }}
        >
          <sphereGeometry args={[0.032, 8, 8]} />
          <meshStandardMaterial color="#a5f3fc" emissive={EV_COLORS.secondaryGlow} emissiveIntensity={0.74} roughness={0.25} metalness={0.16} />
        </mesh>
      ))}
    </group>
  );
};
