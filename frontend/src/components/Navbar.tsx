'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-screen z-50 bg-[#232438] border-b border-[rgba(255,255,255,0.05)]">
      <div className="px-4 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#00ff87] rounded-lg flex items-center justify-center">
                <span className="text-[#1a1a2e] font-bold text-lg">B</span>
              </div>
              <span className="text-white font-bold text-xl">BETIM</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/sports" className="text-[#a0a0b8] hover:text-white transition-colors duration-200">
                Sports
              </a>
              <a href="/live" className="flex items-center space-x-1 text-[#a0a0b8] hover:text-white transition-colors duration-200">
                <span>Live</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#00ff87] rounded-full animate-pulse"></div>
                  <span className="bg-[#ff4757] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    23
                  </span>
                </div>
              </a>
              <a href="/casino" className="text-[#a0a0b8] hover:text-white transition-colors duration-200">
                Casino
              </a>
              <a href="/promotions" className="text-[#a0a0b8] hover:text-white transition-colors duration-200">
                Promotions
              </a>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons */}
            <button className="hidden md:block px-4 py-2 text-[#00ff87] border border-[#00ff87] rounded-lg hover:bg-[#00ff87] hover:text-[#1a1a2e] transition-all duration-200 font-semibold">
              Log In
            </button>
            <button className="hidden md:block px-4 py-2 bg-[#00ff87] text-[#1a1a2e] rounded-lg hover:bg-[#00d68f] transition-all duration-200 font-semibold">
              Sign Up
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(255,255,255,0.05)]">
            <div className="flex flex-col space-y-3">
              <a href="/sports" className="text-[#a0a0b8] hover:text-white transition-colors duration-200 py-2">
                Sports
              </a>
              <a href="/live" className="flex items-center space-x-2 text-[#a0a0b8] hover:text-white transition-colors duration-200 py-2">
                <span>Live</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#00ff87] rounded-full animate-pulse"></div>
                  <span className="bg-[#ff4757] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    23
                  </span>
                </div>
              </a>
              <a href="/casino" className="text-[#a0a0b8] hover:text-white transition-colors duration-200 py-2">
                Casino
              </a>
              <a href="/promotions" className="text-[#a0a0b8] hover:text-white transition-colors duration-200 py-2">
                Promotions
              </a>
              <div className="flex items-center space-x-2 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                <button className="flex-1 px-4 py-2 text-[#00ff87] border border-[#00ff87] rounded-lg hover:bg-[#00ff87] hover:text-[#1a1a2e] transition-all duration-200 font-semibold">
                  Log In
                </button>
                <button className="flex-1 px-4 py-2 bg-[#00ff87] text-[#1a1a2e] rounded-lg hover:bg-[#00d68f] transition-all duration-200 font-semibold">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}