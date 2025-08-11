'use client';

import { useState, useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { oddsApi, Event } from '@/services/oddsApi';
import { useBets } from '@/contexts/BetContext';
import Link from 'next/link';
import ExpandableBettingMarketsV2 from '@/components/ExpandableBettingMarketsV2';

export default function FootballPage() {
  const [allMatches, setAllMatches] = useState<Event[]>([]);
  const [displayedMatches, setDisplayedMatches] = useState<Event[]>([]);
  const { startLoading, stopLoading } = useLoading();
  const { addBet, isBetSelected } = useBets();
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(20);
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      startLoading();
      
      try {
        // Fetch only football events
        const footballEvents = await oddsApi.getEventsBySport('football');
        
        // Sort by start time (live first, then upcoming)
        const sortedEvents = footballEvents.sort((a, b) => {
          // Live games first
          if (a.isLive && !b.isLive) return -1;
          if (!a.isLive && b.isLive) return 1;
          
          // If both are live, sort by minute
          if (a.isLive && b.isLive) {
            return (b.minute || 0) - (a.minute || 0);
          }
          
          // Then upcoming games sorted by start time
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        });
        
        setAllMatches(sortedEvents);
        setDisplayedMatches(sortedEvents.slice(0, 20)); // Use initial display count
      } catch (error) {
        console.error('Error fetching football data:', error);
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    };

    fetchData();
  }, []); // Only fetch once on mount

  // Update displayed matches when displayCount changes
  useEffect(() => {
    if (allMatches.length > 0) {
      setDisplayedMatches(allMatches.slice(0, displayCount));
    }
  }, [displayCount, allMatches]);

  const loadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    if (isToday) {
      return `Today ${hours}:${minutes}`;
    } else {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${day}/${month} ${hours}:${minutes}`;
    }
  };

  const handleBetClick = (event: Event, betType: 'home' | 'draw' | 'away') => {
    if (!event.markets['1X2']) return;

    const odds = event.markets['1X2'][betType];
    const selection = betType === 'home' 
      ? event.homeTeam 
      : betType === 'away' 
      ? event.awayTeam 
      : 'Draw';

    addBet({
      id: `football-${event.id}-${betType}`,
      matchId: `football-${event.id}`,
      selection: selection || '',
      type: betType,
      odds,
      teams: `${event.homeTeam} vs ${event.awayTeam}`,
      sport: 'football'
    });
  };

  // Remove loading spinner
  if (isLoading && allMatches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] p-6">
        {/* Empty state while loading */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">⚽</span>
          <h1 className="text-4xl font-bold text-white">Football</h1>
        </div>
        <p className="text-[#a0a0b8]">All football matches • {allMatches.length} events available</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1f2937]/50 to-[#111827]/50 rounded-lg p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔴</span>
            <div>
              <p className="text-[#a0a0b8] text-xs">Live Now</p>
              <p className="text-white font-bold text-lg">{allMatches.filter(m => m.isLive).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1f2937]/50 to-[#111827]/50 rounded-lg p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-[#a0a0b8] text-xs">Today's Matches</p>
              <p className="text-white font-bold text-lg">
                {allMatches.filter(m => {
                  const date = new Date(m.startTime);
                  const today = new Date();
                  return date.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1f2937]/50 to-[#111827]/50 rounded-lg p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="text-[#a0a0b8] text-xs">Leagues</p>
              <p className="text-white font-bold text-lg">
                {new Set(allMatches.map(m => m.league)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1f2937]/50 to-[#111827]/50 rounded-lg p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚽</span>
            <div>
              <p className="text-[#a0a0b8] text-xs">Total Matches</p>
              <p className="text-white font-bold text-lg">{allMatches.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">All Football Matches</h2>
          <div className="flex gap-2">
            <span className="text-sm text-[#a0a0b8]">
              Showing {displayedMatches.length} of {allMatches.length}
            </span>
          </div>
        </div>
        
        {displayedMatches.length === 0 ? (
          <p className="text-center text-[#a0a0b8] py-8">No football matches available at the moment</p>
        ) : (
          <div className="space-y-3">
            {displayedMatches.map((match) => (
              <div key={match.id} className="space-y-3">
                <div className="bg-[#0f0f23]/50 rounded-lg p-4 border border-white/5 hover:border-[#00ff87]/30 transition-all">
                  <div className="flex items-center justify-between">
                  {/* Match Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-[#00ff87]/20 text-[#00ff87] px-2 py-0.5 rounded font-medium">
                        {match.league}
                      </span>
                      {match.isLive ? (
                        <span className="text-xs bg-[#ff4757]/20 text-[#ff4757] px-2 py-0.5 rounded font-bold animate-pulse">
                          LIVE {match.minute}'
                        </span>
                      ) : (
                        <span className="text-xs text-white/60">{formatTime(match.startTime)}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-white font-medium">{match.homeTeam}</div>
                        <div className="text-white font-medium">{match.awayTeam}</div>
                      </div>
                      
                      {match.isLive && match.homeScore !== undefined && match.awayScore !== undefined && (
                        <div className="text-center px-4">
                          <div className="text-2xl font-bold text-[#00ff87]">
                            {match.homeScore}
                          </div>
                          <div className="text-2xl font-bold text-[#00ff87]">
                            {match.awayScore}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Odds Buttons */}
                  {match.markets['1X2'] && (
                    <div className="flex gap-2 ml-4">
                      <button 
                        onClick={() => handleBetClick(match, 'home')}
                        className={`px-4 py-3 min-w-[70px] rounded-lg transition-all text-sm font-bold ${
                          isBetSelected(`football-${match.id}`, 'home')
                            ? 'bg-[#00ff87] text-[#0a1a1f]'
                            : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                        }`}
                      >
                        <div className="text-xs opacity-70">1</div>
                        <div>{match.markets['1X2'].home}</div>
                      </button>
                      <button 
                        onClick={() => handleBetClick(match, 'draw')}
                        className={`px-4 py-3 min-w-[70px] rounded-lg transition-all text-sm font-bold ${
                          isBetSelected(`football-${match.id}`, 'draw')
                            ? 'bg-[#00ff87] text-[#0a1a1f]'
                            : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                        }`}
                      >
                        <div className="text-xs opacity-70">X</div>
                        <div>{match.markets['1X2'].draw}</div>
                      </button>
                      <button 
                        onClick={() => handleBetClick(match, 'away')}
                        className={`px-4 py-3 min-w-[70px] rounded-lg transition-all text-sm font-bold ${
                          isBetSelected(`football-${match.id}`, 'away')
                            ? 'bg-[#00ff87] text-[#0a1a1f]'
                            : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                        }`}
                      >
                        <div className="text-xs opacity-70">2</div>
                        <div>{match.markets['1X2'].away}</div>
                      </button>
                      
                      {/* Expandable Markets Button */}
                      <button
                        onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-[#00ff87] rounded-lg hover:bg-[#00ff87]/20 transition-all text-sm font-bold border border-[#00ff87]/30 ml-2"
                      >
                        <span>+157</span>
                        <svg 
                          className={`w-4 h-4 transition-transform ${expandedMatch === match.id ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  </div>
                </div>
                
                {/* Expanded Markets - Renders as separate card below */}
                {expandedMatch === match.id && (
                  <ExpandableBettingMarketsV2 
                    event={match} 
                    matchId={`football-${match.id}`}
                    isExpanded={true}
                    onToggle={() => setExpandedMatch(null)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {displayedMatches.length < allMatches.length && (
          <div className="mt-6 text-center">
            <button 
              onClick={loadMore}
              className="px-8 py-3 bg-gradient-to-r from-[#00ff87] to-[#00d68f] text-[#0a1a1f] font-bold rounded-xl hover:shadow-lg hover:shadow-[#00ff87]/30 transition-all duration-200 transform hover:scale-105"
            >
              Load More ({allMatches.length - displayedMatches.length} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}