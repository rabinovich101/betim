'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

  // Detect route changes
  useEffect(() => {
    // Start loading when route changes
    setIsLoading(true);
    
    // Stop loading after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // Adjust timing as needed
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, startLoading, stopLoading, loadingStyle, setLoadingStyle }}>
      {loadingStyle === 'spinner' && isLoading && <LoadingSpinner />}
      {loadingStyle === 'top-bar' && <TopLoadingBar isLoading={isLoading} />}
      {loadingStyle === 'both' && (
        <>
          <TopLoadingBar isLoading={isLoading} />
          {isLoading && <LoadingSpinner />}
        </>
      )}
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