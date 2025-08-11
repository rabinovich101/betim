"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { oddsApi } from '@/services/oddsApi';
import { useSidebar } from '@/components/LayoutClient';

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
  const { isCollapsed } = useSidebar();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState(0);
  const pathname = usePathname();

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

  const renderNavItem = (item: NavItem | SportItem, isSport = false) => {
    const active = isActive(item.href);
    
    return (
      <Link
        key={item.id}
        href={item.href}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        className={`
          relative flex items-center gap-3 rounded-xl
          transition-all duration-200 group
          ${isCollapsed ? 'px-3 py-2.5 justify-center' : 'px-4 py-2.5'}
          ${active
            ? 'bg-gradient-to-r from-[#00ff87]/20 to-[#00ff87]/10 text-[#00ff87] shadow-lg shadow-[#00ff87]/20' 
            : 'text-[#a0a0b8] hover:text-white hover:bg-white/5'
          }
        `}
      >
        {/* Active indicator bar */}
        {active && !isCollapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#00ff87] to-[#00d68f] rounded-r-full -translate-x-4 shadow-lg shadow-[#00ff87]/50" />
        )}
        
        {/* Icon */}
        <span className={`${isSport ? 'text-xl' : 'text-2xl'} relative`}>
          {item.icon}
          {!isSport && 'highlight' in item && item.highlight && (
            isCollapsed ? (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#ff4757] rounded-full"></span>
            ) : (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff4757] rounded-full animate-ping"></span>
            )
          )}
        </span>
        
        {/* Label and badges when expanded */}
        {!isCollapsed && (
          <>
            <span className={`font-medium ${isSport ? 'text-sm' : ''}`}>
              {item.label}
            </span>
            {'badge' in item && item.badge && (
              <span className="ml-auto bg-gradient-to-r from-[#ff4757] to-[#ff6b7a] text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                {item.badge}
              </span>
            )}
            {'count' in item && item.count && (
              <span className="ml-auto text-xs text-[#a0a0b8]">
                {item.count}
              </span>
            )}
          </>
        )}
        
        {/* Tooltip when collapsed */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a2e] text-white text-sm rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/10">
            {item.label}
            {'badge' in item && item.badge && (
              <span className="ml-2 bg-[#ff4757] text-white px-1.5 py-0.5 rounded text-xs">{item.badge}</span>
            )}
            {'count' in item && item.count && (
              <span className="ml-2 text-[#a0a0b8]">({item.count})</span>
            )}
          </div>
        )}
        
        {/* Hover glow effect */}
        {!active && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00ff87]/0 to-[#00ff87]/0 group-hover:from-[#00ff87]/10 group-hover:to-transparent transition-all duration-300"></div>
        )}
      </Link>
    );
  };

  return (
    <aside className={`
      sticky top-16 h-[calc(100vh-4rem)] z-30
      bg-gradient-to-b from-[#0f2027] to-[#0a1a1f]
      border-r border-white/5
      transition-all duration-300 ease-out
      ${isCollapsed ? 'w-16' : 'w-56'}
      shadow-xl
      overflow-y-auto overflow-x-hidden
    `}>
      {/* Main Navigation */}
      <nav className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
        {/* Show sports categories if on sports page, otherwise show main nav */}
        {isOnSportsPage ? (
          <div className="space-y-1">
            {/* Sports Title */}
            {!isCollapsed && (
              <h2 className="text-lg font-bold text-white px-4 py-2 mb-2">Sports Categories</h2>
            )}
            
            {/* Sports Categories */}
            {sportsCategories.map((sport) => renderNavItem(sport, true))}
          </div>
        ) : (
          <div className="space-y-1">
            {navItems.map((item) => renderNavItem(item))}
          </div>
        )}

        {/* Additional sections only when expanded and not on sports page */}
        {!isCollapsed && !isOnSportsPage && (
          <>
            {/* Separator */}
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Quick Links Section */}
            <div className="mt-4">
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

            {/* Separator */}
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Promotions Section */}
            <div className="mt-4">
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

            {/* Separator */}
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Account & Tools Section */}
            <div className="mt-4">
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
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;