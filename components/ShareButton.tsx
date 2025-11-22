import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Platform, Share, StyleSheet, TouchableOpacity } from 'react-native';
import { borderRadius, colors } from '../constants/theme';

interface ShareButtonProps {
  title: string;
  message: string;
  url?: string;
  size?: number;
  iconColor?: string;
  backgroundColor?: string;
  style?: any;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  message,
  url,
  size = 24,
  iconColor = colors.text.primary,
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  style,
}) => {
  const handleShare = async () => {
    try {
      const shareOptions: any = {
        title,
        message: url ? `${message}\n${url}` : message,
      };

      // Add URL separately for iOS
      if (Platform.OS === 'ios' && url) {
        shareOptions.url = url;
      }

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared via activity type (iOS)
          console.log('Shared via:', result.activityType);
        } else {
          // Shared successfully (Android)
          console.log('Content shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Share dialog dismissed
        console.log('Share dismissed');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to share content. Please try again.');
      console.error('Share error:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.shareButton, { backgroundColor }, style]}
      onPress={handleShare}
      activeOpacity={0.7}
    >
      <Ionicons name="share-outline" size={size} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShareButton;
