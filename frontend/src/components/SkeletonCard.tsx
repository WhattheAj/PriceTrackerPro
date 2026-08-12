import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse flex flex-col justify-between h-96 overflow-hidden">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-16 h-6 bg-slate-200 rounded-lg" />
          <div className="w-12 h-5 bg-slate-200 rounded-full" />
        </div>

        <div className="w-full h-36 bg-slate-100 rounded-xl mb-4" />

        <div className="space-y-2">
          <div className="w-full h-4 bg-slate-200 rounded-md" />
          <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
        </div>

        <div className="flex items-center justify-between gap-2 mt-4">
          <div className="w-20 h-5 bg-slate-100 rounded-md" />
          <div className="w-10 h-5 bg-slate-100 rounded-md" />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="w-16 h-3 bg-slate-100 rounded-md" />
          <div className="w-24 h-5 bg-slate-200 rounded-md" />
        </div>
        <div className="w-9 h-9 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};
