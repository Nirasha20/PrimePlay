import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DetailScreenSkeleton from '../components/LoadingSkeleton';
import RelatedItemsCarousel from '../components/RelatedItemsCarousel';
import ShareButton from '../components/ShareButton';
import { borderRadius, colors, fontSize, shadows, spacing } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMatchDetails } from '../redux/slices/matchesSlice';
import { Match } from '../utils/api/sportsApi';

interface LineupPlayer {
  id: string;
  name: string;
  position: string;
  number: number;
  rating: number;
}

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => (
  <View style={styles.statItem}>
    {icon && <Ionicons name={icon} size={24} color={colors.primary} style={styles.statIcon} />}
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface PlayerLineupCardProps {
  player: LineupPlayer;
  onPress: () => void;
}

const PlayerLineupCard: React.FC<PlayerLineupCardProps> = ({ player, onPress }) => (
  <TouchableOpacity style={styles.lineupCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.lineupCardContent}>
      <View style={styles.playerNumberBadge}>
        <Text style={styles.playerNumber}>#{player.number}</Text>
      </View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName} numberOfLines={1}>
          {player.name}
        </Text>
        <Text style={styles.playerPosition}>{player.position}</Text>
      </View>
      <View style={styles.playerRating}>
        <Ionicons name="star" size={12} color={colors.warning.icon} />
        <Text style={styles.ratingText}>{player.rating}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const DetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'players'>('overview');
  
  const { currentMatch, detailsLoading, detailsError, list } = useAppSelector(
    (state) => state.matches
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchMatchDetails(id));
    }
  }, [id, dispatch]);

  // Generate related matches based on same sport
  const relatedMatches = useMemo(() => {
    if (!currentMatch) return [];
    
    return list
      .filter((match: Match) => 
        match.sport === currentMatch.sport && match.id !== currentMatch.id
      )
      .slice(0, 5)
      .map((match: Match) => ({
        id: match.id,
        title: `${match.homeTeam} vs ${match.awayTeam}`,
        subtitle: match.sport,
        image: match.image,
        status: match.status,
        date: match.date,
        time: match.time,
      }));
  }, [currentMatch, list]);

  // Tab state for team selection
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  // Dummy home team starting XI
  const homeTeamLineup: LineupPlayer[] = useMemo(() => [
    { id: '1', name: 'David de Gea', position: 'GK', number: 1, rating: 7.5 },
    { id: '2', name: 'Harry Maguire', position: 'CB', number: 5, rating: 6.8 },
    { id: '3', name: 'Lisandro Martínez', position: 'CB', number: 6, rating: 7.2 },
    { id: '4', name: 'Diogo Dalot', position: 'RB', number: 20, rating: 7.1 },
    { id: '5', name: 'Luke Shaw', position: 'LB', number: 23, rating: 6.9 },
    { id: '6', name: 'Casemiro', position: 'DM', number: 18, rating: 7.6 },
    { id: '7', name: 'Bruno Fernandes', position: 'AM', number: 8, rating: 8.2 },
    { id: '8', name: 'Marcus Rashford', position: 'LW', number: 10, rating: 7.8 },
    { id: '9', name: 'Antony', position: 'RW', number: 21, rating: 7.0 },
    { id: '10', name: 'Alejandro Garnacho', position: 'ST', number: 17, rating: 7.4 },
    { id: '11', name: 'Rasmus Højlund', position: 'ST', number: 11, rating: 7.3 },
  ], []);

  // Dummy away team starting XI
  const awayTeamLineup: LineupPlayer[] = useMemo(() => [
    { id: '12', name: 'Alisson Becker', position: 'GK', number: 1, rating: 7.8 },
    { id: '13', name: 'Trent Alexander-Arnold', position: 'RB', number: 66, rating: 7.5 },
    { id: '14', name: 'Virgil van Dijk', position: 'CB', number: 4, rating: 8.0 },
    { id: '15', name: 'Ibrahima Konaté', position: 'CB', number: 5, rating: 7.3 },
    { id: '16', name: 'Andy Robertson', position: 'LB', number: 26, rating: 7.2 },
    { id: '17', name: 'Alexis Mac Allister', position: 'DM', number: 10, rating: 7.4 },
    { id: '18', name: 'Dominik Szoboszlai', position: 'CM', number: 8, rating: 7.6 },
    { id: '19', name: 'Mohamed Salah', position: 'RW', number: 11, rating: 8.3 },
    { id: '20', name: 'Luis Díaz', position: 'LW', number: 7, rating: 7.7 },
    { id: '21', name: 'Darwin Núñez', position: 'ST', number: 9, rating: 7.1 },
    { id: '22', name: 'Cody Gakpo', position: 'ST', number: 18, rating: 7.0 },
  ], []);

  const handlePlayerPress = (playerId: string) => {
    router.push({
      pathname: '/player/[id]',
      params: { id: playerId },
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'live':
        return styles.liveBadge;
      case 'completed':
        return styles.completedBadge;
      case 'upcoming':
        return styles.upcomingBadge;
      default:
        return styles.upcomingBadge;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return 'Live Now';
      case 'completed':
        return 'Full Time';
      case 'upcoming':
        return 'Upcoming';
      default:
        return status;
    }
  };

  if (detailsLoading) {
    return <DetailScreenSkeleton />;
  }

  if (detailsError || !currentMatch) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient colors={colors.background.gradient} style={styles.errorGradient}>
          <View style={styles.errorContent}>
            <Ionicons name="alert-circle" size={64} color={colors.error.icon} />
            <Text style={styles.errorText}>
              {detailsError || 'Match not found'}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => id && dispatch(fetchMatchDetails(id))}
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

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Image with Overlay Header */}
        {currentMatch.image && (
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: currentMatch.image }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent', colors.background.dark]}
              style={styles.heroGradient}
            />
            
            {/* Absolute Header */}
            <View style={styles.absoluteHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{currentMatch.sport}</Text>
              <ShareButton
                title={`${currentMatch.homeTeam} vs ${currentMatch.awayTeam}`}
                message={`Check out this ${currentMatch.sport} match: ${currentMatch.homeTeam} vs ${currentMatch.awayTeam} on ${currentMatch.date} at ${currentMatch.time}`}
                url={`primeplay://match/${currentMatch.id}`}
              />
            </View>
          </View>
        )}

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <View style={styles.teamScoreSection}>
              {currentMatch.homeScore !== undefined && (
                <Text style={styles.scoreValue}>{currentMatch.homeScore}</Text>
              )}
              <Text style={styles.scoreTeamName}>{currentMatch.homeTeam}</Text>
            </View>

            <View style={styles.scoreCenter}>
              <Text style={[styles.statusText, getStatusBadgeStyle(currentMatch.status)]}>
                {getStatusText(currentMatch.status)}
              </Text>
              <Text style={styles.scoreDate}>{currentMatch.date === '2025-11-22' ? 'Today' : 'Yesterday'}</Text>
            </View>

            <View style={styles.teamScoreSection}>
              {currentMatch.awayScore !== undefined && (
                <Text style={styles.scoreValue}>{currentMatch.awayScore}</Text>
              )}
              <Text style={styles.scoreTeamName}>{currentMatch.awayTeam}</Text>
            </View>
          </View>

          {/* Match Time */}
          <View style={styles.matchTimeRow}>
            <View style={styles.timeItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.text.tertiary} />
              <Text style={styles.timeText}>{currentMatch.date === '2025-11-22' ? 'Today' : currentMatch.date}</Text>
            </View>
            <View style={styles.timeItem}>
              <Ionicons name="time-outline" size={16} color={colors.text.tertiary} />
              <Text style={styles.timeText}>{currentMatch.time}</Text>
            </View>
            <View style={[styles.liveIndicator, currentMatch.status === 'live' && styles.liveIndicatorActive]}>
              <Text style={styles.liveText}>{currentMatch.status === 'live' ? 'Live' : getStatusText(currentMatch.status)}</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsCardsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="eye" size={32} color={colors.primary} />
            <Text style={styles.statCardValue}>2.3M</Text>
            <Text style={styles.statCardLabel}>Viewers</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color={colors.primary} />
            <Text style={styles.statCardValue}>11 v 11</Text>
            <Text style={styles.statCardLabel}>Players</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flash" size={32} color={colors.primary} />
            <Text style={styles.statCardValue}>45+3</Text>
            <Text style={styles.statCardLabel}>Minutes</Text>
          </View>
        </View>

        {/* Match Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Match Info</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Competition</Text>
              <Text style={styles.infoValue}>Premier League</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Venue</Text>
              <Text style={styles.infoValue}>Old Trafford</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Attendance</Text>
              <Text style={styles.infoValue}>74,000</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Ionicons
              name="eye-outline"
              size={20}
              color={activeTab === 'overview' ? colors.primary : colors.text.tertiary}
            />
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'stats' && styles.tabActive]}
            onPress={() => setActiveTab('stats')}
          >
            <Ionicons
              name="stats-chart-outline"
              size={20}
              color={activeTab === 'stats' ? colors.primary : colors.text.tertiary}
            />
            <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>
              Stats
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'players' && styles.tabActive]}
            onPress={() => setActiveTab('players')}
          >
            <Ionicons
              name="people-outline"
              size={20}
              color={activeTab === 'players' ? colors.primary : colors.text.tertiary}
            />
            <Text style={[styles.tabText, activeTab === 'players' && styles.tabTextActive]}>
              Players
            </Text>
          </TouchableOpacity>
        </View>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Match Description */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text" size={24} color={colors.primary} />
                <Text style={styles.sectionTitle}>About This Match</Text>
              </View>
              <Text style={styles.description}>
                {`This exciting ${currentMatch.sport} match between ${currentMatch.homeTeam} and ${currentMatch.awayTeam} is ${currentMatch.status === 'upcoming' ? 'scheduled for' : currentMatch.status === 'live' ? 'currently taking place on' : 'took place on'} ${currentMatch.date} at ${currentMatch.time}.`}
              </Text>
            </View>

            {/* Additional Information */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle" size={24} color={colors.primary} />
                <Text style={styles.sectionTitle}>Match Info</Text>
              </View>
              <View style={styles.infoList}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Competition</Text>
                  <Text style={styles.infoValue}>Premier League</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Venue</Text>
                  <Text style={styles.infoValue}>Old Trafford</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Referee</Text>
                  <Text style={styles.infoValue}>John Doe</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Attendance</Text>
                  <Text style={styles.infoValue}>74,000</Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Stats Tab Content */}
        {activeTab === 'stats' && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="stats-chart" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Match Statistics</Text>
            </View>
            
            <View style={styles.statsGrid}>
              <StatItem label="Possession" value="65%" icon="pie-chart" />
              <StatItem label="Shots" value="18" icon="football" />
              <StatItem label="On Target" value="12" icon="checkmark-circle" />
              <StatItem label="Corners" value="8" icon="flag" />
              <StatItem label="Fouls" value="14" icon="warning" />
              <StatItem label="Yellow Cards" value="3" icon="card" />
            </View>
          </View>
        )}

        {/* Players Tab Content */}
        {activeTab === 'players' && (
          <>
            {/* Team Selection Tabs */}
            <View style={styles.teamTabsContainer}>
              <TouchableOpacity
                style={[styles.teamTab, selectedTeam === 'home' && styles.teamTabActive]}
                onPress={() => setSelectedTeam('home')}
              >
                <Text style={[styles.teamTabText, selectedTeam === 'home' && styles.teamTabTextActive]}>
                  {currentMatch.homeTeam}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.teamTab, selectedTeam === 'away' && styles.teamTabActive]}
                onPress={() => setSelectedTeam('away')}
              >
                <Text style={[styles.teamTabText, selectedTeam === 'away' && styles.teamTabTextActive]}>
                  {currentMatch.awayTeam}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Starting XI */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people" size={24} color={colors.primary} />
                <Text style={styles.sectionTitle}>
                  {selectedTeam === 'home' ? currentMatch.homeTeam : currentMatch.awayTeam} - Starting XI
                </Text>
              </View>
              
              <View style={styles.lineupGrid}>
                {(selectedTeam === 'home' ? homeTeamLineup : awayTeamLineup).map((player) => (
                  <PlayerLineupCard
                    key={player.id}
                    player={player}
                    onPress={() => handlePlayerPress(player.id)}
                  />
                ))}
              </View>
            </View>
          </>
        )}

        {/* Related Matches Carousel */}
        {relatedMatches.length > 0 && (
          <RelatedItemsCarousel
            items={relatedMatches}
            title={`More ${currentMatch.sport} Matches`}
          />
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
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 400,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  absoluteHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.huge,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  scoreCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.xxl,
    marginTop: -spacing.xxxl,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  teamScoreSection: {
    flex: 1,
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  scoreTeamName: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  scoreCenter: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  scoreDate: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  matchTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  liveIndicator: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.text.tertiary,
  },
  liveIndicatorActive: {
    backgroundColor: colors.error.icon,
  },
  liveText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.text.primary,
    textTransform: 'uppercase',
  },
  statsCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.small,
  },
  statCardValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  statCardLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  liveBadge: {
    backgroundColor: colors.error.icon,
  },
  completedBadge: {
    backgroundColor: colors.text.tertiary,
  },
  upcomingBadge: {
    backgroundColor: colors.primary,
  },
  statusText: {
    color: colors.text.primary,
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  matchInfoCard: {
    backgroundColor: colors.background.card,
    margin: spacing.xxl,
    marginTop: -spacing.xxl,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  sportLabel: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
    letterSpacing: 1,
  },
  teamsSection: {
    marginBottom: spacing.lg,
  },
  teamContainer: {
    marginBottom: spacing.md,
  },
  teamInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  teamScore: {
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: spacing.lg,
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  vsText: {
    fontSize: fontSize.md,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  statIcon: {
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  infoList: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  infoValue: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: spacing.huge,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    ...shadows.small,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  tabActive: {
    backgroundColor: colors.primary + '20',
  },
  tabText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  teamTabsContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  teamTab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  teamTabActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  teamTabText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  teamTabTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  lineupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  lineupCard: {
    width: '48%',
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  lineupCardContent: {
    padding: spacing.md,
  },
  playerNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  playerNumber: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  playerInfo: {
    marginBottom: spacing.sm,
  },
  playerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  playerPosition: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  playerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.secondary,
  },
});

export default DetailScreen;
