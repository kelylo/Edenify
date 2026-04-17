import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-surface-container-low rounded ${className || ''}`.trim()} />
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({ count = 6, className }) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full mb-3" />
    ))}
  </div>
);