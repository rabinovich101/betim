// Odds API Service
const API_URL = 'http://localhost:3333';

export interface Event {
  id: number;
  sport: string;
  league?: string;
  tournament?: string;
  homeTeam?: string;
  awayTeam?: string;
  player1?: string;
  player2?: string;
  startTime: string;
  isLive: boolean;
  minute?: number;
  currentSet?: number;
  quarter?: number;
  homeScore?: number;
  awayScore?: number;
  player1Sets?: number;
  player2Sets?: number;
  player1Games?: number;
  player2Games?: number;
  markets: {
    '1X2'?: {
      home: number;
      draw: number;
      away: number;
    };
    'matchWinner'?: {
      player1: number;
      player2: number;
    };
    'moneyline'?: {
      home: number;
      away: number;
    };
    'overUnder'?: any;
    'spread'?: any;
    'totalPoints'?: any;
    [key: string]: any;
  };
}

export interface Sport {
  id: number;
  name: string;
  slug: string;
  eventCount: number;
  icon: string;
}

class OddsApiService {
  // Get all events
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Get events by sport
  async getEventsBySport(sport: string): Promise<Event[]> {
    try {
      const response = await fetch(`${API_URL}/events?sport=${sport}`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Get live events
  async getLiveEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_URL}/live`);
      if (!response.ok) throw new Error('Failed to fetch live events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching live events:', error);
      return [];
    }
  }

  // Get upcoming events
  async getUpcomingEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_URL}/upcoming`);
      if (!response.ok) throw new Error('Failed to fetch upcoming events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  // Get featured events
  async getFeaturedEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_URL}/featured`);
      if (!response.ok) throw new Error('Failed to fetch featured events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured events:', error);
      return [];
    }
  }

  // Get single event
  async getEventById(id: number): Promise<Event | null> {
    try {
      const response = await fetch(`${API_URL}/events/${id}`);
      if (!response.ok) throw new Error('Failed to fetch event');
      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  // Get sports list
  async getSports(): Promise<Sport[]> {
    try {
      const response = await fetch(`${API_URL}/sports`);
      if (!response.ok) throw new Error('Failed to fetch sports');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sports:', error);
      return [];
    }
  }

  // Get events with pagination
  async getEventsPaginated(page: number = 1, limit: number = 10): Promise<Event[]> {
    try {
      const response = await fetch(`${API_URL}/events?_page=${page}&_limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Search events
  async searchEvents(query: string): Promise<Event[]> {
    try {
      const response = await fetch(`${API_URL}/events?q=${query}`);
      if (!response.ok) throw new Error('Failed to search events');
      return await response.json();
    } catch (error) {
      console.error('Error searching events:', error);
      return [];
    }
  }
}

export const oddsApi = new OddsApiService();