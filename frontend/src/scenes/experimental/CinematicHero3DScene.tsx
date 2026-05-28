import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import { Reactor } from '../../components/3d/reactor';

interface CinematicHero3DSceneProps {
  disperse?: number;
}

const CameraRig = () => {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x = MathUtils.lerp(camera.position.x, pointer.x * 0.16, 0.04);
    camera.position.y = MathUtils.lerp(camera.position.y, pointer.y * 0.12 + 0.06, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

export const CinematicHero3DScene = ({ disperse = 0 }: CinematicHero3DSceneProps) => (
  <Canvas
    camera={{ position: [0, 0.08, 4], fov: 34 }}
    dpr={[1, 1.35]}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  >
    <color attach="background" args={['#03060b']} />
    <fog attach="fog" args={['#03060b', 5.6, 10.4]} />

    <ambientLight intensity={0.3} />
    <directionalLight position={[2.6, 2.7, 2.2]} intensity={0.72} color="#d9f99d" />
    <pointLight position={[-2.1, -0.2, 1.5]} intensity={0.52} color="#22d3ee" />
    <pointLight position={[2.2, 0.35, -1.2]} intensity={0.46} color="#10b981" />
    <spotLight position={[0, 3, 2.7]} angle={0.4} penumbra={0.5} intensity={0.4} color="#e2e8f0" />

    <Reactor disperse={disperse} />
    <CameraRig />
  </Canvas>
);
