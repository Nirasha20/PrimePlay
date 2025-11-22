import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
      });
  },
});

export const { setMatches, setLoading, setError, setSelectedSport, resetMatches } = matchesSlice.actions;
export default matchesSlice.reducer;
