import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../constants/theme';

export const useThemedColors = () => {
  const { isDarkMode } = useTheme();
  return getColors(isDarkMode);
};
