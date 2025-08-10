'use client';

import { useState } from 'react';
import { useBets } from '@/contexts/BetContext';

interface Match {
  id: string;
  teams: string;
  time: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  icon: string;
  sport: 'football' | 'basketball' | 'tennis' | 'baseball';
}

export default function UpcomingLive() {
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const { addBet, isBetSelected } = useBets();

  const allMatches: Match[] = [
    {
      id: '1',
      teams: 'Liverpool\nArsenal',
      time: '18:00',
      odds: { home: 1.90, draw: 3.60, away: 4.20 },
      icon: '⚽',
      sport: 'football'
    },
    {
      id: '2',
      teams: 'Real Madrid\nBarcelona',
      time: '20:00',
      odds: { home: 1.96, draw: 3.60, away: 3.90 },
      icon: '⚽',
      sport: 'football'
    },
    {
      id: '3',
      teams: 'Golden State\nLos Angeles',
      time: '20:30',
      odds: { home: 2.40, draw: 3.30, away: 4.10 },
      icon: '🏀',
      sport: 'basketball'
    },
    {
      id: '4',
      teams: 'Tsitsipas\nDjokovic',
      time: '21:00',
      odds: { home: 2.10, draw: 3.50, away: 4.30 },
      icon: '🎾',
      sport: 'tennis'
    },
    {
      id: '5',
      teams: 'New York Yankees\nChicago Cubs',
      time: '21:30',
      odds: { home: 1.80, draw: 3.60, away: 4.40 },
      icon: '⚾',
      sport: 'baseball'
    },
    {
      id: '6',
      teams: 'Manchester United\nManchester City',
      time: '22:00',
      odds: { home: 2.80, draw: 3.40, away: 2.50 },
      icon: '⚽',
      sport: 'football'
    },
    {
      id: '7',
      teams: 'Lakers\nCeltics',
      time: '22:30',
      odds: { home: 1.95, draw: 3.50, away: 3.80 },
      icon: '🏀',
      sport: 'basketball'
    },
    {
      id: '8',
      teams: 'Nadal\nFederer',
      time: '23:00',
      odds: { home: 1.85, draw: 3.60, away: 4.20 },
      icon: '🎾',
      sport: 'tennis'
    },
    {
      id: '9',
      teams: 'PSG\nBayern Munich',
      time: '23:30',
      odds: { home: 2.20, draw: 3.30, away: 3.10 },
      icon: '⚽',
      sport: 'football'
    },
    {
      id: '10',
      teams: 'Boston Red Sox\nLA Dodgers',
      time: '00:00',
      odds: { home: 2.10, draw: 3.40, away: 3.50 },
      icon: '⚾',
      sport: 'baseball'
    },
    {
      id: '11',
      teams: 'Inter Milan\nAC Milan',
      time: '00:30',
      odds: { home: 2.30, draw: 3.20, away: 3.00 },
      icon: '⚽',
      sport: 'football'
    },
    {
      id: '12',
      teams: 'Warriors\nNets',
      time: '01:00',
      odds: { home: 1.75, draw: 3.80, away: 4.50 },
      icon: '🏀',
      sport: 'basketball'
    }
  ];

  const matches = allMatches.slice(0, displayCount);

  const loadMore = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + 5, allMatches.length));
      setIsLoading(false);
    }, 500);
  };

  const handleBetClick = (match: Match, type: 'home' | 'draw' | 'away') => {
    const teams = match.teams.split('\n');
    const selection = type === 'home' ? teams[0] : type === 'away' ? teams[1] : 'Draw';
    
    addBet({
      id: `${match.id}-${type}`,
      matchId: match.id,
      selection,
      type,
      odds: match.odds[type],
      teams: match.teams.replace('\n', ' vs '),
      sport: match.sport
    });
  };

  const getSportColor = (sport: string) => {
    switch(sport) {
      case 'football': return 'from-[#2563eb] to-[#1e40af]';
      case 'basketball': return 'from-[#ea580c] to-[#c2410c]';
      case 'tennis': return 'from-[#84cc16] to-[#65a30d]';
      case 'baseball': return 'from-[#6b7280] to-[#4b5563]';
      default: return 'from-[#2563eb] to-[#1e40af]';
    }
  };

  return (
    <div className="w-[80%] mx-auto mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">UPCOMING LIVE</h2>
      
      <div className="bg-gradient-to-br from-[#1a2c38]/60 via-[#0f2027]/60 to-[#1a2c38]/60 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
        <div className="space-y-4">
          {matches.map((match) => (
            <div 
              key={match.id}
              className="flex items-center justify-between p-4 bg-[#0a1a1f]/50 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 group hover:bg-[#0a1a1f]/70"
            >
              {/* Sport Icon */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getSportColor(match.sport)} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                  {match.icon}
                </div>
                
                {/* Teams */}
                <div className="text-white">
                  {match.teams.split('\n').map((team, index) => (
                    <div key={index} className={`font-medium ${index === 0 ? '' : 'text-sm opacity-90'}`}>
                      {team}
                    </div>
                  ))}
                </div>
              </div>

              {/* Time and Odds */}
              <div className="flex items-center gap-6">
                {/* Time */}
                <div className="text-[#a0a0b8] font-medium">
                  {match.time}
                </div>

                {/* Odds */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleBetClick(match, 'home')}
                    className={`px-4 py-2 rounded-lg border transition-all duration-200 min-w-[65px] ${
                      isBetSelected(match.id, 'home') 
                        ? 'bg-[#00ff87] border-[#00ff87] text-[#0a1a1f]' 
                        : 'bg-[#232438] border-white/10 hover:border-[#00ff87] hover:bg-[#2a2b3f] text-white'
                    }`}
                  >
                    <span className="font-bold">{match.odds.home.toFixed(2)}</span>
                  </button>
                  <button 
                    onClick={() => handleBetClick(match, 'draw')}
                    className={`px-4 py-2 rounded-lg border transition-all duration-200 min-w-[65px] ${
                      isBetSelected(match.id, 'draw') 
                        ? 'bg-[#00ff87] border-[#00ff87] text-[#0a1a1f]' 
                        : 'bg-[#232438] border-white/10 hover:border-[#00ff87] hover:bg-[#2a2b3f] text-white'
                    }`}
                  >
                    <span className="font-bold">{match.odds.draw.toFixed(2)}</span>
                  </button>
                  <button 
                    onClick={() => handleBetClick(match, 'away')}
                    className={`px-4 py-2 rounded-lg border transition-all duration-200 min-w-[65px] ${
                      isBetSelected(match.id, 'away') 
                        ? 'bg-[#00ff87] border-[#00ff87] text-[#0a1a1f]' 
                        : 'bg-[#232438] border-white/10 hover:border-[#00ff87] hover:bg-[#2a2b3f] text-white'
                    }`}
                  >
                    <span className="font-bold">{match.odds.away.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {displayCount < allMatches.length && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-[#232438] to-[#1a1a2e] border border-white/10 rounded-xl text-white font-medium hover:border-[#00ff87] hover:from-[#2a2b3f] hover:to-[#1f1f33] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Load More Games</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              )}
            </button>
            <div className="mt-2 text-sm text-[#a0a0b8]">
              Showing {matches.length} of {allMatches.length} matches
            </div>
          </div>
        )}
      </div>
    </div>
  );
}