import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { borderRadius } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedColors } from '../hooks/useThemedColors';

interface ThemeToggleProps {
  size?: number;
  style?: any;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 24, style }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const colors = useThemedColors();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background.card }, style]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isDarkMode ? 'sunny' : 'moon'}
        size={size}
        color={colors.text.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThemeToggle;
