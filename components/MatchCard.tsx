import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from '../constants/theme';

export interface MatchCardProps {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'live' | 'completed' | 'upcoming';
  date: string;
  time: string;
  image?: string;
  onPress?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  sport,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  date,
  time,
  image,
  onPress,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'live':
        return (
          <View style={[styles.statusBadge, styles.liveBadge]}>
            <Text style={styles.badgeText}>Live</Text>
          </View>
        );
      case 'completed':
        return (
          <View style={[styles.statusBadge, styles.completedBadge]}>
            <Text style={styles.badgeText}>Completed</Text>
          </View>
        );
      case 'upcoming':
        return (
          <View style={[styles.statusBadge, styles.upcomingBadge]}>
            <Text style={styles.badgeText}>Upcoming</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Match Image */}
      {image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.matchImage}
            resizeMode="cover"
          />
          {getStatusBadge()}
        </View>
      )}

      {/* Match Content */}
      <View style={styles.content}>
        {/* Sport Label */}
        <Text style={styles.sportLabel}>{sport.toUpperCase()}</Text>

        {/* Teams Container */}
        <View style={styles.teamsContainer}>
          {/* Home Team */}
          <View style={styles.teamRow}>
            <Text style={styles.teamName} numberOfLines={1}>
              {homeTeam}
            </Text>
            {homeScore !== undefined && (
              <Text style={styles.score}>{homeScore}</Text>
            )}
          </View>

          {/* Away Team */}
          <View style={styles.teamRow}>
            <Text style={styles.teamName} numberOfLines={1}>
              {awayTeam}
            </Text>
            {awayScore !== undefined && (
              <Text style={styles.score}>{awayScore}</Text>
            )}
          </View>
        </View>

        {/* Match Footer - Date & Time */}
        <View style={styles.footer}>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...shadows.medium,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  matchImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
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
  badgeText: {
    color: colors.text.primary,
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  content: {
    padding: spacing.lg,
  },
  sportLabel: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
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
    marginRight: spacing.md,
  },
  score: {
    fontSize: fontSize.xl,
    color: colors.text.primary,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  dateText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  timeText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
});

export default MatchCard;
