import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './slices/matchesSlice';
import playersReducer from './slices/playersSlice';

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    players: playersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
