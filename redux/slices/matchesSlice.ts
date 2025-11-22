import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import sportsApi, { Match, MatchesResponse } from '../../utils/api/sportsApi';

interface MatchesState {
  list: Match[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  hasMore: boolean;
  refreshing: boolean;
  selectedSport: string;
  currentMatch: Match | null;
  detailsLoading: boolean;
  detailsError: string | null;
}

const initialState: MatchesState = {
  list: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  hasMore: true,
  refreshing: false,
  selectedSport: 'all',
  currentMatch: null,
  detailsLoading: false,
  detailsError: null,
};

// Async thunk to fetch matches
export const fetchMatches = createAsyncThunk<
  MatchesResponse,
  { page?: number; sport?: string; refresh?: boolean },
  { rejectValue: string }
>(
  'matches/fetchMatches',
  async ({ page = 1, sport, refresh = false }, { rejectWithValue }) => {
    try {
      const response = await sportsApi.getMatches(page, 10, sport !== 'all' ? sport : undefined);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch matches');
    }
  }
);

// Async thunk to fetch match details by ID
export const fetchMatchDetails = createAsyncThunk<
  Match,
  string,
  { rejectValue: string }
>(
  'matches/fetchMatchDetails',
  async (matchId: string, { rejectWithValue }) => {
    try {
      const response = await sportsApi.getMatchById(matchId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch match details');
    }
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Match[]>) => {
      state.list = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedSport: (state, action: PayloadAction<string>) => {
      state.selectedSport = action.payload;
      state.page = 1;
      state.list = [];
      state.hasMore = true;
    },
    resetMatches: (state) => {
      state.list = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch matches - pending
      .addCase(fetchMatches.pending, (state, action) => {
        if (action.meta.arg.refresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      // Fetch matches - fulfilled
      .addCase(fetchMatches.fulfilled, (state, action) => {
        const { data, page, totalPages } = action.payload;
        
        if (action.meta.arg.refresh || page === 1) {
          state.list = data;
        } else {
          state.list = [...state.list, ...data];
        }
        
        state.page = page;
        state.totalPages = totalPages;
        state.hasMore = page < totalPages;
        state.loading = false;
        state.refreshing = false;
        state.error = null;
      })
      // Fetch matches - rejected
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload || 'Failed to fetch matches';
      })
      // Fetch match details - pending
      .addCase(fetchMatchDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        state.currentMatch = null;
      })
      // Fetch match details - fulfilled
      .addCase(fetchMatchDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentMatch = action.payload;
        state.detailsError = null;
      })
      // Fetch match details - rejected
      .addCase(fetchMatchDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || 'Failed to fetch match details';
      });
  },
});

export const { setMatches, setLoading, setError, setSelectedSport, resetMatches } = matchesSlice.actions;
export default matchesSlice.reducer;
