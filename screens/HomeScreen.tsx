import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MatchCard from '../components/MatchCard';
import { borderRadius, colors, fontSize, shadows, spacing } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMatches, setSelectedSport } from '../redux/slices/matchesSlice';
import { Match } from '../utils/api/sportsApi';

const SPORTS = ['All', 'Football', 'Cricket', 'Basketball', 'Tennis'];

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error, refreshing, hasMore, page, selectedSport } = useAppSelector(
    (state) => state.matches
  );
  const [searchQuery, setSearchQuery] = useState('');

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

  const renderMatchCard = ({ item }: { item: Match }) => (
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
      onPress={() => console.log('Match pressed:', item.id)}
    />
  );

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
          <TouchableOpacity style={styles.themeToggle}>
            <Ionicons name="moon-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.icon.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search teams, players..."
            placeholderTextColor={colors.text.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

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
    </View>
  );
};

const styles = StyleSheet.create({
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
  themeToggle: {
    padding: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
    marginBottom: spacing.lg,
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
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
    paddingBottom: spacing.xxl,
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
