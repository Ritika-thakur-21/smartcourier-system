import React from 'react';



const SkeletonRow = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-surface p-4 rounded-xl border border-border flex items-center gap-4 animate-pulse">
          <div className="w-10 h-10 rounded-lg bg-surface-3 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-3 rounded w-1/4" />
            <div className="h-3 bg-surface-3 rounded w-1/2" />
          </div>
          <div className="h-6 bg-surface-3 rounded-full w-20" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonRow;
