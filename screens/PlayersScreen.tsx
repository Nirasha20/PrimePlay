import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import PlayerCard from '../components/PlayerCard';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
    fetchPlayers,
    Player,
    resetPlayers,
    setFilterPosition,
    setFilterTeam,
    setSearchQuery,
} from '../redux/slices/playersSlice';

const POSITIONS = ['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
const TEAMS = [
  'All',
  'Manchester City',
  'Liverpool',
  'Real Madrid',
  'Barcelona',
  'Al Nassr',
  'Inter Miami',
];

const PlayersScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { list, loading, error, page, hasMore, refreshing, searchQuery, filterPosition, filterTeam } =
    useAppSelector((state) => state.players);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchPlayers({ page: 1, searchQuery, position: filterPosition, team: filterTeam }));
  }, [dispatch, searchQuery, filterPosition, filterTeam]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        dispatch(setSearchQuery(localSearchQuery));
        dispatch(resetPlayers());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, searchQuery, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(resetPlayers());
    dispatch(fetchPlayers({ page: 1, searchQuery, position: filterPosition, team: filterTeam, refresh: true }));
  }, [dispatch, searchQuery, filterPosition, filterTeam]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchPlayers({ page: page + 1, searchQuery, position: filterPosition, team: filterTeam }));
    }
  }, [dispatch, loading, hasMore, page, searchQuery, filterPosition, filterTeam]);

  const handlePlayerPress = (playerId: string) => {
    router.push({
      pathname: '/player/[id]',
      params: { id: playerId },
    });
  };

  const handlePositionFilter = (position: string) => {
    dispatch(setFilterPosition(position.toLowerCase()));
    dispatch(resetPlayers());
  };

  const handleTeamFilter = (team: string) => {
    dispatch(setFilterTeam(team));
    dispatch(resetPlayers());
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    dispatch(setSearchQuery(''));
  };

  const renderPlayer = ({ item }: { item: Player }) => (
    <PlayerCard player={item} onPress={() => handlePlayerPress(item.id)} />
  );

  const renderEmpty = () => {
    if (loading && list.length === 0) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={64} color={colors.text.tertiary} />
        <Text style={styles.emptyText}>
          {searchQuery ? 'No players found for your search' : 'No players available'}
        </Text>
        {searchQuery && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearButtonText}>Clear Search</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || list.length === 0) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search players by name, team, or position..."
          placeholderTextColor={colors.text.placeholder}
          value={localSearchQuery}
          onChangeText={setLocalSearchQuery}
        />
        {localSearchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name={showFilters ? 'filter' : 'filter-outline'}
            size={20}
            color={showFilters ? colors.primary : colors.text.tertiary}
          />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Position Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Position</Text>
            <View style={styles.filterChips}>
              {POSITIONS.map((position) => (
                <TouchableOpacity
                  key={position}
                  style={[
                    styles.filterChip,
                    (filterPosition === position.toLowerCase() ||
                      (filterPosition === 'all' && position === 'All')) &&
                      styles.filterChipActive,
                  ]}
                  onPress={() => handlePositionFilter(position)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      (filterPosition === position.toLowerCase() ||
                        (filterPosition === 'all' && position === 'All')) &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    {position}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Team Filters */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Team</Text>
            <View style={styles.filterChips}>
              {TEAMS.map((team) => (
                <TouchableOpacity
                  key={team}
                  style={[
                    styles.filterChip,
                    (filterTeam === team || (filterTeam === 'all' && team === 'All')) &&
                      styles.filterChipActive,
                  ]}
                  onPress={() => handleTeamFilter(team)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      (filterTeam === team || (filterTeam === 'all' && team === 'All')) &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    {team}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {list.length} {list.length === 1 ? 'Player' : 'Players'} Found
        </Text>
      </View>
    </View>
  );

  if (error && list.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient colors={colors.background.gradient} style={styles.errorGradient}>
          <Ionicons name="alert-circle" size={64} color={colors.error.icon} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={colors.background.gradient} style={styles.gradient}>
        <FlatList
          data={list}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  gradient: {
    flex: 1,
  },
  listContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.input,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  clearIcon: {
    padding: spacing.sm,
  },
  filterButton: {
    padding: spacing.sm,
  },
  filtersContainer: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  filterSection: {
    marginBottom: spacing.md,
  },
  filterLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.dark,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  resultsContainer: {
    paddingVertical: spacing.sm,
  },
  resultsText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  clearButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  clearButtonText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
  },
  errorGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  errorText: {
    marginTop: spacing.lg,
    fontSize: fontSize.lg,
    color: colors.error.text,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.md,
    fontWeight: 'bold',
  },
});

export default PlayersScreen;
