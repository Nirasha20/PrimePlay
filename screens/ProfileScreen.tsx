import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import { borderRadius, colors, fontSize, shadows, spacing } from '../constants/theme';

interface ProfileOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.optionCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.optionLeft}>
      <View style={styles.optionIconContainer}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={colors.background.gradient} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john@example.com</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <ProfileOption
            icon="person-outline"
            title="Personal Information"
            subtitle="Update your details"
            onPress={() => {}}
          />
          <ProfileOption
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your notifications"
            onPress={() => {}}
          />
          <ProfileOption
            icon="lock-closed-outline"
            title="Privacy & Security"
            subtitle="Password and security settings"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <ProfileOption
            icon="language-outline"
            title="Language"
            subtitle="English"
            onPress={() => {}}
          />
          <ProfileOption
            icon="moon-outline"
            title="Theme"
            subtitle="Dark mode"
            onPress={() => {}}
          />
          <ProfileOption
            icon="location-outline"
            title="Location"
            subtitle="Automatic"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <ProfileOption
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => {}}
          />
          <ProfileOption
            icon="information-circle-outline"
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => {}}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error.icon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomTabBar />
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
    paddingBottom: spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  avatarText: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  optionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xxl,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error.icon,
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.error.icon,
    marginLeft: spacing.sm,
  },
  bottomSpacer: {
    height: 100,
  },
});

export default ProfileScreen;
