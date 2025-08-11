import { Event } from '@/services/oddsApi';

export function countBettingMarkets(event: Event): number {
  let count = 0;
  
  if (!event.markets) return 0;
  
  Object.keys(event.markets).forEach(marketKey => {
    const market = event.markets[marketKey];
    if (market && typeof market === 'object') {
      // Special handling for certain market types
      if (marketKey === 'spread' || marketKey === 'total') {
        // These have specific properties like home/away or over/under
        count += 2; // Usually 2 options
      } else if (marketKey === 'correctScore' || marketKey === 'firstScorer') {
        // These are objects with multiple score/player options
        count += Object.keys(market).length;
      } else {
        // Generic counting for other market types
        count += Object.keys(market).length;
      }
    }
  });
  
  // Subtract the main betting options that are already displayed
  // (1X2 for football, matchWinner for tennis, moneyline for basketball)
  if (event.sport === 'football' && event.markets['1X2']) {
    count -= 3; // Remove home, draw, away as they're shown in main card
  } else if (event.sport === 'tennis' && event.markets['matchWinner']) {
    count -= 2; // Remove player1, player2 as they're shown in main card
  } else if (event.sport === 'basketball' && event.markets['moneyline']) {
    count -= 2; // Remove home, away as they're shown in main card
  }
  
  // Ensure we don't return negative numbers
  return Math.max(0, count);
}