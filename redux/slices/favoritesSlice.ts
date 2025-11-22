import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Match } from '../../utils/api/sportsApi';

const FAVORITES_STORAGE_KEY = '@primeplay_favorites';

interface FavoritesState {
  favoriteMatches: Match[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favoriteMatches: [],
  loading: false,
  error: null,
};

// Async thunk to load favorites from AsyncStorage
export const loadFavorites = createAsyncThunk(
  'favorites/loadFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const jsonValue = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load favorites');
    }
  }
);

// Async thunk to save favorites to AsyncStorage
export const saveFavorites = createAsyncThunk(
  'favorites/saveFavorites',
  async (favorites: Match[], { rejectWithValue }) => {
    try {
      const jsonValue = JSON.stringify(favorites);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, jsonValue);
      return favorites;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save favorites');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Match>) => {
      const match = action.payload;
      const existingIndex = state.favoriteMatches.findIndex(
        (fav) => fav.id === match.id
      );

      if (existingIndex !== -1) {
        // Remove from favorites
        state.favoriteMatches.splice(existingIndex, 1);
      } else {
        // Add to favorites
        state.favoriteMatches.unshift(match);
      }
    },
    clearAllFavorites: (state) => {
      state.favoriteMatches = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Load favorites
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteMatches = action.payload;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Save favorites
      .addCase(saveFavorites.pending, (state) => {
        state.error = null;
      })
      .addCase(saveFavorites.fulfilled, (state) => {
        // Successfully saved
      })
      .addCase(saveFavorites.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { toggleFavorite, clearAllFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

// Selectors
export const selectFavoriteMatches = (state: { favorites: FavoritesState }) =>
  state.favorites.favoriteMatches;

export const selectIsFavorite = (state: { favorites: FavoritesState }, matchId: string) =>
  state.favorites.favoriteMatches.some((match) => match.id === matchId);
