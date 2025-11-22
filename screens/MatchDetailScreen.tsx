import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { borderRadius, colors, fontSize, shadows, spacing } from '../constants/theme';

const MatchDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // TODO: Fetch match details using the id
  // For now, using placeholder data
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
    image: 'https://example.com/image.jpg',
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

        {/* Additional Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Match Statistics</Text>
          <Text style={styles.comingSoon}>Coming soon...</Text>
        </View>
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
  detailsSection: {
    padding: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  comingSoon: {
    fontSize: fontSize.md,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: spacing.huge,
  },
});

export default MatchDetailScreen;
