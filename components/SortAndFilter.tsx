import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';

export type FilterStatus = 'all' | 'live' | 'upcoming' | 'completed';
export type SortOption = 'recent' | 'popular' | 'upcoming';

interface FilterChip {
  id: FilterStatus;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface SortChip {
  id: SortOption;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface SortAndFilterProps {
  selectedStatus: FilterStatus;
  selectedSort: SortOption;
  onStatusChange: (status: FilterStatus) => void;
  onSortChange: (sort: SortOption) => void;
  showStatusFilter?: boolean;
  showSortOptions?: boolean;
}

const STATUS_FILTERS: FilterChip[] = [
  { id: 'all', label: 'All', icon: 'list' },
  { id: 'live', label: 'Live', icon: 'radio-button-on' },
  { id: 'upcoming', label: 'Upcoming', icon: 'time' },
  { id: 'completed', label: 'Completed', icon: 'checkmark-circle' },
];

const SORT_OPTIONS: SortChip[] = [
  { id: 'recent', label: 'Recent', icon: 'calendar' },
  { id: 'popular', label: 'Popular', icon: 'flame' },
  { id: 'upcoming', label: 'Upcoming', icon: 'arrow-forward' },
];

const SortAndFilter: React.FC<SortAndFilterProps> = ({
  selectedStatus,
  selectedSort,
  onStatusChange,
  onSortChange,
  showStatusFilter = true,
  showSortOptions = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Status Filters */}
      {showStatusFilter && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {STATUS_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.chip,
                  selectedStatus === filter.id && styles.chipActive,
                ]}
                onPress={() => onStatusChange(filter.id)}
                activeOpacity={0.7}
              >
                {filter.icon && (
                  <Ionicons
                    name={filter.icon}
                    size={16}
                    color={
                      selectedStatus === filter.id
                        ? colors.text.primary
                        : colors.text.secondary
                    }
                    style={styles.chipIcon}
                  />
                )}
                <Text
                  style={[
                    styles.chipText,
                    selectedStatus === filter.id && styles.chipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Sort Options */}
      {showSortOptions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {SORT_OPTIONS.map((sort) => (
              <TouchableOpacity
                key={sort.id}
                style={[
                  styles.chip,
                  selectedSort === sort.id && styles.chipActive,
                ]}
                onPress={() => onSortChange(sort.id)}
                activeOpacity={0.7}
              >
                {sort.icon && (
                  <Ionicons
                    name={sort.icon}
                    size={16}
                    color={
                      selectedSort === sort.id
                        ? colors.text.primary
                        : colors.text.secondary
                    }
                    style={styles.chipIcon}
                  />
                )}
                <Text
                  style={[
                    styles.chipText,
                    selectedSort === sort.id && styles.chipTextActive,
                  ]}
                >
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  chipsContainer: {
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  chipIcon: {
    marginRight: spacing.xs,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.text.primary,
  },
});

export default SortAndFilter;
