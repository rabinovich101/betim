'use client';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1a1a2e]/80 backdrop-blur-sm">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-20 h-20 border-4 border-[#232438] border-t-[#00ff87] rounded-full animate-spin"></div>
        
        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00ff87] to-[#00d68f] rounded-lg flex items-center justify-center animate-pulse">
            <span className="text-[#0a1a1f] font-bold text-xl">B</span>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <p className="text-white text-sm font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    </div>
  );
}