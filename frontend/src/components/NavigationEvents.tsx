'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startLoading, stopLoading } = useLoading();
  
  useEffect(() => {
    // When pathname or search params change, loading is handled by context
    // This component can be used for additional navigation tracking if needed
    console.log(`Navigation to ${pathname}`);
  }, [pathname, searchParams]);

  // Listen for programmatic navigation
  useEffect(() => {
    const handleStart = () => startLoading();
    const handleComplete = () => stopLoading();
    
    // For Link component clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.target && link.href.startsWith(window.location.origin)) {
        startLoading();
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [startLoading, stopLoading]);

  return null;
}