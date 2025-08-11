'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import TopLoadingBar from '@/components/TopLoadingBar';

type LoadingStyle = 'spinner' | 'top-bar' | 'both';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
  loadingStyle: LoadingStyle;
  setLoadingStyle: (style: LoadingStyle) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStyle, setLoadingStyle] = useState<LoadingStyle>('top-bar');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loadingCountRef = useRef(0);

  // Detect route changes for top-bar loading only
  useEffect(() => {
    // Only show top-bar loading for route changes if not already loading
    if (loadingStyle === 'top-bar' && loadingCountRef.current === 0) {
      setIsLoading(true);
      
      // Stop loading after a short delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300); // Shorter delay for top-bar
      
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, loadingStyle]);

  const startLoading = () => {
    loadingCountRef.current++;
    setIsLoading(true);
  };
  
  const stopLoading = () => {
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    if (loadingCountRef.current === 0) {
      setIsLoading(false);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, startLoading, stopLoading, loadingStyle, setLoadingStyle }}>
      {/* Removed spinner, only keep top-bar */}
      {loadingStyle === 'top-bar' && <TopLoadingBar isLoading={isLoading} />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}