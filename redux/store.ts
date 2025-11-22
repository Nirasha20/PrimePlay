import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './slices/matchesSlice';

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
