interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => <div className={`skeleton ${className}`.trim()} />;
