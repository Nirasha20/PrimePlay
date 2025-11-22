import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { borderRadius, colors, fontSize, shadows, spacing } from '../constants/theme';

interface Player {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  position: string;
  number: number;
  rating: number;
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={32} color={colors.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface PlayerCardProps {
  player: Player;
  onPress: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onPress }) => (
  <TouchableOpacity style={styles.playerCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.playerNumberBadge}>
      <Text style={styles.playerNumber}>#{player.number}</Text>
    </View>
    <Text style={styles.playerName} numberOfLines={1}>
      {player.firstName} {player.lastName}
    </Text>
    <Text style={styles.playerPosition}>{player.position}</Text>
    <View style={styles.playerRating}>
      <Ionicons name="star" size={14} color={colors.warning.icon} />
      <Text style={styles.ratingValue}>{player.rating}</Text>
    </View>
  </TouchableOpacity>
);

const MatchDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [homeTeamPlayers, setHomeTeamPlayers] = useState<Player[]>([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      // Fetch 22 users (11 for each team)
      const response = await fetch('https://dummyjson.com/users?limit=22');
      const data = await response.json();
      
      // Transform user data into player data
      const positions = ['GK', 'CB', 'CB', 'RB', 'LB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST'];
      
      // Home team - first 11 users
      const homeTeam: Player[] = data.users.slice(0, 11).map((user: any, index: number) => ({
        id: user.id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        position: positions[index],
        number: index + 1,
        rating: parseFloat((6.5 + Math.random() * 2).toFixed(1)), // Random rating between 6.5 and 8.5
      }));
      
      // Away team - next 11 users
      const awayTeam: Player[] = data.users.slice(11, 22).map((user: any, index: number) => ({
        id: user.id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        position: positions[index],
        number: index + 1,
        rating: parseFloat((6.5 + Math.random() * 2).toFixed(1)),
      }));
      
      setHomeTeamPlayers(homeTeam);
      setAwayTeamPlayers(awayTeam);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  // Match data using placeholder
  const match = {
    id,
    sport: 'Football',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeScore: 2,
    awayScore: 2,
    status: 'live',
    date: 'Today',
    time: '45:30',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    viewers: '2.3M',
    totalPlayers: '11 v 11',
    minutes: '45+3',
    competition: 'Premier League',
    venue: 'Old Trafford',
    attendance: '74,000',
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={colors.background.gradient} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Match Details</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Match Image */}
        {match.image && (
          <Image
            source={{ uri: match.image }}
            style={styles.matchImage}
            resizeMode="cover"
          />
        )}

        {/* Match Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sportLabel}>{match.sport.toUpperCase()}</Text>
          
          <View style={styles.teamsContainer}>
            <View style={styles.teamSection}>
              <Text style={styles.teamName}>{match.homeTeam}</Text>
              <Text style={styles.score}>{match.homeScore}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.teamSection}>
              <Text style={styles.teamName}>{match.awayTeam}</Text>
              <Text style={styles.score}>{match.awayScore}</Text>
            </View>
          </View>

          <View style={styles.matchMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={16} color={colors.text.tertiary} />
              <Text style={styles.metaText}>{match.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color={colors.text.tertiary} />
              <Text style={styles.metaText}>{match.time}</Text>
            </View>
            <View style={[styles.statusBadge, styles.liveBadge]}>
              <Text style={styles.statusText}>Live</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard icon="eye" value={match.viewers} label="Viewers" />
          <StatCard icon="people" value={match.totalPlayers} label="Players" />
          <StatCard icon="flash" value={match.minutes} label="Minutes" />
        </View>

        {/* Match Info */}
        <View style={styles.matchInfoCard}>
          <Text style={styles.matchInfoTitle}>Match Info</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Competition</Text>
            <Text style={styles.infoValue}>{match.competition}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Venue</Text>
            <Text style={styles.infoValue}>{match.venue}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Attendance</Text>
            <Text style={styles.infoValue}>{match.attendance}</Text>
          </View>
        </View>

        {/* Starting XI */}
        <View style={styles.lineupSection}>
          {/* Team Tabs */}
          <View style={styles.teamTabs}>
            <TouchableOpacity
              style={[styles.teamTab, selectedTeam === 'home' && styles.teamTabActive]}
              onPress={() => setSelectedTeam('home')}
            >
              <Text style={[styles.teamTabText, selectedTeam === 'home' && styles.teamTabTextActive]}>
                {match.homeTeam}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.teamTab, selectedTeam === 'away' && styles.teamTabActive]}
              onPress={() => setSelectedTeam('away')}
            >
              <Text style={[styles.teamTabText, selectedTeam === 'away' && styles.teamTabTextActive]}>
                {match.awayTeam}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.lineupTitle}>Starting XI</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading players...</Text>
            </View>
          ) : (
            <View style={styles.playersGrid}>
              {(selectedTeam === 'home' ? homeTeamPlayers : awayTeamPlayers).map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onPress={() => {
                    router.push({
                      pathname: '/player/[id]',
                      params: { id: player.id.toString() },
                    });
                  }}
                />
              ))}
            </View>
          )}
        </View>

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
  header: {
    paddingTop: spacing.huge,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  headerTop: {
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
  shareButton: {
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
  matchImage: {
    width: '100%',
    height: 250,
  },
  infoCard: {
    backgroundColor: colors.background.card,
    margin: spacing.xxl,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  sportLabel: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  teamsContainer: {
    marginBottom: spacing.lg,
  },
  teamSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  teamName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  score: {
    fontSize: fontSize.huge,
    fontWeight: 'bold',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: spacing.sm,
  },
  matchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  liveBadge: {
    backgroundColor: colors.error.icon,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    ...shadows.medium,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  matchInfoCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  matchInfoTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.text.tertiary,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    fontWeight: '600',
  },
  lineupSection: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  lineupTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  playerCard: {
    width: '48%',
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  playerNumberBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  playerNumber: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  playerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  playerPosition: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  playerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.warning.icon,
  },
  teamTabs: {
    flexDirection: 'row',
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  teamTab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  teamTabActive: {
    backgroundColor: colors.primary,
  },
  teamTabText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  teamTabTextActive: {
    color: colors.text.primary,
  },
  bottomSpacer: {
    height: spacing.huge,
  },
});

export default MatchDetailScreen;
