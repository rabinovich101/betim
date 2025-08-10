'use client';

import Link from 'next/link';
import { useLoading } from '@/contexts/LoadingContext';
import { ComponentProps, MouseEvent } from 'react';

type LoadingLinkProps = ComponentProps<typeof Link>;

export default function LoadingLink({ children, onClick, ...props }: LoadingLinkProps) {
  const { startLoading } = useLoading();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Don't trigger loading for external links or links with target
    const target = e.currentTarget;
    if (target.target || !target.href.startsWith(window.location.origin)) {
      if (onClick) onClick(e as any);
      return;
    }

    // Start loading animation
    startLoading();
    
    // Call original onClick if provided
    if (onClick) onClick(e as any);
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}