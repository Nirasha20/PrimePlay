// Dark theme colors
export const darkColors = {
  // Primary Colors
  primary: '#a855f7',
  primaryLight: '#a78bfa',
  primaryDark: '#7c3aed',

  // Background Colors
  background: {
    gradient: ['#1a1a2e', '#2d1b4e', '#4a148c'] as const,
    dark: '#1a1a2e',
    card: '#1f2937',
    input: '#374151',
  },

  // Text Colors
  text: {
    primary: '#ffffff',
    secondary: '#d1d5db',
    tertiary: '#9ca3af',
    placeholder: '#9ca3af',
  },

  // Border Colors
  border: {
    default: '#4b5563',
    focus: '#a78bfa',
  },

  // Status Colors
  error: {
    background: '#7f1d1d',
    text: '#fca5a5',
    icon: '#ef4444',
  },

  success: {
    background: '#065f46',
    text: '#6ee7b7',
    icon: '#10b981',
  },

  warning: {
    background: '#78350f',
    text: '#fcd34d',
    icon: '#f59e0b',
  },

  info: {
    background: '#1e3a8a',
    text: '#93c5fd',
    icon: '#3b82f6',
  },

  // Icon Colors
  icon: {
    primary: '#a78bfa',
    secondary: '#9ca3af',
  },
};

// Light theme colors
export const lightColors = {
  // Primary Colors
  primary: '#a855f7',
  primaryLight: '#c084fc',
  primaryDark: '#7c3aed',

  // Background Colors
  background: {
    gradient: ['#f9fafb', '#f3e8ff', '#e9d5ff'] as const,
    dark: '#ffffff',
    card: '#f9fafb',
    input: '#f3f4f6',
  },

  // Text Colors
  text: {
    primary: '#1f2937',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    placeholder: '#9ca3af',
  },

  // Border Colors
  border: {
    default: '#e5e7eb',
    focus: '#a78bfa',
  },

  // Status Colors
  error: {
    background: '#fee2e2',
    text: '#dc2626',
    icon: '#ef4444',
  },

  success: {
    background: '#d1fae5',
    text: '#059669',
    icon: '#10b981',
  },

  warning: {
    background: '#fef3c7',
    text: '#d97706',
    icon: '#f59e0b',
  },

  info: {
    background: '#dbeafe',
    text: '#2563eb',
    icon: '#3b82f6',
  },

  // Icon Colors
  icon: {
    primary: '#a855f7',
    secondary: '#6b7280',
  },
};

// Default export for backward compatibility (dark theme)
export const colors = darkColors;

// Function to get colors based on theme
export const getColors = (isDarkMode: boolean) => isDarkMode ? darkColors : lightColors;


export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 32,
  massive: 40,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  primary: {
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadows,
};
