import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { shadows } from '../constants/theme';
import { useThemedColors } from '../hooks/useThemedColors';

interface TabItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const TABS: TabItem[] = [
  {
    name: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
    route: '/home',
  },
  {
    name: 'Favorites',
    icon: 'heart-outline',
    activeIcon: 'heart',
    route: '/favorites',
  },
  {
    name: 'Profile',
    icon: 'person-outline',
    activeIcon: 'person',
    route: '/profile',
  },
];

const BottomTabBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const colors = useThemedColors();
  const styles = createStyles(colors);

  const isActive = (route: string) => {
    return pathname === route;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map((tab, index) => {
          const active = isActive(tab.route);
          return (
            <TouchableOpacity
              key={index}
              style={styles.tabButton}
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, active && styles.activeIconContainer]}>
                <Ionicons
                  name={active ? tab.activeIcon : tab.icon}
                  size={26}
                  color={active ? colors.primary : colors.text.tertiary}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useThemedColors>) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    paddingBottom: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    ...shadows.medium,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
  },
});

export default BottomTabBar;
