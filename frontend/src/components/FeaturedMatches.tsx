'use client';

export default function FeaturedMatches() {
  return (
    <div className="w-[80%] mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">FEATURED MATCHES</h2>
      
      <div className="relative bg-gradient-to-br from-[#1a2c38] via-[#0f2027] to-[#1a2c38] rounded-2xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-[#00ff87] to-transparent blur-3xl"></div>
        </div>

        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Home Team */}
            <div className="flex-1 text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 bg-gradient-to-br from-[#dc2626] to-[#991b1b] rounded-full flex items-center justify-center text-5xl shadow-2xl">
                ⚽
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
                Liverpool
              </h3>
            </div>

            {/* Match Info */}
            <div className="flex-1 text-center">
              <div className="text-sm text-[#a0a0b8] font-semibold mb-2">
                TODAY 19:00
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase">
                Liverpool
              </div>
              
              {/* Bet Now Button */}
              <button className="px-8 py-3 bg-gradient-to-r from-[#00ff87] to-[#00d68f] text-[#0a1a1f] font-bold rounded-xl hover:shadow-lg hover:shadow-[#00ff87]/30 transition-all duration-200 transform hover:scale-105 uppercase">
                Bet Now
              </button>
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 bg-gradient-to-br from-[#dc2626] to-[#991b1b] rounded-full flex items-center justify-center text-5xl shadow-2xl">
                ⚽
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
                Arsenal
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}