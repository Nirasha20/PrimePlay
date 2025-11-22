import { getColors } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

export const useThemedColors = () => {
  const { isDarkMode } = useTheme();
  return getColors(isDarkMode);
};
