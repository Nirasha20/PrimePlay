import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import MatchCard from '../components/MatchCard';
import ThemeToggle from '../components/ThemeToggle';
import { borderRadius, fontSize, shadows, spacing } from '../constants/theme';
import { useThemedColors } from '../hooks/useThemedColors';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { saveFavorites, toggleFavorite } from '../redux/slices/favoritesSlice';
import { Match } from '../utils/api/sportsApi';

const FavoritesScreen = () => {
  const router = useRouter();
  const colors = useThemedColors();
  const styles = createStyles(colors);
  const dispatch = useAppDispatch();
  const favoriteMatches = useAppSelector((state) => state.favorites.favoriteMatches);

  const handleFavoritePress = useCallback((match: Match) => {
    dispatch(toggleFavorite(match));
    // Save to AsyncStorage
    const updatedFavorites = favoriteMatches.filter(fav => fav.id !== match.id);
    dispatch(saveFavorites(updatedFavorites));
  }, [dispatch, favoriteMatches]);

  const handleMatchPress = (matchId: string) => {
    router.push({
      pathname: '/match/[id]',
      params: { id: matchId },
    });
  };

  const handleExplorePress = () => {
    router.push('/home');
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
      isFavorite={true}
      onFavoritePress={() => handleFavoritePress(item)}
      onPress={() => handleMatchPress(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.iconCircle}>
        <Ionicons name="heart-outline" size={64} color={colors.text.tertiary} />
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart icon on any match to add it to your favorites
      </Text>
      <TouchableOpacity style={styles.exploreButton} onPress={handleExplorePress}>
        <Text style={styles.exploreButtonText}>Explore Matches</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={colors.background.gradient} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <View style={{flexDirection: 'row', gap: spacing.sm}}>
            <ThemeToggle />
          </View>
        </View>
        {favoriteMatches.length > 0 && (
          <Text style={styles.favoriteCount}>
            {favoriteMatches.length} {favoriteMatches.length === 1 ? 'match' : 'matches'} saved
          </Text>
        )}
      </LinearGradient>

      {/* Content */}
      {favoriteMatches.length > 0 ? (
        <FlatList
          data={favoriteMatches}
          renderItem={renderMatchCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderEmptyState()}
        </ScrollView>
      )}

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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  favoriteCount: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge * 2,
    paddingHorizontal: spacing.xxl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.medium,
  },
  exploreButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.md,
    fontWeight: 'bold',
  },
});

export default FavoritesScreen;
