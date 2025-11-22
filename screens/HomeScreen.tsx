import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMatches, setSelectedSport } from '../redux/slices/matchesSlice';
import { Match } from '../utils/api/sportsApi';
import { colors, spacing, borderRadius, fontSize, shadows } from '../constants/theme';

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
    <TouchableOpacity style={styles.matchCard} activeOpacity={0.8}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.matchImage} />
      )}
      
      {item.status === 'live' && (
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>Live</Text>
        </View>
      )}
      
      {item.status === 'completed' && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>Completed</Text>
        </View>
      )}

      <View style={styles.matchContent}>
        <Text style={styles.sportLabel}>{item.sport.toUpperCase()}</Text>
        
        <View style={styles.teamsContainer}>
          <View style={styles.teamRow}>
            <Text style={styles.teamName}>{item.homeTeam}</Text>
            {item.homeScore !== undefined && (
              <Text style={styles.score}>{item.homeScore}</Text>
            )}
          </View>
          
          <View style={styles.teamRow}>
            <Text style={styles.teamName}>{item.awayTeam}</Text>
            {item.awayScore !== undefined && (
              <Text style={styles.score}>{item.awayScore}</Text>
            )}
          </View>
        </View>

        <View style={styles.matchFooter}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  matchCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  matchImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  liveBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.error.icon,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  liveText: {
    color: colors.text.primary,
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  completedBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.text.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  completedText: {
    color: colors.text.primary,
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  matchContent: {
    padding: spacing.lg,
  },
  sportLabel: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  teamsContainer: {
    marginBottom: spacing.md,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  teamName: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  score: {
    fontSize: fontSize.xl,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  dateText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  timeText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
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
