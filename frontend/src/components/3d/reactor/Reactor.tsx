import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Sparkles } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { Group, MathUtils, Mesh, MeshStandardMaterial } from 'three';

export interface ReactorProps {
  disperse?: number;
}

const ringConfigs = [
  { radius: 0.86, tube: 0.012, rotation: [0.12, 0.4, 0.2] as [number, number, number], speed: 0.2, color: '#e5e7eb', emissive: '#94a3b8' },
  { radius: 0.98, tube: 0.011, rotation: [0.88, 0.1, 0.64] as [number, number, number], speed: -0.22, color: '#cbd5e1', emissive: '#64748b' },
  { radius: 1.11, tube: 0.011, rotation: [1.24, 0.5, 0.1] as [number, number, number], speed: 0.18, color: '#a8b3c3', emissive: '#475569' },
  { radius: 1.25, tube: 0.01, rotation: [0.45, 1.2, 0.45] as [number, number, number], speed: -0.16, color: '#f3f4f6', emissive: '#6b7280' },
  { radius: 1.38, tube: 0.01, rotation: [0.2, 0.8, 1.1] as [number, number, number], speed: 0.15, color: '#1f2937', emissive: '#334155' },
  { radius: 1.52, tube: 0.0095, rotation: [0.72, 0.22, 1.42] as [number, number, number], speed: -0.14, color: '#111827', emissive: '#1f2937' }
];

export const Reactor = ({ disperse = 0 }: ReactorProps) => {
  const root = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const coreMaterial = useRef<MeshStandardMaterial>(null);
  const rings = useRef<Mesh[]>([]);
  const modules = useRef<Group>(null);
  const fragments = useRef<Group>(null);
  const disperseRef = useRef(0);

  const moduleItems = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const radius = 1.95;
        return {
          position: [Math.cos(angle) * radius, Math.sin(angle * 2) * 0.08, Math.sin(angle) * radius] as [number, number, number],
          rotation: [0, angle + Math.PI / 2, 0] as [number, number, number]
        };
      }),
    []
  );

  useFrame((state, delta) => {
    if (!root.current || !modules.current || !fragments.current || !core.current || !coreMaterial.current) {
      return;
    }

    const fragmentsGroup = fragments.current;

    const dTarget = MathUtils.clamp(disperse, 0, 1);
    disperseRef.current = MathUtils.lerp(disperseRef.current, dTarget, 0.08);
    const d = disperseRef.current;
    const t = state.clock.elapsedTime;

    root.current.position.y = Math.sin(t * 0.8) * (0.05 + d * 0.03) + Math.sin(t * 24) * d * 0.015;
    root.current.rotation.y += delta * (0.14 + d * 0.16);
    root.current.rotation.x = MathUtils.lerp(root.current.rotation.x, state.pointer.y * 0.08, 0.05);
    root.current.rotation.z = MathUtils.lerp(root.current.rotation.z, -state.pointer.x * 0.08, 0.05);

    core.current.scale.setScalar(1 + Math.sin(t * 2.6) * 0.02 + d * 0.08);
    core.current.rotation.x += delta * (0.7 + d * 1.8);
    core.current.rotation.y += delta * (1 + d * 2.2);
    coreMaterial.current.emissiveIntensity = MathUtils.lerp(coreMaterial.current.emissiveIntensity, 0.42 + Math.sin(t * 5) * 0.06 + d * 0.7, 0.09);

    rings.current.forEach((ring, index) => {
      if (!ring) {
        return;
      }
      const sign = index % 2 === 0 ? 1 : -1;
      ring.rotation.y += delta * ringConfigs[index].speed;
      ring.rotation.x += delta * ringConfigs[index].speed * 0.45;
      ring.position.x = MathUtils.lerp(ring.position.x, sign * d * (0.24 + index * 0.05), 0.08);
      ring.position.y = MathUtils.lerp(ring.position.y, d * (index - 2) * 0.05, 0.08);
      ring.position.z = MathUtils.lerp(ring.position.z, -sign * d * (0.16 + index * 0.03), 0.08);
    });

    modules.current.rotation.y += delta * (0.11 + d * 0.22);
    modules.current.scale.setScalar(1 + d * 0.18);

    fragmentsGroup.rotation.y += delta * (0.18 + d * 0.32);
    fragmentsGroup.children.forEach((child, index) => {
      const angle = (index / fragmentsGroup.children.length) * Math.PI * 2;
      const radius = 0.44 + d * 1.5;
      child.position.set(Math.cos(angle) * radius, Math.sin(angle * 2) * d * 0.4, Math.sin(angle) * radius);
      child.rotation.x += delta * (0.25 + d * 1.1);
      child.rotation.y -= delta * (0.2 + d * 0.9);
      child.scale.setScalar(1 - d * 0.3);
    });
  });

  return (
    <group ref={root} scale={0.72}>
      <mesh>
        <sphereGeometry args={[0.34, 34, 34]} />
        <MeshTransmissionMaterial
          thickness={0.34}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.08}
          chromaticAberration={0.02}
          anisotropy={0.2}
          ior={1.43}
          color="#a2f4ff"
          distortion={0.03}
          distortionScale={0.06}
          temporalDistortion={0.02}
          samples={4}
          resolution={256}
        />
      </mesh>

      <mesh ref={core}>
        <icosahedronGeometry args={[0.19, 2]} />
        <meshStandardMaterial
          ref={coreMaterial}
          color="#f8fbff"
          emissive="#67e8f9"
          emissiveIntensity={0.42}
          roughness={0.14}
          metalness={0.3}
        />
      </mesh>

      {ringConfigs.map((cfg, index) => (
        <mesh
          key={`ring-${index}`}
          ref={(el) => {
            if (el) {
              rings.current[index] = el;
            }
          }}
          rotation={cfg.rotation}
        >
          <torusGeometry args={[cfg.radius, cfg.tube, 22, 220]} />
          <meshStandardMaterial
            color={cfg.color}
            emissive={cfg.emissive}
            emissiveIntensity={0.18}
            metalness={0.85}
            roughness={0.22}
          />
        </mesh>
      ))}

      <group ref={modules}>
        {moduleItems.map((item, i) => (
          <group key={`module-${i}`} position={item.position} rotation={item.rotation}>
            <mesh>
              <boxGeometry args={[0.3, 0.16, 0.22]} />
              <meshStandardMaterial color="#d1d5db" emissive="#6b7280" emissiveIntensity={0.12} metalness={0.88} roughness={0.25} />
            </mesh>
            <mesh position={[0.18, 0, 0]}>
              <boxGeometry args={[0.08, 0.12, 0.18]} />
              <meshStandardMaterial color="#6b7280" emissive="#334155" emissiveIntensity={0.08} metalness={0.9} roughness={0.22} />
            </mesh>
            <mesh position={[-0.18, 0, 0]}>
              <boxGeometry args={[0.08, 0.12, 0.18]} />
              <meshStandardMaterial color="#6b7280" emissive="#334155" emissiveIntensity={0.08} metalness={0.9} roughness={0.22} />
            </mesh>
            <mesh position={[0, -0.11, 0]}>
              <sphereGeometry args={[0.03, 10, 10]} />
              <meshStandardMaterial color="#f8fafc" emissive="#22d3ee" emissiveIntensity={0.2} metalness={0.5} roughness={0.35} />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={fragments}>
        {Array.from({ length: 20 }).map((_, index) => (
          <mesh key={`frag-${index}`}>
            <octahedronGeometry args={[0.045, 0]} />
            <meshStandardMaterial color="#cbd5e1" emissive="#38bdf8" emissiveIntensity={0.1} metalness={0.76} roughness={0.26} />
          </mesh>
        ))}
      </group>

      <Sparkles count={20} scale={[3.4, 2.4, 3.4]} size={1.4} speed={0.14} opacity={0.3} color="#67e8f9" />
    </group>
  );
};
