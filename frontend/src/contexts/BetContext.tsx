'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Bet {
  id: string;
  matchId: string;
  selection: string;
  type: 'home' | 'draw' | 'away';
  odds: number;
  teams: string;
  sport?: string;
}

interface BetContextType {
  bets: Bet[];
  addBet: (bet: Bet) => void;
  removeBet: (id: string) => void;
  clearBets: () => void;
  isBetSelected: (matchId: string, type: 'home' | 'draw' | 'away') => boolean;
}

const BetContext = createContext<BetContextType | undefined>(undefined);

export function BetProvider({ children }: { children: ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([]);

  const addBet = (newBet: Bet) => {
    setBets(prevBets => {
      // Remove any existing bet for the same match
      const filteredBets = prevBets.filter(bet => bet.matchId !== newBet.matchId);
      // Add the new bet
      return [...filteredBets, newBet];
    });
  };

  const removeBet = (id: string) => {
    setBets(prevBets => prevBets.filter(bet => bet.id !== id));
  };

  const clearBets = () => {
    setBets([]);
  };

  const isBetSelected = (matchId: string, type: 'home' | 'draw' | 'away') => {
    return bets.some(bet => bet.matchId === matchId && bet.type === type);
  };

  return (
    <BetContext.Provider value={{ bets, addBet, removeBet, clearBets, isBetSelected }}>
      {children}
    </BetContext.Provider>
  );
}

export function useBets() {
  const context = useContext(BetContext);
  if (context === undefined) {
    throw new Error('useBets must be used within a BetProvider');
  }
  return context;
}