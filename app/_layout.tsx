import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ThemeProvider } from '../contexts/ThemeContext';
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
