import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import MatchCard from '../components/MatchCard';
import SearchBar from '../components/SearchBar';
import SortAndFilter, { FilterStatus, SortOption } from '../components/SortAndFilter';
import ThemeToggle from '../components/ThemeToggle';
import { borderRadius, fontSize, spacing } from '../constants/theme';
import { useThemedColors } from '../hooks/useThemedColors';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loadFavorites, saveFavorites, toggleFavorite } from '../redux/slices/favoritesSlice';
import { fetchMatches, setSelectedSport } from '../redux/slices/matchesSlice';
import { Match } from '../utils/api/sportsApi';

const SPORTS = ['All', 'Football', 'Cricket', 'Basketball', 'Tennis'];

const HomeScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const { list, loading, error, refreshing, hasMore, page, selectedSport } = useAppSelector(
    (state) => state.matches
  );
  const favoriteMatches = useAppSelector((state) => state.favorites.favoriteMatches);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('recent');

  useEffect(() => {
    // Load favorites from storage on mount
    dispatch(loadFavorites());
  }, [dispatch]);

  useEffect(() => {
    loadMatches();
  }, [selectedSport]);

  const loadMatches = useCallback(() => {
    dispatch(fetchMatches({ page: 1, sport: selectedSport, refresh: false }));
  }, [dispatch, selectedSport]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchMatches({ page: 1, sport: selectedSport, refresh: true }));
  }, [dispatch, selectedSport]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchMatches({ page: page + 1, sport: selectedSport, refresh: false }));
    }
  }, [dispatch, loading, hasMore, page, selectedSport]);

  const handleSportSelect = (sport: string) => {
    dispatch(setSelectedSport(sport.toLowerCase()));
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // TODO: Implement search filtering
    console.log('Searching for:', query);
  }, []);

  const handleFilterPress = () => {
    setShowFilters(!showFilters);
  };

  const handleStatusChange = (status: FilterStatus) => {
    setSelectedStatus(status);
    // TODO: Filter matches by status
    console.log('Filter by status:', status);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    // TODO: Sort matches
    console.log('Sort by:', sort);
  };

  const handleMatchPress = (matchId: string) => {
    router.push({
      pathname: '/match/[id]',
      params: { id: matchId },
    });
  };

  const handleFavoritePress = useCallback((match: Match) => {
    dispatch(toggleFavorite(match));
    // Save to AsyncStorage
    dispatch(saveFavorites(
      favoriteMatches.some(fav => fav.id === match.id)
        ? favoriteMatches.filter(fav => fav.id !== match.id)
        : [match, ...favoriteMatches]
    ));
  }, [dispatch, favoriteMatches]);

  const renderMatchCard = ({ item }: { item: Match }) => {
    const isFavorite = favoriteMatches.some(fav => fav.id === item.id);
    
    return (
      <MatchCard
        id={item.id}
        sport={item.sport}
        homeTeam={item.homeTeam}
        awayTeam={item.awayTeam}
        homeScore={item.homeScore}
        awayScore={item.awayScore}
        status={item.status}
        date={item.date}
        time={item.time}
        image={item.image}
        isFavorite={isFavorite}
        onFavoritePress={() => handleFavoritePress(item)}
        onPress={() => handleMatchPress(item.id)}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="football-outline" size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyText}>No matches available</Text>
      <Text style={styles.emptySubtext}>Pull down to refresh</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={24} color={colors.error.icon} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMatches}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={colors.background.gradient} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <Ionicons name="football" size={24} color={colors.text.primary} />
            <Text style={styles.appName}>PrimePlay</Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          onFilterPress={handleFilterPress}
        />

        {/* Sort and Filter */}
        {showFilters && (
          <SortAndFilter
            selectedStatus={selectedStatus}
            selectedSort={selectedSort}
            onStatusChange={handleStatusChange}
            onSortChange={handleSortChange}
          />
        )}

        {/* Sports Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportsFilter}
        >
          {SPORTS.map((sport) => (
            <TouchableOpacity
              key={sport}
              style={[
                styles.sportChip,
                selectedSport === sport.toLowerCase() && styles.sportChipActive,
              ]}
              onPress={() => handleSportSelect(sport)}
            >
              <Text
                style={[
                  styles.sportChipText,
                  selectedSport === sport.toLowerCase() && styles.sportChipTextActive,
                ]}
              >
                {sport}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Matches List */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>All Matches</Text>
        
        {error ? (
          renderError()
        ) : (
          <FlatList
            data={list}
            renderItem={renderMatchCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
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
            ListFooterComponent={renderFooter}
            ListEmptyComponent={!loading ? renderEmptyState : null}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      {/* Bottom Navigation */}
      <BottomTabBar />
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    paddingTop: spacing.huge,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
  sportsFilter: {
    paddingVertical: spacing.sm,
  },
  sportChip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: spacing.md,
  },
  sportChipActive: {
    backgroundColor: colors.primary,
  },
  sportChipText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  sportChipTextActive: {
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingBottom: 100,
  },
  footerLoader: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge * 2,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    marginTop: spacing.lg,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.error.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  retryText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
