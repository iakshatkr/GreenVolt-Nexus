import { EVChargingScene } from '../3d/evCharging';

interface CinematicEVHero3DProps {
  progress?: number;
}

export const CinematicEVHero3D = ({ progress = 0 }: CinematicEVHero3DProps) => {
  return <EVChargingScene progress={progress} />;
};
