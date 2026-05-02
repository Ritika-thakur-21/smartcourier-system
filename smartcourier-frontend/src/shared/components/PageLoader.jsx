import React from 'react';
import { Package } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9998] bg-surface/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shadow-fab animate-pulse">
          <Package size={32} color="#fff" strokeWidth={2.5} />
        </div>
        <div className="absolute inset-0 w-16 h-16 rounded-2xl border-2 border-brand animate-ping opacity-25" />
      </div>
      
      <p className="mt-6 text-brand font-heading font-bold text-lg tracking-tight animate-pulse">
        Loading SmartCourier...
      </p>
    </div>
  );
};

export default PageLoader;
