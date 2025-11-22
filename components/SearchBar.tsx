import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

interface SearchBarProps extends Omit<TextInputProps, 'onChange'> {
  onSearch: (query: string) => void;
  onFilterPress?: () => void;
  debounceTime?: number;
  showFilterIcon?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterPress,
  debounceTime = 500,
  showFilterIcon = true,
  placeholder = 'Search teams, players...',
  ...props
}) => {
  const [searchText, setSearchText] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchText);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchText, debounceTime, onSearch]);

  const handleClear = useCallback(() => {
    setSearchText('');
    onSearch('');
  }, [onSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.icon.secondary}
          style={styles.searchIcon}
        />
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.text.placeholder}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />

        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.icon.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {showFilterIcon && onFilterPress && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="options-outline"
            size={24}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
    height: '100%',
  },
  clearButton: {
    padding: spacing.xs,
  },
  filterButton: {
    marginLeft: spacing.md,
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SearchBar;
