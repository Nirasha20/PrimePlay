import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, fontSize, shadows, spacing } from '../constants/theme';
import { Player } from '../redux/slices/playersSlice';

interface PlayerCardProps {
  player: Player;
  onPress: () => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onPress }) => {
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

  const getPositionIcon = (position: string): keyof typeof Ionicons.glyphMap => {
    switch (position.toLowerCase()) {
      case 'forward':
        return 'flash';
      case 'midfielder':
        return 'shield';
      case 'defender':
        return 'alert-circle';
      case 'goalkeeper':
        return 'hand-left';
      default:
        return 'person';
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        {/* Player Image */}
        <View style={styles.imageContainer}>
          {player.image ? (
            <Image source={{ uri: player.image }} style={styles.playerImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={40} color={colors.text.tertiary} />
            </View>
          )}
          <View
            style={[
              styles.ratingBadge,
              { backgroundColor: getPositionColor(player.position) },
            ]}
          >
            <Ionicons name="star" size={12} color={colors.text.primary} />
            <Text style={styles.ratingText}>{player.rating}</Text>
          </View>
        </View>

        {/* Player Info */}
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.playerName} numberOfLines={1}>
              {player.name}
            </Text>
            <View style={styles.jerseyBadge}>
              <Text style={styles.jerseyNumber}>#{player.jerseyNumber}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View
              style={[
                styles.positionBadge,
                { backgroundColor: getPositionColor(player.position) + '20' },
              ]}
            >
              <Ionicons
                name={getPositionIcon(player.position)}
                size={14}
                color={getPositionColor(player.position)}
              />
              <Text
                style={[styles.positionText, { color: getPositionColor(player.position) }]}
              >
                {player.position}
              </Text>
            </View>
          </View>

          <View style={styles.teamRow}>
            <Ionicons name="shield" size={16} color={colors.text.tertiary} />
            <Text style={styles.teamText} numberOfLines={1}>
              {player.team}
            </Text>
          </View>

          {/* Stats Preview */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.appearances}</Text>
              <Text style={styles.statLabel}>Apps</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.goals}</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.assists}</Text>
              <Text style={styles.statLabel}>Assists</Text>
            </View>
          </View>
        </View>
      </View>

      {/* View Details Arrow */}
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardContent: {
    flexDirection: 'row',
    padding: spacing.lg,
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.dark,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  ratingText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  playerName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  jerseyBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  jerseyNumber: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  positionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  positionText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  teamText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.dark + '80',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border.default,
  },
  arrowContainer: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
  },
});

export default PlayerCard;
