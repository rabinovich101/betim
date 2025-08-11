'use client';

import { useState, useEffect } from 'react';
import { useBets } from '@/contexts/BetContext';
import { oddsApi, Event } from '@/services/oddsApi';

export default function FeaturedMatches() {
  const { addBet, isBetSelected } = useBets();
  const [featuredMatch, setFeaturedMatch] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMatch = async () => {
      setLoading(true);
      try {
        const featured = await oddsApi.getFeaturedEvents();
        // Get the first football match from featured events
        const footballMatch = featured.find(e => e.sport === 'football') || featured[0];
        setFeaturedMatch(footballMatch);
      } catch (error) {
        console.error('Error fetching featured match:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMatch();
  }, []);

  const handleBetClick = (type: 'home' | 'draw' | 'away') => {
    if (!featuredMatch || !featuredMatch.markets['1X2']) return;
    
    const odds = featuredMatch.markets['1X2'][type];
    const selection = type === 'home' 
      ? featuredMatch.homeTeam 
      : type === 'away' 
      ? featuredMatch.awayTeam 
      : 'Draw';
    
    addBet({
      id: `featured-${featuredMatch.id}-${type}`,
      matchId: `featured-${featuredMatch.id}`,
      selection: selection || '',
      type,
      odds,
      teams: `${featuredMatch.homeTeam} vs ${featuredMatch.awayTeam}`,
      sport: 'football'
    });
  };

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (!featuredMatch || featuredMatch.sport !== 'football') {
    return null;
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

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
                {featuredMatch.homeTeam}
              </h3>
              {featuredMatch.isLive && featuredMatch.homeScore !== null && (
                <div className="text-3xl font-bold text-[#00ff87] mt-2">
                  {featuredMatch.homeScore}
                </div>
              )}
            </div>

            {/* Match Info */}
            <div className="flex-1 text-center">
              <div className="text-sm text-[#a0a0b8] font-semibold mb-2">
                {featuredMatch.isLive ? (
                  <span className="text-[#ff4757]">LIVE {featuredMatch.minute}'</span>
                ) : (
                  `TODAY ${formatTime(featuredMatch.startTime)}`
                )}
              </div>
              <div className="text-lg font-semibold text-[#00ff87] mb-2">
                {featuredMatch.league}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-6">
                {featuredMatch.isLive && featuredMatch.homeScore !== null && featuredMatch.awayScore !== null ? (
                  <span>{featuredMatch.homeScore} - {featuredMatch.awayScore}</span>
                ) : (
                  'VS'
                )}
              </div>
              
              {/* Bet Now Button */}
              <button className="px-8 py-3 bg-gradient-to-r from-[#00ff87] to-[#00d68f] text-[#0a1a1f] font-bold rounded-xl hover:shadow-lg hover:shadow-[#00ff87]/30 transition-all duration-200 transform hover:scale-105 uppercase">
                Bet Now
              </button>

              {/* Odds Buttons */}
              {featuredMatch.markets['1X2'] && (
                <div className="flex justify-center gap-4 mt-6">
                  <button 
                    onClick={() => handleBetClick('home')}
                    className={`px-6 py-3 rounded-lg border transition-all duration-200 ${
                      isBetSelected(`featured-${featuredMatch.id}`, 'home') 
                        ? 'bg-[#00ff87] border-[#00ff87] text-[#0a1a1f]' 
                        : 'bg-[#232438] border-white/10 hover:border-[#00ff87] hover:bg-[#2a2b3f] text-white'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1">1</div>
                    <div className="font-bold">{featuredMatch.markets['1X2'].home}</div>
                  </button>
                  <button 
                    onClick={() => handleBetClick('draw')}
                    className={`px-6 py-3 rounded-lg border transition-all duration-200 ${
                      isBetSelected(`featured-${featuredMatch.id}`, 'draw') 
                        ? 'bg-[#00ff87] border-[#00ff87] text-[#0a1a1f]' 
                        : 'bg-[#232438] border-white/10 hover:border-[#00ff87] hover:bg-[#2a2b3f] text-white'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1">X</div>
                    <div className="font-bold">{featuredMatch.markets['1X2'].draw}</div>
                  </button>
                  <button 
                    onClick={() => handleBetClick('away')}
                    className={`px-6 py-3 rounded-lg border transition-all duration-200 ${
                      isBetSelected(`featured-${featuredMatch.id}`, 'away') 
                        ? 'bg-[#00ff87] border-[#00ff87] text-[#0a1a1f]' 
                        : 'bg-[#232438] border-white/10 hover:border-[#00ff87] hover:bg-[#2a2b3f] text-white'
                    }`}
                  >
                    <div className="text-xs opacity-70 mb-1">2</div>
                    <div className="font-bold">{featuredMatch.markets['1X2'].away}</div>
                  </button>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 bg-gradient-to-br from-[#dc2626] to-[#991b1b] rounded-full flex items-center justify-center text-5xl shadow-2xl">
                ⚽
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
                {featuredMatch.awayTeam}
              </h3>
              {featuredMatch.isLive && featuredMatch.awayScore !== null && (
                <div className="text-3xl font-bold text-[#00ff87] mt-2">
                  {featuredMatch.awayScore}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}