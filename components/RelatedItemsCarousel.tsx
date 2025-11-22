import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { borderRadius, colors, fontSize, shadows, spacing } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_MARGIN = spacing.md;

interface RelatedItem {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  status?: 'live' | 'completed' | 'upcoming';
  date?: string;
  time?: string;
}

interface RelatedItemsCarouselProps {
  items: RelatedItem[];
  title?: string;
  onItemPress?: (id: string) => void;
}

const RelatedItemsCarousel: React.FC<RelatedItemsCarouselProps> = ({
  items,
  title = 'Related Matches',
  onItemPress,
}) => {
  const router = useRouter();

  const getStatusBadgeStyle = (status?: string) => {
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

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'live':
        return 'Live';
      case 'completed':
        return 'FT';
      case 'upcoming':
        return 'Upcoming';
      default:
        return '';
    }
  };

  const handleItemPress = (id: string) => {
    if (onItemPress) {
      onItemPress(id);
    } else {
      router.push({
        pathname: '/match/[id]',
        params: { id },
      });
    }
  };

  const renderItem = ({ item }: { item: RelatedItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleItemPress(item.id)}
      activeOpacity={0.9}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="image-outline" size={40} color={colors.text.tertiary} />
        </View>
      )}

      {item.status && (
        <View style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      )}

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>

        {(item.date || item.time) && (
          <View style={styles.metaContainer}>
            {item.date && (
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
                <Text style={styles.metaText}>{item.date}</Text>
              </View>
            )}
            {item.time && (
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={14} color={colors.text.tertiary} />
                <Text style={styles.metaText}>{item.time}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="list-outline" size={48} color={colors.text.tertiary} />
      <Text style={styles.emptyText}>No related items available</Text>
    </View>
  );

  if (!items || items.length === 0) {
    return (
      <View style={styles.container}>
        {title && (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
        {renderEmptyComponent()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.itemCount}>({items.length})</Text>
        </View>
      )}

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  itemCount: {
    fontSize: fontSize.md,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginHorizontal: CARD_MARGIN,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.background.dark,
  },
  placeholderImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.background.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
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
  statusText: {
    color: colors.text.primary,
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
});

export default RelatedItemsCarousel;
