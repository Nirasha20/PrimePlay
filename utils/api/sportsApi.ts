import axios from 'axios';

// TheSportsDB API Configuration
const SPORTS_DB_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// Using dummy data instead of real API calls
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

// Transform TheSportsDB event to our Match format
const transformEventToMatch = (event: any): Match => {
  const homeScore = event.intHomeScore ? parseInt(event.intHomeScore) : undefined;
  const awayScore = event.intAwayScore ? parseInt(event.intAwayScore) : undefined;
  
  let status: 'live' | 'completed' | 'upcoming' = 'upcoming';
  if (event.strStatus === 'Match Finished' || event.strStatus === 'FT') {
    status = 'completed';
  } else if (event.strStatus === 'In Play' || event.strStatus === 'Live') {
    status = 'live';
  }

  return {
    id: event.idEvent,
    sport: event.strSport || 'Football',
    homeTeam: event.strHomeTeam,
    awayTeam: event.strAwayTeam,
    homeScore,
    awayScore,
    status,
    date: event.dateEvent,
    time: event.strTime || event.strTimeLocal || 'TBD',
    image: event.strThumb || event.strSquare || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  };
};

// Fetch live/recent events from TheSportsDB
export const fetchLiveEvents = async (sport?: string): Promise<Match[]> => {
  try {
    const response = await axios.get(`${SPORTS_DB_BASE_URL}/eventsseason.php`, {
      params: {
        id: 4328, // English Premier League
        s: '2024-2025'
      }
    });

    if (response.data && response.data.events) {
      return response.data.events
        .slice(0, 15) // Get latest 15 matches
        .map(transformEventToMatch);
    }
    return [];
  } catch (error) {
    console.error('Error fetching live events:', error);
    return getFallbackMatches();
  }
};

// Fetch events from multiple leagues
export const fetchMultipleLeagueEvents = async (): Promise<Match[]> => {
  try {
    const leagues = [
      { id: 4328, name: 'English Premier League' },
      { id: 4335, name: 'Spanish La Liga' },
      { id: 4331, name: 'German Bundesliga' },
      { id: 4332, name: 'Italian Serie A' },
    ];

    const requests = leagues.map(league =>
      axios.get(`${SPORTS_DB_BASE_URL}/eventsseason.php`, {
        params: {
          id: league.id,
          s: '2024-2025'
        }
      }).catch(err => ({ data: { events: [] } }))
    );

    const responses = await Promise.all(requests);
    
    const allEvents: Match[] = [];
    responses.forEach(response => {
      if (response.data && response.data.events) {
        const events = response.data.events
          .slice(0, 5) // Take 5 matches from each league
          .map(transformEventToMatch);
        allEvents.push(...events);
      }
    });

    return allEvents.length > 0 ? allEvents : getFallbackMatches();
  } catch (error) {
    console.error('Error fetching multiple league events:', error);
    return getFallbackMatches();
  }
};

// Fallback dummy matches if API fails
const getFallbackMatches = (): Match[] => {
  return DUMMY_MATCHES;
};

// Dummy match data
const DUMMY_MATCHES: Match[] = [
  // Football matches
  {
    id: '1',
    sport: 'Football',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeScore: 2,
    awayScore: 1,
    status: 'live',
    date: '2025-11-22',
    time: '15:00',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  },
  {
    id: '2',
    sport: 'Football',
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    homeScore: 3,
    awayScore: 2,
    status: 'completed',
    date: '2025-11-21',
    time: '20:00',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
  },
  {
    id: '3',
    sport: 'Football',
    homeTeam: 'Chelsea',
    awayTeam: 'Arsenal',
    status: 'upcoming',
    date: '2025-11-23',
    time: '17:30',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
  },
  {
    id: '4',
    sport: 'Football',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeScore: 1,
    awayScore: 1,
    status: 'live',
    date: '2025-11-22',
    time: '18:30',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
  },
  // Basketball matches
  {
    id: '5',
    sport: 'Basketball',
    homeTeam: 'LA Lakers',
    awayTeam: 'Golden State Warriors',
    homeScore: 112,
    awayScore: 108,
    status: 'completed',
    date: '2025-11-21',
    time: '22:00',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  },
  {
    id: '6',
    sport: 'Basketball',
    homeTeam: 'Boston Celtics',
    awayTeam: 'Miami Heat',
    homeScore: 95,
    awayScore: 92,
    status: 'live',
    date: '2025-11-22',
    time: '19:00',
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800',
  },
  {
    id: '7',
    sport: 'Basketball',
    homeTeam: 'Chicago Bulls',
    awayTeam: 'Brooklyn Nets',
    status: 'upcoming',
    date: '2025-11-23',
    time: '20:00',
    image: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800',
  },
  // Cricket matches
  {
    id: '8',
    sport: 'Cricket',
    homeTeam: 'India',
    awayTeam: 'Australia',
    homeScore: 287,
    awayScore: 245,
    status: 'completed',
    date: '2025-11-20',
    time: '09:30',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
  },
  {
    id: '9',
    sport: 'Cricket',
    homeTeam: 'England',
    awayTeam: 'Pakistan',
    homeScore: 156,
    awayScore: 142,
    status: 'live',
    date: '2025-11-22',
    time: '14:00',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
  },
  {
    id: '10',
    sport: 'Cricket',
    homeTeam: 'South Africa',
    awayTeam: 'New Zealand',
    status: 'upcoming',
    date: '2025-11-24',
    time: '10:00',
    image: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800',
  },
  // Tennis matches
  {
    id: '11',
    sport: 'Tennis',
    homeTeam: 'Rafael Nadal',
    awayTeam: 'Novak Djokovic',
    homeScore: 2,
    awayScore: 1,
    status: 'live',
    date: '2025-11-22',
    time: '16:00',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800',
  },
  {
    id: '12',
    sport: 'Tennis',
    homeTeam: 'Roger Federer',
    awayTeam: 'Andy Murray',
    homeScore: 3,
    awayScore: 1,
    status: 'completed',
    date: '2025-11-21',
    time: '13:00',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
  },
  {
    id: '13',
    sport: 'Tennis',
    homeTeam: 'Serena Williams',
    awayTeam: 'Naomi Osaka',
    status: 'upcoming',
    date: '2025-11-23',
    time: '15:00',
    image: 'https://images.unsplash.com/photo-1595435742656-5272d0e3dce5?w=800',
  },
  // Baseball matches
  {
    id: '14',
    sport: 'Baseball',
    homeTeam: 'New York Yankees',
    awayTeam: 'Boston Red Sox',
    homeScore: 5,
    awayScore: 3,
    status: 'completed',
    date: '2025-11-21',
    time: '19:00',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800',
  },
  {
    id: '15',
    sport: 'Baseball',
    homeTeam: 'LA Dodgers',
    awayTeam: 'San Francisco Giants',
    homeScore: 2,
    awayScore: 2,
    status: 'live',
    date: '2025-11-22',
    time: '21:00',
    image: 'https://images.unsplash.com/photo-1511149672551-52ed2c9f1e5e?w=800',
  },
  {
    id: '16',
    sport: 'Baseball',
    homeTeam: 'Houston Astros',
    awayTeam: 'Texas Rangers',
    status: 'upcoming',
    date: '2025-11-23',
    time: '19:30',
    image: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=800',
  },
  // Rugby matches
  {
    id: '17',
    sport: 'Rugby',
    homeTeam: 'All Blacks',
    awayTeam: 'Springboks',
    homeScore: 21,
    awayScore: 18,
    status: 'completed',
    date: '2025-11-20',
    time: '14:00',
    image: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=800',
  },
  {
    id: '18',
    sport: 'Rugby',
    homeTeam: 'England',
    awayTeam: 'Ireland',
    homeScore: 14,
    awayScore: 10,
    status: 'live',
    date: '2025-11-22',
    time: '15:30',
    image: 'https://images.unsplash.com/photo-1513021514518-eb7e8fc0f448?w=800',
  },
  {
    id: '19',
    sport: 'Rugby',
    homeTeam: 'Australia',
    awayTeam: 'Wales',
    status: 'upcoming',
    date: '2025-11-24',
    time: '13:00',
    image: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=800',
  },
  // Hockey matches
  {
    id: '20',
    sport: 'Hockey',
    homeTeam: 'Toronto Maple Leafs',
    awayTeam: 'Montreal Canadiens',
    homeScore: 4,
    awayScore: 2,
    status: 'completed',
    date: '2025-11-21',
    time: '19:00',
    image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
  },
  {
    id: '21',
    sport: 'Hockey',
    homeTeam: 'Boston Bruins',
    awayTeam: 'New York Rangers',
    homeScore: 3,
    awayScore: 3,
    status: 'live',
    date: '2025-11-22',
    time: '20:00',
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800',
  },
  {
    id: '22',
    sport: 'Hockey',
    homeTeam: 'Chicago Blackhawks',
    awayTeam: 'Detroit Red Wings',
    status: 'upcoming',
    date: '2025-11-23',
    time: '19:00',
    image: 'https://images.unsplash.com/photo-1611398751050-7e1e5e28f9ec?w=800',
  },
  // Volleyball matches
  {
    id: '23',
    sport: 'Volleyball',
    homeTeam: 'Brazil',
    awayTeam: 'Italy',
    homeScore: 3,
    awayScore: 2,
    status: 'completed',
    date: '2025-11-21',
    time: '17:00',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
  },
  {
    id: '24',
    sport: 'Volleyball',
    homeTeam: 'USA',
    awayTeam: 'Russia',
    homeScore: 2,
    awayScore: 1,
    status: 'live',
    date: '2025-11-22',
    time: '18:00',
    image: 'https://images.unsplash.com/photo-1593786481809-fc42e04651c3?w=800',
  },
  {
    id: '25',
    sport: 'Volleyball',
    homeTeam: 'Poland',
    awayTeam: 'Japan',
    status: 'upcoming',
    date: '2025-11-23',
    time: '16:00',
    image: 'https://images.unsplash.com/photo-1612534847738-b4a5f44cd83c?w=800',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sportsApi = {
  // Fetch matches with pagination - NOW USES REAL API
  getMatches: async (page: number = 1, limit: number = 10, sport?: string): Promise<MatchesResponse> => {
    try {
      // Fetch from real TheSportsDB API
      const matches = await fetchMultipleLeagueEvents();
      
      let filteredMatches = [...matches];
      
      // Filter by sport if provided
      if (sport && sport !== 'All' && sport !== 'all') {
        filteredMatches = filteredMatches.filter(match => 
          match.sport.toLowerCase() === sport.toLowerCase()
        );
      }

      // Sort by date (most recent first)
      filteredMatches.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      const totalMatches = filteredMatches.length;
      const totalPages = Math.ceil(totalMatches / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMatches = filteredMatches.slice(startIndex, endIndex);

      return {
        data: paginatedMatches,
        page,
        totalPages,
        totalMatches,
      };
    } catch (error) {
      console.error('Error in getMatches:', error);
      // Fallback to dummy data if API fails
      return getMatchesFallback(page, limit, sport);
    }
  },

  // Fetch single match details
  getMatchById: async (id: string): Promise<Match> => {
    await delay(600); // Simulate network delay

    const match = DUMMY_MATCHES.find(m => m.id === id);
    
    if (!match) {
      throw new Error('Match not found');
    }

    return match;
  },

  // Fetch live matches
  getLiveMatches: async (): Promise<Match[]> => {
    try {
      const matches = await fetchMultipleLeagueEvents();
      return matches.filter(match => match.status === 'live');
    } catch (error) {
      console.error('Error fetching live matches:', error);
      return DUMMY_MATCHES.filter(match => match.status === 'live');
    }
  },

  // Search matches by query
  searchMatches: async (query: string): Promise<Match[]> => {
    await delay(400); // Simulate network delay

    const lowercaseQuery = query.toLowerCase();
    return DUMMY_MATCHES.filter(match =>
      match.homeTeam.toLowerCase().includes(lowercaseQuery) ||
      match.awayTeam.toLowerCase().includes(lowercaseQuery) ||
      match.sport.toLowerCase().includes(lowercaseQuery)
    );
  },
};

// Fallback function when API fails
const getMatchesFallback = async (page: number = 1, limit: number = 10, sport?: string): Promise<MatchesResponse> => {
  await delay(800);

  let filteredMatches = [...DUMMY_MATCHES];
  
  if (sport && sport !== 'All') {
    filteredMatches = filteredMatches.filter(match => 
      match.sport.toLowerCase() === sport.toLowerCase()
    );
  }

  const totalMatches = filteredMatches.length;
  const totalPages = Math.ceil(totalMatches / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMatches = filteredMatches.slice(startIndex, endIndex);

  return {
    data: paginatedMatches,
    page,
    totalPages,
    totalMatches,
  };
};

export default sportsApi;
