import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import { ThemeProvider } from '../contexts/ThemeContext';
import { store } from '../redux/store';
import './globals.css';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}
