import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';

export const CameraRig = ({ parallax = 1 }: { parallax?: number }) => {
  const { camera, pointer } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const driftX = Math.sin(t * 0.22) * 0.08;
    const driftY = Math.cos(t * 0.18) * 0.04;

    camera.position.x = MathUtils.lerp(camera.position.x, driftX + pointer.x * 0.18 * parallax, 0.035);
    camera.position.y = MathUtils.lerp(camera.position.y, 0.82 + driftY + pointer.y * 0.1 * parallax, 0.035);
    camera.lookAt(0.1, 0.28, 0);
  });

  return null;
};
