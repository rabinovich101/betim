"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { oddsApi } from '@/services/oddsApi';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string;
  highlight?: boolean;
}

interface SportItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  count?: number;
}

const Sidebar = () => {
  // Start collapsed on mobile, expanded on desktop
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const pathname = usePathname();

  // Set initial state based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch live count
  useEffect(() => {
    const fetchLiveCount = async () => {
      try {
        const liveEvents = await oddsApi.getLiveEvents();
        setLiveCount(liveEvents.length);
      } catch (error) {
        console.error('Error fetching live count:', error);
      }
    };

    fetchLiveCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLiveCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Main navigation sections
  const navItems: NavItem[] = [
    { id: 'sports', label: 'Sports', icon: '⚽', href: '/sports' },
    { id: 'live', label: 'Live Betting', icon: '🔴', href: '/live', badge: liveCount > 0 ? String(liveCount) : undefined, highlight: liveCount > 0 },
    { id: 'casino', label: 'Casino', icon: '🎰', href: '/casino' },
    { id: 'live-casino', label: 'Live Casino', icon: '🎲', href: '/live-casino' },
    { id: 'esports', label: 'Esports', icon: '🎮', href: '/esports' },
    { id: 'virtual', label: 'Virtual Sports', icon: '🏃', href: '/virtual-sports' },
  ];

  // Quick Links section
  const quickLinks: NavItem[] = [
    { id: 'specials', label: "Today's Specials", icon: '⭐', href: '/specials' },
    { id: 'favorites', label: 'My Favorites', icon: '❤️', href: '/favorites' },
    { id: 'bet-builder', label: 'Bet Builder', icon: '🛠️', href: '/bet-builder' },
    { id: 'statistics', label: 'Statistics', icon: '📊', href: '/statistics' },
    { id: 'results', label: 'Results', icon: '📈', href: '/results' },
  ];

  // Promotions section
  const promotionalItems: NavItem[] = [
    { id: 'welcome', label: 'Welcome Bonus', icon: '🎉', href: '/promotions/welcome' },
    { id: 'daily-rewards', label: 'Daily Rewards', icon: '🎁', href: '/promotions/daily' },
    { id: 'vip', label: 'VIP Program', icon: '👑', href: '/vip' },
    { id: 'tournaments', label: 'Tournaments', icon: '🏆', href: '/tournaments' },
    { id: 'refer', label: 'Refer a Friend', icon: '👥', href: '/refer' },
  ];

  // Account & Tools section
  const accountTools: NavItem[] = [
    { id: 'my-bets', label: 'My Bets', icon: '📝', href: '/account/bets' },
    { id: 'cash-out', label: 'Cash Out', icon: '💸', href: '/account/cashout' },
    { id: 'deposit', label: 'Deposit', icon: '💳', href: '/account/deposit' },
    { id: 'withdraw', label: 'Withdraw', icon: '🏦', href: '/account/withdraw' },
    { id: 'responsible', label: 'Responsible Gaming', icon: '🛡️', href: '/responsible-gaming' },
  ];

  const sportsCategories: SportItem[] = [
    { id: 'football', label: 'Football', icon: '⚽', href: '/sports/football', count: 145 },
    { id: 'basketball', label: 'Basketball', icon: '🏀', href: '/sports/basketball', count: 112 },
    { id: 'tennis', label: 'Tennis', icon: '🎾', href: '/sports/tennis', count: 98 },
    { id: 'american-football', label: 'American Football', icon: '🏈', href: '/sports/american-football', count: 87 },
    { id: 'ice-hockey', label: 'Ice Hockey', icon: '🏒', href: '/sports/ice-hockey', count: 76 },
    { id: 'baseball', label: 'Baseball', icon: '⚾', href: '/sports/baseball', count: 67 },
    { id: 'volleyball', label: 'Volleyball', icon: '🏐', href: '/sports/volleyball', count: 54 },
    { id: 'handball', label: 'Handball', icon: '🤾', href: '/sports/handball', count: 43 },
    { id: 'boxing', label: 'Boxing / MMA', icon: '🥊', href: '/sports/boxing-mma', count: 29 },
  ];

  const isActive = (href: string) => pathname === href;
  const isOnSportsPage = pathname?.startsWith('/sports');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCollapsed) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCollapsed]);

  return (
    <>
      {/* Mobile Overlay with animation */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={() => setIsCollapsed(true)}
      />

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] z-30
        bg-gradient-to-b from-[#0f2027] to-[#0a1a1f]
        border-r border-white/5
        transition-all duration-300 ease-out
        ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
        w-56
        lg:translate-x-0 lg:sticky lg:top-16
        shadow-2xl lg:shadow-xl
        overflow-y-auto
      `}>
        {/* Mobile close button */}
        {!isCollapsed && (
          <div className="relative p-4 lg:hidden">
            <button
              onClick={() => setIsCollapsed(true)}
              className="absolute top-4 right-4 text-[#a0a0b8] hover:text-white transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="p-4">
          {/* Show sports categories if on sports page, otherwise show main nav */}
          {isOnSportsPage ? (
            <div className="space-y-1">
              {/* Sports Title */}
              <h2 className="text-lg font-bold text-white px-4 py-2 mb-2">Sports Categories</h2>
              
              {/* Sports Categories */}
              {sportsCategories.map((sport) => (
                <Link
                  key={sport.id}
                  href={sport.href}
                  onMouseEnter={() => setHoveredItem(sport.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    relative flex items-center gap-3 px-4 py-2.5 rounded-xl
                    transition-all duration-200 group
                    ${isActive(sport.href) 
                      ? 'bg-gradient-to-r from-[#00ff87]/20 to-[#00ff87]/10 text-[#00ff87] shadow-lg shadow-[#00ff87]/20' 
                      : 'text-[#a0a0b8] hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive(sport.href) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#00ff87] to-[#00d68f] rounded-r-full -translate-x-4 shadow-lg shadow-[#00ff87]/50" />
                  )}
                  
                  {/* Icon */}
                  <span className="text-xl">{sport.icon}</span>
                  
                  {/* Label */}
                  <span className={`font-medium text-sm ${isCollapsed ? 'hidden lg:inline' : ''}`}>
                    {sport.label}
                  </span>
                  
                  {/* Count badge */}
                  {sport.count && (
                    <span className={`ml-auto text-xs text-[#a0a0b8] ${isCollapsed ? 'hidden lg:inline' : ''}`}>
                      {sport.count}
                    </span>
                  )}
                  
                  {/* Hover glow effect */}
                  {!isActive(sport.href) && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00ff87]/0 to-[#00ff87]/0 group-hover:from-[#00ff87]/10 group-hover:to-transparent transition-all duration-300"></div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 group
                    ${isActive(item.href) 
                      ? 'bg-gradient-to-r from-[#00ff87]/20 to-[#00ff87]/10 text-[#00ff87] shadow-lg shadow-[#00ff87]/20' 
                      : 'text-[#a0a0b8] hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive(item.href) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#00ff87] to-[#00d68f] rounded-r-full -translate-x-4 shadow-lg shadow-[#00ff87]/50" />
                  )}
                  
                  {/* Icon with glow effect */}
                  <span className={`text-2xl relative ${item.highlight ? 'animate-pulse' : ''}`}>
                    {item.icon}
                    {item.highlight && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff4757] rounded-full animate-ping"></span>
                    )}
                  </span>
                  
                  {/* Label and badge - Always visible on desktop, hidden on mobile when collapsed */}
                  <span className={`font-medium tracking-wide ${isCollapsed ? 'hidden lg:inline' : ''}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={`ml-auto bg-gradient-to-r from-[#ff4757] to-[#ff6b7a] text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg ${isCollapsed ? 'hidden lg:inline-block' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Hover glow effect */}
                  {!isActive(item.href) && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00ff87]/0 to-[#00ff87]/0 group-hover:from-[#00ff87]/10 group-hover:to-transparent transition-all duration-300"></div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Separator */}
          <div className={`my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent ${isCollapsed ? 'hidden lg:block' : ''}`}></div>

          {/* Quick Links Section */}
          {!isOnSportsPage && (
            <div className={`mt-4 ${isCollapsed ? 'hidden lg:block' : ''}`}>
              <h3 className="text-xs font-bold text-[#a0a0b8] uppercase tracking-wider px-4 mb-3">Quick Links</h3>
              <div className="space-y-1">
                {quickLinks.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#a0a0b8] hover:text-white hover:bg-white/5 transition-all duration-200 group text-sm"
                  >
                    <span className="text-base opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Separator */}
          <div className={`my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent ${isCollapsed ? 'hidden lg:block' : ''}`}></div>

          {/* Promotions Section */}
          {!isOnSportsPage && (
            <div className={`mt-4 ${isCollapsed ? 'hidden lg:block' : ''}`}>
              <h3 className="text-xs font-bold text-[#a0a0b8] uppercase tracking-wider px-4 mb-3">Promotions</h3>
              <div className="space-y-1">
                {promotionalItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#a0a0b8] hover:text-white hover:bg-white/5 transition-all duration-200 group text-sm"
                  >
                    <span className="text-base opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Separator */}
          <div className={`my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent ${isCollapsed ? 'hidden lg:block' : ''}`}></div>

          {/* Account & Tools Section */}
          {!isOnSportsPage && (
            <div className={`mt-4 ${isCollapsed ? 'hidden lg:block' : ''}`}>
              <h3 className="text-xs font-bold text-[#a0a0b8] uppercase tracking-wider px-4 mb-3">Account & Tools</h3>
              <div className="space-y-1">
                {accountTools.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#a0a0b8] hover:text-white hover:bg-white/5 transition-all duration-200 group text-sm"
                  >
                    <span className="text-base opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </nav>

      </aside>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className={`
          fixed top-20 left-4 z-30 lg:hidden
          w-12 h-12 bg-gradient-to-br from-[#132a2f] to-[#0f2027] border border-white/10 rounded-xl
          flex items-center justify-center text-white
          transition-all duration-300 transform hover:scale-105
          shadow-lg hover:shadow-xl
          ${!isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
      >
        <div className="flex flex-col gap-1">
          <span className="block w-5 h-0.5 bg-white rounded-full"></span>
          <span className="block w-3 h-0.5 bg-[#00ff87] rounded-full ml-1"></span>
          <span className="block w-5 h-0.5 bg-white rounded-full"></span>
        </div>
      </button>
    </>
  );
};

export default Sidebar;