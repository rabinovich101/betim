'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function NavbarWithDropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(balance);
  };

  return (
    <nav className="fixed top-0 left-0 w-screen z-50 bg-[#232438] border-b border-[rgba(255,255,255,0.05)]">
      <div className="px-4 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#00ff87] rounded-lg flex items-center justify-center">
                <span className="text-[#1a1a2e] font-bold text-lg">B</span>
              </div>
              <span className="text-white font-bold text-xl">BETIM</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/sports" className="text-[#a0a0b8] hover:text-white transition-colors duration-200">
                Sports
              </Link>
              <Link href="/casino" className="text-[#a0a0b8] hover:text-white transition-colors duration-200">
                Casino
              </Link>
              <Link href="/live-casino" className="text-[#a0a0b8] hover:text-white transition-colors duration-200">
                Live Casino
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              // Logged in state with dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff87] to-[#00d68f] flex items-center justify-center text-[#0a1a1f] font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Username and Balance */}
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-white text-sm font-medium">{user.username}</span>
                    <span className="text-[#00ff87] text-xs font-bold">{formatBalance(user.balance)}</span>
                  </div>

                  {/* Dropdown Arrow */}
                  <svg 
                    className={`w-4 h-4 text-white/60 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#1a1a2e] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#1f2937] to-[#111827]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00ff87] to-[#00d68f] flex items-center justify-center text-[#0a1a1f] font-bold text-lg">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.username}</p>
                          <p className="text-xs text-white/60">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Balance Section */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-sm">Balance</span>
                        <span className="text-[#00ff87] font-bold text-lg">{formatBalance(user.balance)}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-1.5 bg-[#00ff87] text-[#0a1a1f] rounded-lg font-medium text-sm hover:bg-[#00ff87]/90 transition-colors">
                          Deposit
                        </button>
                        <button className="flex-1 px-3 py-1.5 bg-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/20 transition-colors">
                          Withdraw
                        </button>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link href="/account" className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Account
                      </Link>
                      
                      <Link href="/bets" className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Bets
                      </Link>

                      <Link href="/transactions" className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Transactions
                      </Link>

                      <Link href="/bonuses" className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        Bonuses
                      </Link>

                      <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="px-4 py-3 border-t border-white/10">
                      <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#ff4757]/20 text-white hover:text-[#ff4757] rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Not logged in - show original login/signup buttons
              <>
                <Link 
                  href="/login"
                  className="hidden md:block px-4 py-2 text-[#00ff87] border border-[#00ff87] rounded-lg hover:bg-[#00ff87] hover:text-[#1a1a2e] transition-all duration-200 font-semibold"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup"
                  className="hidden md:block px-4 py-2 bg-[#00ff87] text-[#1a1a2e] rounded-lg hover:bg-[#00d68f] transition-all duration-200 font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}