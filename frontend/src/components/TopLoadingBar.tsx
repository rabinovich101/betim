'use client';

import { useEffect, useState } from 'react';

interface TopLoadingBarProps {
  isLoading: boolean;
}

export default function TopLoadingBar({ isLoading }: TopLoadingBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(10);
      const timer1 = setTimeout(() => setProgress(30), 100);
      const timer2 = setTimeout(() => setProgress(50), 200);
      const timer3 = setTimeout(() => setProgress(80), 300);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] h-1">
      <div 
        className="h-full bg-gradient-to-r from-[#00ff87] to-[#00d68f] transition-all duration-300 ease-out shadow-lg shadow-[#00ff87]/50"
        style={{ 
          width: `${progress}%`,
          transition: progress === 100 ? 'all 0.3s ease-out' : 'all 0.5s ease-out'
        }}
      />
      {isLoading && (
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      )}
    </div>
  );
}