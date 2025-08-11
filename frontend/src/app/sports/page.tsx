'use client';

import { useState } from 'react';

export default function SportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const popularMatches = [
    {
      id: 1,
      sport: 'Football',
      league: 'Premier League',
      home: 'Liverpool',
      away: 'Arsenal',
      time: '19:00',
      odds: { home: 2.10, draw: 3.40, away: 3.50 }
    },
    {
      id: 2,
      sport: 'Basketball',
      league: 'NBA',
      home: 'Lakers',
      away: 'Celtics',
      time: '20:30',
      odds: { home: 1.85, away: 1.95 }
    },
    {
      id: 3,
      sport: 'Tennis',
      league: 'Wimbledon',
      player1: 'Djokovic',
      player2: 'Nadal',
      time: '14:00',
      odds: { player1: 1.75, player2: 2.05 }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Sports Betting</h1>
        <p className="text-[#a0a0b8]">Choose your sport from the left sidebar to start betting</p>
      </div>

      {/* Featured Sports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-xl p-6 border border-white/5 hover:border-[#00ff87]/30 transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">⚽</span>
            <div>
              <h3 className="text-xl font-bold text-white">Football</h3>
              <p className="text-sm text-[#a0a0b8]">145 Live Matches</p>
            </div>
          </div>
          <div className="text-[#00ff87] text-sm font-medium">View All →</div>
        </div>

        <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-xl p-6 border border-white/5 hover:border-[#00ff87]/30 transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🏀</span>
            <div>
              <h3 className="text-xl font-bold text-white">Basketball</h3>
              <p className="text-sm text-[#a0a0b8]">112 Live Matches</p>
            </div>
          </div>
          <div className="text-[#00ff87] text-sm font-medium">View All →</div>
        </div>

        <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-xl p-6 border border-white/5 hover:border-[#00ff87]/30 transition-all cursor-pointer">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🎾</span>
            <div>
              <h3 className="text-xl font-bold text-white">Tennis</h3>
              <p className="text-sm text-[#a0a0b8]">98 Live Matches</p>
            </div>
          </div>
          <div className="text-[#00ff87] text-sm font-medium">View All →</div>
        </div>
      </div>

      {/* Popular Matches */}
      <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-xl p-6 border border-white/5">
        <h2 className="text-2xl font-bold text-white mb-6">Popular Matches Today</h2>
        
        <div className="space-y-4">
          {popularMatches.map((match) => (
            <div key={match.id} className="bg-[#0f0f23]/50 rounded-lg p-4 border border-white/5 hover:border-[#00ff87]/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-[#00ff87]/20 text-[#00ff87] px-2 py-1 rounded font-medium">
                    {match.sport}
                  </span>
                  <span className="text-xs text-[#a0a0b8]">{match.league}</span>
                  <span className="text-xs text-white">{match.time}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {match.sport === 'Tennis' ? (
                    <div className="text-white font-medium">
                      {match.player1} vs {match.player2}
                    </div>
                  ) : (
                    <div className="text-white font-medium">
                      {match.home} vs {match.away}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {match.sport === 'Tennis' ? (
                    <>
                      <button className="px-4 py-2 bg-[#1a1a2e] hover:bg-[#00ff87]/20 text-white hover:text-[#00ff87] rounded-lg transition-all text-sm font-medium">
                        1: {match.odds.player1}
                      </button>
                      <button className="px-4 py-2 bg-[#1a1a2e] hover:bg-[#00ff87]/20 text-white hover:text-[#00ff87] rounded-lg transition-all text-sm font-medium">
                        2: {match.odds.player2}
                      </button>
                    </>
                  ) : match.sport === 'Basketball' ? (
                    <>
                      <button className="px-4 py-2 bg-[#1a1a2e] hover:bg-[#00ff87]/20 text-white hover:text-[#00ff87] rounded-lg transition-all text-sm font-medium">
                        1: {match.odds.home}
                      </button>
                      <button className="px-4 py-2 bg-[#1a1a2e] hover:bg-[#00ff87]/20 text-white hover:text-[#00ff87] rounded-lg transition-all text-sm font-medium">
                        2: {match.odds.away}
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-4 py-2 bg-[#1a1a2e] hover:bg-[#00ff87]/20 text-white hover:text-[#00ff87] rounded-lg transition-all text-sm font-medium">
                        1: {match.odds.home}
                      </button>
                      <button className="px-4 py-2 bg-[#1a1a2e] hover:bg-[#00ff87]/20 text-white hover:text-[#00ff87] rounded-lg transition-all text-sm font-medium">
                        X: {match.odds.draw}
                      </button>
                      <button className="px-4 py-2 bg-[#1a1a2e] hover:bg-[#00ff87]/20 text-white hover:text-[#00ff87] rounded-lg transition-all text-sm font-medium">
                        2: {match.odds.away}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}