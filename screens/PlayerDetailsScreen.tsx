import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DetailScreenSkeleton from '../components/LoadingSkeleton';
import ShareButton from '../components/ShareButton';
import { borderRadius, colors, fontSize, shadows, spacing } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchPlayerDetails } from '../redux/slices/playersSlice';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const PlayerDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { currentPlayer, detailsLoading, detailsError } = useAppSelector(
    (state) => state.players
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchPlayerDetails(id));
    }
  }, [id, dispatch]);

  if (detailsLoading) {
    return <DetailScreenSkeleton />;
  }

  if (detailsError || !currentPlayer) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient colors={colors.background.gradient} style={styles.errorGradient}>
          <View style={styles.errorContent}>
            <Ionicons name="alert-circle" size={64} color={colors.error.icon} />
            <Text style={styles.errorText}>
              {detailsError || 'Player not found'}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => id && dispatch(fetchPlayerDetails(id))}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButtonError}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'forward':
        return colors.error.icon;
      case 'midfielder':
        return colors.success.icon;
      case 'defender':
        return colors.info.icon;
      case 'goalkeeper':
        return colors.warning.icon;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={colors.background.gradient} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Player Details</Text>
          <ShareButton
            title={currentPlayer.name}
            message={`Check out ${currentPlayer.name} - ${currentPlayer.position} at ${currentPlayer.team}`}
            url={`primeplay://player/${currentPlayer.id}`}
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Player Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[colors.background.dark, getPositionColor(currentPlayer.position) + '40']}
            style={styles.heroGradient}
          >
            {currentPlayer.image ? (
              <Image
                source={{ uri: currentPlayer.image }}
                style={styles.playerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="person" size={100} color={colors.text.tertiary} />
              </View>
            )}

            <View style={styles.playerHeader}>
              <View style={styles.nameContainer}>
                <Text style={styles.playerName}>{currentPlayer.name}</Text>
                <View style={styles.jerseyBadge}>
                  <Text style={styles.jerseyNumber}>#{currentPlayer.jerseyNumber}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.positionBadge,
                  { backgroundColor: getPositionColor(currentPlayer.position) },
                ]}
              >
                <Text style={styles.positionText}>{currentPlayer.position}</Text>
              </View>

              <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                  <Ionicons name="flag" size={16} color={colors.text.tertiary} />
                  <Text style={styles.metaText}>{currentPlayer.nationality}</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Ionicons name="calendar" size={16} color={colors.text.tertiary} />
                  <Text style={styles.metaText}>{currentPlayer.age} years</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Ionicons name="shield" size={16} color={colors.text.tertiary} />
                  <Text style={styles.metaText}>{currentPlayer.team}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Rating Card */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingContent}>
            <Ionicons name="star" size={32} color={colors.warning.icon} />
            <Text style={styles.ratingValue}>{currentPlayer.rating}</Text>
            <Text style={styles.ratingLabel}>Overall Rating</Text>
          </View>
        </View>

        {/* Bio Section */}
        {currentPlayer.bio && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Biography</Text>
            </View>
            <Text style={styles.bioText}>{currentPlayer.bio}</Text>
          </View>
        )}

        {/* Career Statistics */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="stats-chart" size={24} color={colors.primary} />
            <Text style={styles.sectionTitle}>Career Statistics</Text>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              label="Appearances"
              value={currentPlayer.stats.appearances}
              icon="shirt"
              color={colors.info.icon}
            />
            <StatCard
              label="Goals"
              value={currentPlayer.stats.goals}
              icon="football"
              color={colors.error.icon}
            />
            <StatCard
              label="Assists"
              value={currentPlayer.stats.assists}
              icon="hand-right"
              color={colors.success.icon}
            />
            <StatCard
              label="Yellow Cards"
              value={currentPlayer.stats.yellowCards}
              icon="card"
              color={colors.warning.icon}
            />
            <StatCard
              label="Red Cards"
              value={currentPlayer.stats.redCards}
              icon="card"
              color={colors.error.icon}
            />
          </View>
        </View>

        {/* Achievements */}
        {currentPlayer.achievements && currentPlayer.achievements.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trophy" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Achievements</Text>
            </View>
            <View style={styles.achievementsList}>
              {currentPlayer.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Ionicons name="medal" size={20} color={colors.warning.icon} />
                  <Text style={styles.achievementText}>{achievement}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Matches */}
        {currentPlayer.recentMatches && currentPlayer.recentMatches.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Recent Matches</Text>
            </View>
            <View style={styles.matchesList}>
              {currentPlayer.recentMatches.map((match, index) => (
                <View key={index} style={styles.matchItem}>
                  <View style={styles.matchHeader}>
                    <Text style={styles.matchOpponent}>{match.opponent}</Text>
                    <Text
                      style={[
                        styles.matchResult,
                        match.result.startsWith('W') && styles.matchResultWin,
                        match.result.startsWith('L') && styles.matchResultLoss,
                      ]}
                    >
                      {match.result}
                    </Text>
                  </View>
                  <View style={styles.matchDetails}>
                    <Text style={styles.matchDate}>{match.date}</Text>
                    <Text style={styles.matchPerformance}>{match.performance}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
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
  errorContent: {
    alignItems: 'center',
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
  backButtonError: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
  },
  backButtonText: {
    color: colors.text.secondary,
    fontSize: fontSize.md,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    marginBottom: spacing.xl,
  },
  heroGradient: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  playerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.background.dark,
    marginBottom: spacing.lg,
    borderWidth: 4,
    borderColor: colors.background.card,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.background.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 4,
    borderColor: colors.background.card,
  },
  playerHeader: {
    alignItems: 'center',
    width: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  playerName: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  jerseyBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginLeft: spacing.md,
  },
  jerseyNumber: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  positionBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  positionText: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border.default,
    marginHorizontal: spacing.md,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  ratingCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  ratingContent: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  ratingValue: {
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  ratingLabel: {
    fontSize: fontSize.md,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
  bioText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  achievementsList: {
    gap: spacing.md,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  achievementText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    flex: 1,
  },
  matchesList: {
    gap: spacing.md,
  },
  matchItem: {
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  matchOpponent: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
  },
  matchResult: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginLeft: spacing.md,
  },
  matchResultWin: {
    color: colors.success.icon,
  },
  matchResultLoss: {
    color: colors.error.icon,
  },
  matchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchDate: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  matchPerformance: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: spacing.huge,
  },
});

export default PlayerDetailsScreen;
