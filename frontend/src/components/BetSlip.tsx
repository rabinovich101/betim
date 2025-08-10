'use client';

import { useState } from 'react';
import { useBets } from '@/contexts/BetContext';

export default function BetSlip() {
  const { bets, removeBet, clearBets } = useBets();
  const [stake, setStake] = useState<string>('10');
  const [isPlaceBetInGame, setIsPlaceBetInGame] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const totalOdds = bets.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialPayout = parseFloat(stake || '0') * totalOdds;

  const clearAll = () => {
    clearBets();
    setStake('10');
  };

  if (!isVisible) return null;

  return (
    <div className={`
      fixed right-0 top-16 h-[calc(100vh-4rem)] w-80
      bg-gradient-to-b from-[#1a1a2e] to-[#16162a]
      border-l border-white/5
      transition-all duration-300 ease-out z-20
      ${isMinimized ? 'translate-x-[280px]' : 'translate-x-0'}
      shadow-2xl
      hidden xl:block
    `}>
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">BET SLIP</h2>
          <div className="flex items-center gap-2">
            {bets.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-[#a0a0b8] hover:text-white transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-[#a0a0b8] hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={isMinimized ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bets List */}
      <div className="flex-1 overflow-y-auto">
        {bets.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-[#a0a0b8]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-[#a0a0b8] text-sm">No bets selected</p>
            <p className="text-[#6a6a7e] text-xs mt-2">Click on odds to add selections</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {bets.map((bet) => (
              <div 
                key={bet.id}
                className="bg-[#232438] rounded-lg p-3 border border-white/5 hover:border-white/10 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{bet.selection}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#00ff87] font-bold">{bet.odds.toFixed(2)}</span>
                      <button
                        onClick={() => removeBet(bet.id)}
                        className="text-[#a0a0b8] hover:text-[#ff4757] transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-[#a0a0b8]">{bet.teams}</div>
                </div>
              </div>
            ))}

            {/* Stake Input */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-[#a0a0b8] text-sm">Stake</label>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0b8]">$</span>
                  <input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    className="w-full bg-[#232438] border border-white/10 rounded-lg px-8 py-2 text-white text-right focus:outline-none focus:border-[#00ff87] transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Quick stake buttons */}
              <div className="flex gap-2">
                {['10', '25', '50', '100'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setStake(amount)}
                    className="flex-1 py-1.5 bg-[#232438] border border-white/10 rounded text-[#a0a0b8] hover:border-[#00ff87] hover:text-[#00ff87] transition-all text-sm"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Place bet in game toggle */}
            <div className="flex items-center gap-2 py-3">
              <span className="text-[#a0a0b8] text-sm flex-1">Place bet and be in the game</span>
              <button
                onClick={() => setIsPlaceBetInGame(!isPlaceBetInGame)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isPlaceBetInGame ? 'bg-[#00ff87]' : 'bg-[#232438] border border-white/10'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isPlaceBetInGame ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer with totals and place bet */}
      {bets.length > 0 && (
        <div className="border-t border-white/5 p-4 bg-gradient-to-t from-[#16162a] to-transparent">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#a0a0b8]">Total odds</span>
              <span className="text-white font-bold">{totalOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a0a0b8] text-sm">Potential payout</span>
              <span className="text-[#00ff87] font-bold text-lg">${potentialPayout.toFixed(2)}</span>
            </div>
          </div>
          
          <button className="w-full py-3 bg-gradient-to-r from-[#00ff87] to-[#00d68f] text-[#0a1a1f] font-bold rounded-lg hover:shadow-lg hover:shadow-[#00ff87]/30 transition-all duration-200 transform hover:scale-[1.02]">
            PLACE BET
          </button>
        </div>
      )}

      {/* Minimized tab */}
      {isMinimized && (
        <div 
          onClick={() => setIsMinimized(false)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-gradient-to-r from-[#00ff87] to-[#00d68f] text-[#0a1a1f] px-2 py-4 rounded-l-lg cursor-pointer hover:px-3 transition-all"
        >
          <div className="flex flex-col items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs font-bold writing-mode-vertical">SLIP</span>
            {bets.length > 0 && (
              <div className="w-5 h-5 bg-[#ff4757] text-white rounded-full flex items-center justify-center text-xs font-bold">
                {bets.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}