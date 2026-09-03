import React, { type HTMLAttributes } from 'react';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-zinc-800 rounded ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
