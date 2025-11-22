import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { borderRadius, colors, spacing } from '../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius: customBorderRadius = borderRadius.md,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: customBorderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const DetailScreenSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={borderRadius.md} />
        <Skeleton width={120} height={24} />
        <Skeleton width={40} height={40} borderRadius={borderRadius.md} />
      </View>

      {/* Hero Image Skeleton */}
      <Skeleton width="100%" height={300} borderRadius={0} style={styles.heroSkeleton} />

      {/* Match Info Card Skeleton */}
      <View style={styles.matchInfoCard}>
        <Skeleton width={80} height={16} style={{ marginBottom: spacing.lg }} />
        
        {/* Teams */}
        <View style={styles.teamRow}>
          <Skeleton width="70%" height={28} />
          <Skeleton width={60} height={40} />
        </View>
        <View style={styles.vsContainer}>
          <Skeleton width={40} height={20} />
        </View>
        <View style={styles.teamRow}>
          <Skeleton width="65%" height={28} />
          <Skeleton width={60} height={40} />
        </View>

        {/* Meta Info */}
        <View style={styles.metaContainer}>
          <Skeleton width={100} height={16} />
          <Skeleton width={80} height={16} />
        </View>
      </View>

      {/* Statistics Section Skeleton */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Skeleton width={24} height={24} borderRadius={borderRadius.sm} />
          <Skeleton width={140} height={20} style={{ marginLeft: spacing.md }} />
        </View>

        <View style={styles.statsGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={item} style={styles.statItem}>
              <Skeleton width={24} height={24} borderRadius={borderRadius.sm} />
              <Skeleton width={40} height={24} style={{ marginTop: spacing.sm }} />
              <Skeleton width={60} height={14} style={{ marginTop: spacing.xs }} />
            </View>
          ))}
        </View>
      </View>

      {/* Description Section Skeleton */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Skeleton width={24} height={24} borderRadius={borderRadius.sm} />
          <Skeleton width={160} height={20} style={{ marginLeft: spacing.md }} />
        </View>
        <Skeleton width="100%" height={16} style={{ marginBottom: spacing.sm }} />
        <Skeleton width="95%" height={16} style={{ marginBottom: spacing.sm }} />
        <Skeleton width="85%" height={16} />
      </View>

      {/* Additional Info Section Skeleton */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Skeleton width={24} height={24} borderRadius={borderRadius.sm} />
          <Skeleton width={130} height={20} style={{ marginLeft: spacing.md }} />
        </View>
        
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.infoRow}>
            <Skeleton width={100} height={16} />
            <Skeleton width={120} height={16} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.background.dark,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.huge,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  heroSkeleton: {
    marginBottom: -spacing.xxl,
  },
  matchInfoCard: {
    backgroundColor: colors.background.card,
    margin: spacing.xxl,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  vsContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    marginTop: spacing.lg,
  },
  sectionCard: {
    backgroundColor: colors.background.card,
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
});

export default DetailScreenSkeleton;
