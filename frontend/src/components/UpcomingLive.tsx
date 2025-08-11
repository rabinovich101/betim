'use client';

import { useState, useEffect } from 'react';
import { useBets } from '@/contexts/BetContext';
import { oddsApi, Event } from '@/services/oddsApi';

export default function UpcomingLive() {
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<Event[]>([]);
  const { addBet, isBetSelected } = useBets();

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const liveEvents = await oddsApi.getLiveEvents();
        // Take first 12 live events
        setMatches(liveEvents.slice(0, 12));
      } catch (error) {
        console.error('Error fetching live events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleBetClick = (matchId: string, event: Event, betType: 'home' | 'draw' | 'away' | '1' | '2') => {
    let odds = 0;
    let selection = '';
    let type = betType;

    if (event.sport === 'football' && event.markets['1X2']) {
      if (betType === 'home' || betType === '1') {
        odds = event.markets['1X2'].home;
        selection = event.homeTeam || '';
        type = 'home';
      } else if (betType === 'draw') {
        odds = event.markets['1X2'].draw;
        selection = 'Draw';
      } else if (betType === 'away' || betType === '2') {
        odds = event.markets['1X2'].away;
        selection = event.awayTeam || '';
        type = 'away';
      }
    } else if (event.sport === 'tennis' && event.markets['matchWinner']) {
      if (betType === '1') {
        odds = event.markets['matchWinner'].player1;
        selection = event.player1 || '';
      } else if (betType === '2') {
        odds = event.markets['matchWinner'].player2;
        selection = event.player2 || '';
      }
    } else if (event.sport === 'basketball' && event.markets['moneyline']) {
      if (betType === '1') {
        odds = event.markets['moneyline'].home;
        selection = event.homeTeam || '';
      } else if (betType === '2') {
        odds = event.markets['moneyline'].away;
        selection = event.awayTeam || '';
      }
    }

    if (odds > 0 && selection) {
      const teams = event.sport === 'tennis' 
        ? `${event.player1} vs ${event.player2}`
        : `${event.homeTeam} vs ${event.awayTeam}`;

      addBet({
        id: `${matchId}-${type}`,
        matchId,
        selection,
        type,
        odds,
        teams,
        sport: event.sport
      });
    }
  };

  const loadMoreMatches = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + 5, matches.length));
      setIsLoading(false);
    }, 500);
  };

  const displayedMatches = matches.slice(0, displayCount);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getSportIcon = (sport: string) => {
    switch(sport) {
      case 'football': return '⚽';
      case 'basketball': return '🏀';
      case 'tennis': return '🎾';
      case 'baseball': return '⚾';
      default: return '🏆';
    }
  };

  if (matches.length === 0 && !isLoading) {
    return (
      <div className="w-[80%] mx-auto mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">UPCOMING LIVE</h2>
        <div className="bg-gradient-to-br from-[#1a2c38] via-[#0f2027] to-[#1a2c38] rounded-xl p-8">
          <p className="text-center text-[#a0a0b8]">No live matches at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[80%] mx-auto mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">UPCOMING LIVE</h2>
      
      <div className="bg-gradient-to-br from-[#1a2c38] via-[#0f2027] to-[#1a2c38] rounded-xl p-6">
        <div className="space-y-2">
          {displayedMatches.map((event) => (
            <div 
              key={event.id}
              className="flex items-center justify-between p-4 bg-[#0f1923]/50 hover:bg-[#0f1923]/70 rounded-lg transition-all duration-200 border border-white/5 hover:border-[#00ff87]/20"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Sport Icon */}
                <div className="text-2xl">{getSportIcon(event.sport)}</div>
                
                {/* Teams/Players */}
                <div className="text-white">
                  {event.sport === 'tennis' ? (
                    <div className="space-y-1">
                      <div>{event.player1}</div>
                      <div>{event.player2}</div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div>{event.homeTeam}</div>
                      <div>{event.awayTeam}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Time/Status and Score */}
              <div className="px-4 text-center">
                {event.isLive ? (
                  <div>
                    <div className="text-[#ff4757] font-bold text-xs mb-1">LIVE</div>
                    {event.sport === 'football' && event.minute && (
                      <div className="text-white text-sm">{event.minute}'</div>
                    )}
                    {event.sport === 'basketball' && event.quarter && (
                      <div className="text-white text-sm">Q{event.quarter}</div>
                    )}
                    {event.sport === 'tennis' && event.currentSet && (
                      <div className="text-white text-sm">Set {event.currentSet}</div>
                    )}
                    {event.homeScore !== undefined && event.awayScore !== undefined && (
                      <div className="text-[#00ff87] font-bold">
                        {event.homeScore} - {event.awayScore}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[#a0a0b8] text-sm">
                    {formatTime(event.startTime)}
                  </div>
                )}
              </div>

              {/* Odds Buttons */}
              <div className="flex gap-2">
                {event.sport === 'football' && event.markets['1X2'] ? (
                  <>
                    <button 
                      onClick={() => handleBetClick(`match-${event.id}`, event, 'home')}
                      className={`px-4 py-2 min-w-[60px] rounded-lg transition-all duration-200 ${
                        isBetSelected(`match-${event.id}`, 'home')
                          ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                          : 'bg-[#232438] text-white hover:bg-[#2a2b3f] border border-white/10 hover:border-[#00ff87]/30'
                      }`}
                    >
                      {event.markets['1X2'].home}
                    </button>
                    <button 
                      onClick={() => handleBetClick(`match-${event.id}`, event, 'draw')}
                      className={`px-4 py-2 min-w-[60px] rounded-lg transition-all duration-200 ${
                        isBetSelected(`match-${event.id}`, 'draw')
                          ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                          : 'bg-[#232438] text-white hover:bg-[#2a2b3f] border border-white/10 hover:border-[#00ff87]/30'
                      }`}
                    >
                      {event.markets['1X2'].draw}
                    </button>
                    <button 
                      onClick={() => handleBetClick(`match-${event.id}`, event, 'away')}
                      className={`px-4 py-2 min-w-[60px] rounded-lg transition-all duration-200 ${
                        isBetSelected(`match-${event.id}`, 'away')
                          ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                          : 'bg-[#232438] text-white hover:bg-[#2a2b3f] border border-white/10 hover:border-[#00ff87]/30'
                      }`}
                    >
                      {event.markets['1X2'].away}
                    </button>
                  </>
                ) : event.sport === 'tennis' && event.markets['matchWinner'] ? (
                  <>
                    <button 
                      onClick={() => handleBetClick(`match-${event.id}`, event, '1')}
                      className={`px-4 py-2 min-w-[60px] rounded-lg transition-all duration-200 ${
                        isBetSelected(`match-${event.id}`, '1')
                          ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                          : 'bg-[#232438] text-white hover:bg-[#2a2b3f] border border-white/10 hover:border-[#00ff87]/30'
                      }`}
                    >
                      {event.markets['matchWinner'].player1}
                    </button>
                    <button 
                      onClick={() => handleBetClick(`match-${event.id}`, event, '2')}
                      className={`px-4 py-2 min-w-[60px] rounded-lg transition-all duration-200 ${
                        isBetSelected(`match-${event.id}`, '2')
                          ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                          : 'bg-[#232438] text-white hover:bg-[#2a2b3f] border border-white/10 hover:border-[#00ff87]/30'
                      }`}
                    >
                      {event.markets['matchWinner'].player2}
                    </button>
                  </>
                ) : event.sport === 'basketball' && event.markets['moneyline'] ? (
                  <>
                    <button 
                      onClick={() => handleBetClick(`match-${event.id}`, event, '1')}
                      className={`px-4 py-2 min-w-[60px] rounded-lg transition-all duration-200 ${
                        isBetSelected(`match-${event.id}`, '1')
                          ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                          : 'bg-[#232438] text-white hover:bg-[#2a2b3f] border border-white/10 hover:border-[#00ff87]/30'
                      }`}
                    >
                      {event.markets['moneyline'].home}
                    </button>
                    <button 
                      onClick={() => handleBetClick(`match-${event.id}`, event, '2')}
                      className={`px-4 py-2 min-w-[60px] rounded-lg transition-all duration-200 ${
                        isBetSelected(`match-${event.id}`, '2')
                          ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                          : 'bg-[#232438] text-white hover:bg-[#2a2b3f] border border-white/10 hover:border-[#00ff87]/30'
                      }`}
                    >
                      {event.markets['moneyline'].away}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {displayCount < matches.length && (
          <div className="mt-6 text-center">
            <button 
              onClick={loadMoreMatches}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-[#00ff87] to-[#00d68f] text-[#0a1a1f] font-bold rounded-xl hover:shadow-lg hover:shadow-[#00ff87]/30 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                <>
                  <span>Load More Games</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              </div>
            </button>
            <p className="text-sm text-[#a0a0b8] mt-2">
              Showing {displayedMatches.length} of {matches.length} matches
            </p>
          </div>
        )}
      </div>
    </div>
  );
}