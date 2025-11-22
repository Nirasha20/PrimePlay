import api from './axios';

export interface Match {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'live' | 'completed' | 'upcoming';
  date: string;
  time: string;
  image?: string;
}

export interface MatchesResponse {
  data: Match[];
  page: number;
  totalPages: number;
  totalMatches: number;
}

export const sportsApi = {
  // Fetch matches with pagination
  getMatches: async (page: number = 1, limit: number = 10, sport?: string): Promise<MatchesResponse> => {
    try {
      const params: any = { page, limit };
      if (sport) params.sport = sport;
      
      const response = await api.get('/matches', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fetch single match details
  getMatchById: async (id: string): Promise<Match> => {
    try {
      const response = await api.get(`/matches/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fetch live matches
  getLiveMatches: async (): Promise<Match[]> => {
    try {
      const response = await api.get('/matches/live');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default sportsApi;
