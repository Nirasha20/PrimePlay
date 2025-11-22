import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  image?: string;
  rating: number;
  age: number;
  nationality: string;
  jerseyNumber: number;
  bio?: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
  achievements?: string[];
  recentMatches?: {
    id: string;
    opponent: string;
    date: string;
    result: string;
    performance: string;
  }[];
}

export interface PlayersResponse {
  data: Player[];
  page: number;
  totalPages: number;
  totalPlayers: number;
}

interface PlayersState {
  list: Player[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  hasMore: boolean;
  refreshing: boolean;
  searchQuery: string;
  filterPosition: string;
  filterTeam: string;
  currentPlayer: Player | null;
  detailsLoading: boolean;
  detailsError: string | null;
}

const initialState: PlayersState = {
  list: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  hasMore: true,
  refreshing: false,
  searchQuery: '',
  filterPosition: 'all',
  filterTeam: 'all',
  currentPlayer: null,
  detailsLoading: false,
  detailsError: null,
};

// Dummy players data
const DUMMY_PLAYERS: Player[] = [
  {
    id: '1',
    name: 'Cristiano Ronaldo',
    position: 'Forward',
    team: 'Al Nassr',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
    rating: 9.2,
    age: 38,
    nationality: 'Portugal',
    jerseyNumber: 7,
    bio: 'One of the greatest footballers of all time with numerous records and achievements.',
    stats: {
      appearances: 850,
      goals: 701,
      assists: 221,
      yellowCards: 120,
      redCards: 11,
    },
    achievements: ['5x Ballon d\'Or', '5x UEFA Champions League', 'Euro 2016 Winner'],
    recentMatches: [
      { id: '1', opponent: 'Al Hilal', date: '2025-11-20', result: 'W 2-1', performance: '1 Goal' },
      { id: '2', opponent: 'Al Ittihad', date: '2025-11-17', result: 'D 1-1', performance: '1 Assist' },
    ],
  },
  {
    id: '2',
    name: 'Lionel Messi',
    position: 'Forward',
    team: 'Inter Miami',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    rating: 9.5,
    age: 36,
    nationality: 'Argentina',
    jerseyNumber: 10,
    bio: 'Record 8-time Ballon d\'Or winner and World Cup champion with Argentina.',
    stats: {
      appearances: 900,
      goals: 815,
      assists: 361,
      yellowCards: 95,
      redCards: 3,
    },
    achievements: ['8x Ballon d\'Or', '4x UEFA Champions League', 'World Cup 2022 Winner'],
    recentMatches: [
      { id: '3', opponent: 'Orlando City', date: '2025-11-19', result: 'W 3-0', performance: '2 Goals, 1 Assist' },
      { id: '4', opponent: 'Atlanta United', date: '2025-11-15', result: 'W 2-1', performance: '1 Goal' },
    ],
  },
  {
    id: '3',
    name: 'Kylian Mbappé',
    position: 'Forward',
    team: 'Real Madrid',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400',
    rating: 9.0,
    age: 25,
    nationality: 'France',
    jerseyNumber: 9,
    bio: 'Young superstar and World Cup winner known for incredible speed and finishing.',
    stats: {
      appearances: 350,
      goals: 280,
      assists: 125,
      yellowCards: 30,
      redCards: 2,
    },
    achievements: ['World Cup 2018 Winner', 'Ligue 1 Top Scorer x5', 'Golden Boot 2022'],
    recentMatches: [
      { id: '5', opponent: 'Barcelona', date: '2025-11-21', result: 'W 3-2', performance: '1 Goal' },
      { id: '6', opponent: 'Atletico Madrid', date: '2025-11-18', result: 'W 2-0', performance: '1 Goal, 1 Assist' },
    ],
  },
  {
    id: '4',
    name: 'Erling Haaland',
    position: 'Forward',
    team: 'Manchester City',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
    rating: 8.9,
    age: 24,
    nationality: 'Norway',
    jerseyNumber: 9,
    bio: 'Prolific goal scorer breaking records with exceptional finishing and physical presence.',
    stats: {
      appearances: 280,
      goals: 250,
      assists: 45,
      yellowCards: 15,
      redCards: 0,
    },
    achievements: ['Premier League Golden Boot', 'Champions League Top Scorer', 'Treble Winner 2023'],
  },
  {
    id: '5',
    name: 'Kevin De Bruyne',
    position: 'Midfielder',
    team: 'Manchester City',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
    rating: 8.8,
    age: 32,
    nationality: 'Belgium',
    jerseyNumber: 17,
    bio: 'World-class midfielder known for exceptional passing, vision, and creativity.',
    stats: {
      appearances: 450,
      goals: 95,
      assists: 180,
      yellowCards: 45,
      redCards: 2,
    },
    achievements: ['2x Premier League Player of the Season', 'Treble Winner 2023'],
  },
  {
    id: '6',
    name: 'Virgil van Dijk',
    position: 'Defender',
    team: 'Liverpool',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    rating: 8.7,
    age: 32,
    nationality: 'Netherlands',
    jerseyNumber: 4,
    bio: 'Elite defender known for his leadership, aerial ability, and composure.',
    stats: {
      appearances: 400,
      goals: 25,
      assists: 15,
      yellowCards: 35,
      redCards: 1,
    },
    achievements: ['Champions League Winner 2019', 'Premier League Winner', 'PFA Player of the Year'],
  },
  {
    id: '7',
    name: 'Alisson Becker',
    position: 'Goalkeeper',
    team: 'Liverpool',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400',
    rating: 8.6,
    age: 31,
    nationality: 'Brazil',
    jerseyNumber: 1,
    bio: 'World-class goalkeeper known for excellent shot-stopping and distribution.',
    stats: {
      appearances: 350,
      goals: 0,
      assists: 2,
      yellowCards: 8,
      redCards: 0,
    },
    achievements: ['Champions League Winner 2019', 'Golden Glove x2', 'Copa America Winner'],
  },
  {
    id: '8',
    name: 'Luka Modrić',
    position: 'Midfielder',
    team: 'Real Madrid',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400',
    rating: 8.5,
    age: 38,
    nationality: 'Croatia',
    jerseyNumber: 10,
    bio: 'Legendary midfielder and 2018 Ballon d\'Or winner known for his technical skills.',
    stats: {
      appearances: 650,
      goals: 75,
      assists: 140,
      yellowCards: 110,
      redCards: 3,
    },
    achievements: ['Ballon d\'Or 2018', '5x Champions League Winner', 'World Cup Runner-up 2018'],
  },
  {
    id: '9',
    name: 'Mohamed Salah',
    position: 'Forward',
    team: 'Liverpool',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
    rating: 8.8,
    age: 31,
    nationality: 'Egypt',
    jerseyNumber: 11,
    bio: 'Explosive winger and prolific scorer, one of the Premier League\'s best.',
    stats: {
      appearances: 500,
      goals: 230,
      assists: 110,
      yellowCards: 25,
      redCards: 0,
    },
    achievements: ['Premier League Golden Boot x3', 'Champions League Winner 2019', 'PFA Player of the Year'],
  },
  {
    id: '10',
    name: 'Robert Lewandowski',
    position: 'Forward',
    team: 'Barcelona',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    rating: 8.7,
    age: 35,
    nationality: 'Poland',
    jerseyNumber: 9,
    bio: 'Prolific striker and goal-scoring machine with incredible consistency.',
    stats: {
      appearances: 700,
      goals: 600,
      assists: 150,
      yellowCards: 40,
      redCards: 1,
    },
    achievements: ['2x FIFA Best Player', 'Champions League Winner 2020', 'Bundesliga Top Scorer x7'],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Async thunk to fetch players
export const fetchPlayers = createAsyncThunk<
  PlayersResponse,
  { page?: number; searchQuery?: string; position?: string; team?: string; refresh?: boolean },
  { rejectValue: string }
>(
  'players/fetchPlayers',
  async ({ page = 1, searchQuery = '', position = 'all', team = 'all', refresh = false }, { rejectWithValue }) => {
    try {
      await delay(800);

      let filteredPlayers = [...DUMMY_PLAYERS];

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredPlayers = filteredPlayers.filter(player =>
          player.name.toLowerCase().includes(query) ||
          player.team.toLowerCase().includes(query) ||
          player.position.toLowerCase().includes(query)
        );
      }

      // Filter by position
      if (position && position !== 'all') {
        filteredPlayers = filteredPlayers.filter(player =>
          player.position.toLowerCase() === position.toLowerCase()
        );
      }

      // Filter by team
      if (team && team !== 'all') {
        filteredPlayers = filteredPlayers.filter(player =>
          player.team.toLowerCase() === team.toLowerCase()
        );
      }

      const limit = 10;
      const totalPlayers = filteredPlayers.length;
      const totalPages = Math.ceil(totalPlayers / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

      return {
        data: paginatedPlayers,
        page,
        totalPages,
        totalPlayers,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch players');
    }
  }
);

// Async thunk to fetch player details
export const fetchPlayerDetails = createAsyncThunk<
  Player,
  string,
  { rejectValue: string }
>(
  'players/fetchPlayerDetails',
  async (playerId, { rejectWithValue }) => {
    try {
      await delay(600);

      const player = DUMMY_PLAYERS.find(p => p.id === playerId);

      if (!player) {
        return rejectWithValue('Player not found');
      }

      return player;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch player details');
    }
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.list = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilterPosition: (state, action: PayloadAction<string>) => {
      state.filterPosition = action.payload;
    },
    setFilterTeam: (state, action: PayloadAction<string>) => {
      state.filterTeam = action.payload;
    },
    resetPlayers: (state) => {
      state.list = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch players
    builder
      .addCase(fetchPlayers.pending, (state, action) => {
        if (action.meta.arg.refresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;

        if (action.meta.arg.refresh || action.meta.arg.page === 1) {
          state.list = action.payload.data;
        } else {
          state.list = [...state.list, ...action.payload.data];
        }

        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.page < action.payload.totalPages;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload || 'Failed to fetch players';
      });

    // Fetch player details
    builder
      .addCase(fetchPlayerDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchPlayerDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentPlayer = action.payload;
      })
      .addCase(fetchPlayerDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || 'Failed to fetch player details';
      });
  },
});

export const {
  setPlayers,
  setLoading,
  setError,
  setSearchQuery,
  setFilterPosition,
  setFilterTeam,
  resetPlayers,
} = playersSlice.actions;

export default playersSlice.reducer;
