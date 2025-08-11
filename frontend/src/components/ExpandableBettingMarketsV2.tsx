'use client';

import { useState } from 'react';
import { Event } from '@/services/oddsApi';
import { useBets } from '@/contexts/BetContext';

interface ExpandableBettingMarketsProps {
  event: Event;
  matchId: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ExpandableBettingMarketsV2({ event, matchId, isExpanded, onToggle }: ExpandableBettingMarketsProps) {
  const { addBet, isBetSelected } = useBets();

  // Count total available markets
  const countMarkets = () => {
    let count = 0;
    Object.keys(event.markets).forEach(marketKey => {
      const market = event.markets[marketKey];
      if (market) {
        // Count individual betting options in each market
        if (typeof market === 'object') {
          count += Object.keys(market).length;
        }
      }
    });
    return count;
  };

  const totalMarkets = countMarkets();

  const handleBetClick = (marketType: string, selection: string, odds: number, betName: string) => {
    addBet({
      id: `${matchId}-${marketType}-${selection}`,
      matchId: matchId,
      selection: betName,
      type: `${marketType}-${selection}`,
      odds,
      teams: event.sport === 'tennis' 
        ? `${event.player1} vs ${event.player2}`
        : `${event.homeTeam} vs ${event.awayTeam}`,
      sport: event.sport
    });
  };

  const renderMarketSection = (title: string, marketData: any, marketKey: string) => {
    if (!marketData) return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-bold text-[#00ff87] mb-3">{title}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {Object.entries(marketData).map(([key, value]) => {
            if (typeof value !== 'number') return null;
            
            let betName = key;
            // Format bet names
            if (marketKey === '1X2') {
              betName = key === 'home' ? event.homeTeam || '1' : 
                       key === 'away' ? event.awayTeam || '2' : 
                       'Draw';
            } else if (marketKey === 'matchWinner') {
              betName = key === 'player1' ? event.player1 || 'P1' : event.player2 || 'P2';
            } else if (marketKey === 'moneyline') {
              betName = key === 'home' ? event.homeTeam || 'Home' : event.awayTeam || 'Away';
            } else if (marketKey === 'btts') {
              betName = key === 'yes' ? 'Both Teams Score - Yes' : 'Both Teams Score - No';
            } else if (marketKey === 'doubleChance') {
              betName = key === 'homeOrDraw' ? '1X (Home/Draw)' : 
                       key === 'awayOrDraw' ? 'X2 (Draw/Away)' : 
                       '12 (Home/Away)';
            }

            const isSelected = isBetSelected(matchId, `${marketKey}-${key}`);

            return (
              <button
                key={key}
                onClick={() => handleBetClick(marketKey, key, value as number, betName)}
                className={`p-3 rounded-lg transition-all text-sm ${
                  isSelected
                    ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                    : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                }`}
              >
                <div className="text-xs opacity-70 mb-1">{betName}</div>
                <div className="font-bold">{value}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSpecialMarkets = () => {
    const specialMarkets = [];

    // Spread betting
    if (event.markets.spread) {
      specialMarkets.push(
        <div key="spread" className="mb-6">
          <h4 className="text-sm font-bold text-[#00ff87] mb-3">Point Spread</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBetClick('spread', 'home', event.markets.spread.home, 
                `${event.homeTeam} ${event.markets.spread.line > 0 ? '+' : ''}${event.markets.spread.line}`)}
              className={`p-3 rounded-lg transition-all text-sm ${
                isBetSelected(matchId, 'spread-home')
                  ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                  : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
              }`}
            >
              <div className="text-xs opacity-70">{event.homeTeam} {event.markets.spread.line > 0 ? '+' : ''}{event.markets.spread.line}</div>
              <div className="font-bold">{event.markets.spread.home}</div>
            </button>
            <button
              onClick={() => handleBetClick('spread', 'away', event.markets.spread.away, 
                `${event.awayTeam} ${-event.markets.spread.line > 0 ? '+' : ''}${-event.markets.spread.line}`)}
              className={`p-3 rounded-lg transition-all text-sm ${
                isBetSelected(matchId, 'spread-away')
                  ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                  : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
              }`}
            >
              <div className="text-xs opacity-70">{event.awayTeam} {-event.markets.spread.line > 0 ? '+' : ''}{-event.markets.spread.line}</div>
              <div className="font-bold">{event.markets.spread.away}</div>
            </button>
          </div>
        </div>
      );
    }

    // Total (Over/Under)
    if (event.markets.total) {
      specialMarkets.push(
        <div key="total" className="mb-6">
          <h4 className="text-sm font-bold text-[#00ff87] mb-3">Total Points O/U {event.markets.total.line}</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBetClick('total', 'over', event.markets.total.over, `Over ${event.markets.total.line}`)}
              className={`p-3 rounded-lg transition-all text-sm ${
                isBetSelected(matchId, 'total-over')
                  ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                  : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
              }`}
            >
              <div className="text-xs opacity-70">Over {event.markets.total.line}</div>
              <div className="font-bold">{event.markets.total.over}</div>
            </button>
            <button
              onClick={() => handleBetClick('total', 'under', event.markets.total.under, `Under ${event.markets.total.line}`)}
              className={`p-3 rounded-lg transition-all text-sm ${
                isBetSelected(matchId, 'total-under')
                  ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                  : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
              }`}
            >
              <div className="text-xs opacity-70">Under {event.markets.total.line}</div>
              <div className="font-bold">{event.markets.total.under}</div>
            </button>
          </div>
        </div>
      );
    }

    // Correct Score (Football)
    if (event.markets.correctScore) {
      specialMarkets.push(
        <div key="correctScore" className="mb-6">
          <h4 className="text-sm font-bold text-[#00ff87] mb-3">Correct Score</h4>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Object.entries(event.markets.correctScore).map(([score, odds]) => {
              const isSelected = isBetSelected(matchId, `correctScore-${score}`);
              return (
                <button
                  key={score}
                  onClick={() => handleBetClick('correctScore', score, odds as number, `Score: ${score}`)}
                  className={`p-3 rounded-lg transition-all text-sm ${
                    isSelected
                      ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                      : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                  }`}
                >
                  <div className="text-xs opacity-70">{score}</div>
                  <div className="font-bold">{odds}</div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return specialMarkets;
  };

  // Only render the expanded content when isExpanded is true
  if (!isExpanded) return null;

  return (
    <div className="animate-in slide-in-from-top duration-200">
      <div className="bg-gradient-to-br from-[#1f2937] to-[#111827] rounded-xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">All Betting Markets</h3>
              <button
                onClick={onToggle}
                className="text-[#a0a0b8] hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Main markets */}
            {event.markets['1X2'] && renderMarketSection('Match Result', event.markets['1X2'], '1X2')}
            {event.markets.matchWinner && renderMarketSection('Match Winner', event.markets.matchWinner, 'matchWinner')}
            {event.markets.moneyline && renderMarketSection('Moneyline', event.markets.moneyline, 'moneyline')}
            
            {/* Double Chance */}
            {event.markets.doubleChance && renderMarketSection('Double Chance', event.markets.doubleChance, 'doubleChance')}
            
            {/* Both Teams to Score */}
            {event.markets.btts && renderMarketSection('Both Teams to Score', event.markets.btts, 'btts')}
            
            {/* Special markets */}
            {renderSpecialMarkets()}

            {/* Half Time markets */}
            {event.markets.halfTime && renderMarketSection('Half Time Result', event.markets.halfTime, 'halfTime')}
            
            {/* First Scorer */}
            {event.markets.firstScorer && (
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#00ff87] mb-3">First Goal Scorer</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Object.entries(event.markets.firstScorer).map(([player, odds]) => {
                    const isSelected = isBetSelected(matchId, `firstScorer-${player}`);
                    return (
                      <button
                        key={player}
                        onClick={() => handleBetClick('firstScorer', player, odds as number, `First Scorer: ${player}`)}
                        className={`p-3 rounded-lg transition-all text-sm ${
                          isSelected
                            ? 'bg-[#00ff87] text-[#0a1a1f] font-bold'
                            : 'bg-[#1a1a2e] text-white hover:bg-[#00ff87]/20 hover:text-[#00ff87] border border-white/10'
                        }`}
                      >
                        <div className="text-xs opacity-70">{player}</div>
                        <div className="font-bold">{odds}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
  );
}

export function ExpandButton({ totalMarkets, onClick }: { totalMarkets: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-[#00ff87] rounded-lg hover:bg-[#00ff87]/20 transition-all text-sm font-bold border border-[#00ff87]/30"
    >
      <span>+{totalMarkets}</span>
      <svg 
        className="w-4 h-4"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}