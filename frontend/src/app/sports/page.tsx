'use client';

import { useState, useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { oddsApi, Event } from '@/services/oddsApi';
import { useBets } from '@/contexts/BetContext';
import Link from 'next/link';

export default function SportsPage() {
  const [allMatches, setAllMatches] = useState<Event[]>([]);
  const [displayedMatches, setDisplayedMatches] = useState<Event[]>([]);
  const [sportsCounts, setSportsCounts] = useState({
    football: 0,
    basketball: 0,
    tennis: 0
  });
  const { startLoading, stopLoading } = useLoading();
  const { addBet, isBetSelected } = useBets();
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      startLoading();
      
      try {
        // Fetch all events
        const allEvents = await oddsApi.getAllEvents();
        
        // Sort by start time (newest/upcoming first)
        const sortedEvents = allEvents.sort((a, b) => {
          const timeA = new Date(a.startTime).getTime();
          const timeB = new Date(b.startTime).getTime();
          
          // If both are live, sort by minute/quarter/set
          if (a.isLive && b.isLive) {
            if (a.sport === 'football' && b.sport === 'football') {
              return (b.minute || 0) - (a.minute || 0);
            }
            return 0;
          }
          
          // Live games first
          if (a.isLive) return -1;
          if (b.isLive) return 1;
          
          // Then upcoming games sorted by start time (soonest first)
          return timeA - timeB;
        });
        
        setAllMatches(sortedEvents);
        setDisplayedMatches(sortedEvents.slice(0, 20)); // Use initial display count
        
        // Count events by sport
        const counts = {
          football: allEvents.filter(e => e.sport === 'football').length,
          basketball: allEvents.filter(e => e.sport === 'basketball').length,
          tennis: allEvents.filter(e => e.sport === 'tennis').length
        };
        setSportsCounts(counts);
      } catch (error) {
        console.error('Error fetching sports data:', error);
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    };

    fetchData();
  }, []); // Remove dependencies to only fetch once on mount

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

  const handleBetClick = (event: Event, betType: 'home' | 'draw' | 'away' | '1' | '2') => {
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
        id: `sport-${event.id}-${type}`,
        matchId: `sport-${event.id}`,
        selection,
        type,
        odds,
        teams,
        sport: event.sport
      });
    }
  };

  const getSportIcon = (sport: string) => {
    switch(sport) {
      case 'football': return '⚽';
      case 'basketball': return '🏀';
      case 'tennis': return '🎾';
      default: return '🏆';
    }
  };

  // Remove loading spinner, show content immediately or empty state
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
        <h1 className="text-4xl font-bold text-white mb-2">All Sports Events</h1>
        <p className="text-[#a0a0b8]">All matches sorted by time • Live matches shown first</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1f2937]/50 to-[#111827]/50 rounded-lg p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔴</span>
              <div>
                <p className="text-[#a0a0b8] text-xs">Live Now</p>
                <p className="text-white font-bold text-lg">{allMatches.filter(m => m.isLive).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1f2937]/50 to-[#111827]/50 rounded-lg p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-[#a0a0b8] text-xs">Today\'s Games</p>
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
        </div>

        <div className="bg-gradient-to-br from-[#1f2937]/50 to-[#111827]/50 rounded-lg p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="text-[#a0a0b8] text-xs">Total Events</p>
                <p className="text-white font-bold text-lg">{allMatches.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Matches */}
      <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">All Events</h2>
          <div className="flex gap-2">
            <span className="text-sm text-[#a0a0b8]">
              Showing {displayedMatches.length} of {allMatches.length}
            </span>
          </div>
        </div>
        
        {displayedMatches.length === 0 ? (
          <p className="text-center text-[#a0a0b8] py-8">No matches available at the moment</p>
        ) : (
          <div className="space-y-3">
            {displayedMatches.map((match) => (
              <div key={match.id} className="bg-[#0f0f23]/50 rounded-lg p-4 border border-white/5 hover:border-[#00ff87]/30 transition-all">
                <div className="flex items-center justify-between">
                  {/* Sport & Match Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">{getSportIcon(match.sport)}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-[#00ff87]/20 text-[#00ff87] px-2 py-0.5 rounded font-medium capitalize">
                          {match.sport}
                        </span>
                        <span className="text-xs text-[#a0a0b8]">
                          {match.league || match.tournament || 'League'}
                        </span>
                        {match.isLive ? (
                          <span className="text-xs bg-[#ff4757]/20 text-[#ff4757] px-2 py-0.5 rounded font-bold animate-pulse">
                            LIVE {match.minute && `${match.minute}'`}
                            {match.quarter && `Q${match.quarter}`}
                            {match.currentSet && `Set ${match.currentSet}`}
                          </span>
                        ) : (
                          <span className="text-xs text-white/60">{formatTime(match.startTime)}</span>
                        )}
                      </div>
                      
                      <div className="text-white font-medium">
                        {match.sport === 'tennis' ? (
                          <span>{match.player1} vs {match.player2}</span>
                        ) : (
                          <span>{match.homeTeam} vs {match.awayTeam}</span>
                        )}
                      </div>
                      
                      {match.isLive && (
                        <div className="text-[#00ff87] text-sm mt-1 font-bold">
                          {match.sport === 'tennis' && match.player1Sets !== undefined && match.player2Sets !== undefined ? (
                            <span>Sets: {match.player1Sets} - {match.player2Sets} | Games: {match.player1Games} - {match.player2Games}</span>
                          ) : match.homeScore !== undefined && match.awayScore !== undefined ? (
                            <span>Score: {match.homeScore} - {match.awayScore}</span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Odds Buttons */}
                  <div className="flex gap-2">
                    {match.sport === 'tennis' && match.markets.matchWinner ? (
                      <>
                        <button 
                          onClick={() => handleBetClick(match, '1')}
                          className={`px-4 py-2 min-w-[70px] rounded-lg transition-all text-sm font-bold ${
                            isBetSelected(`sport-${match.id}`, '1')
                              ? 'bg-[#00ff87] text-[#0a1a1f]'
                              : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                          }`}
                        >
                          {match.markets.matchWinner.player1}
                        </button>
                        <button 
                          onClick={() => handleBetClick(match, '2')}
                          className={`px-4 py-2 min-w-[70px] rounded-lg transition-all text-sm font-bold ${
                            isBetSelected(`sport-${match.id}`, '2')
                              ? 'bg-[#00ff87] text-[#0a1a1f]'
                              : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                          }`}
                        >
                          {match.markets.matchWinner.player2}
                        </button>
                      </>
                    ) : match.sport === 'basketball' && match.markets.moneyline ? (
                      <>
                        <button 
                          onClick={() => handleBetClick(match, '1')}
                          className={`px-4 py-2 min-w-[70px] rounded-lg transition-all text-sm font-bold ${
                            isBetSelected(`sport-${match.id}`, '1')
                              ? 'bg-[#00ff87] text-[#0a1a1f]'
                              : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                          }`}
                        >
                          {match.markets.moneyline.home}
                        </button>
                        <button 
                          onClick={() => handleBetClick(match, '2')}
                          className={`px-4 py-2 min-w-[70px] rounded-lg transition-all text-sm font-bold ${
                            isBetSelected(`sport-${match.id}`, '2')
                              ? 'bg-[#00ff87] text-[#0a1a1f]'
                              : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                          }`}
                        >
                          {match.markets.moneyline.away}
                        </button>
                      </>
                    ) : match.sport === 'football' && match.markets['1X2'] ? (
                      <>
                        <button 
                          onClick={() => handleBetClick(match, 'home')}
                          className={`px-4 py-2 min-w-[60px] rounded-lg transition-all text-sm font-bold ${
                            isBetSelected(`sport-${match.id}`, 'home')
                              ? 'bg-[#00ff87] text-[#0a1a1f]'
                              : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                          }`}
                        >
                          {match.markets['1X2'].home}
                        </button>
                        <button 
                          onClick={() => handleBetClick(match, 'draw')}
                          className={`px-4 py-2 min-w-[60px] rounded-lg transition-all text-sm font-bold ${
                            isBetSelected(`sport-${match.id}`, 'draw')
                              ? 'bg-[#00ff87] text-[#0a1a1f]'
                              : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                          }`}
                        >
                          {match.markets['1X2'].draw}
                        </button>
                        <button 
                          onClick={() => handleBetClick(match, 'away')}
                          className={`px-4 py-2 min-w-[60px] rounded-lg transition-all text-sm font-bold ${
                            isBetSelected(`sport-${match.id}`, 'away')
                              ? 'bg-[#00ff87] text-[#0a1a1f]'
                              : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                          }`}
                        >
                          {match.markets['1X2'].away}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
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