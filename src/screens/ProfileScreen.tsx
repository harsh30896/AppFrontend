import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, logout, updateProfile } = useAuth();
  const { conversations } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing will be implemented soon.');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings will be implemented soon.');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings will be implemented soon.');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy', 'Privacy settings will be implemented soon.');
  };

  const handleHelp = () => {
    Alert.alert('Help', 'Help center will be implemented soon.');
  };

  const renderProfileItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    showArrow = true
  ) => (
    <TouchableOpacity
      style={[styles.profileItem, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.profileItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
          <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.profileItemContent}>
          <Text style={[styles.profileItemTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.profileItemSubtitle, { color: theme.colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
      )}
    </TouchableOpacity>
  );

  if (!user) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  const totalConversations = conversations.length;
  const groupConversations = conversations.filter(conv => conv.type === 'group').length;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={[styles.avatarText, { color: theme.colors.text }]}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.editAvatarButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleEditProfile}
          >
            <Ionicons name="camera" size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.username, { color: theme.colors.text }]}>
          {user.username}
        </Text>
        <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
          {user.email}
        </Text>
        {user.firstName && user.lastName && (
          <Text style={[styles.fullName, { color: theme.colors.textTertiary }]}>
            {user.firstName} {user.lastName}
          </Text>
        )}

        <Button
          title="Edit Profile"
          onPress={handleEditProfile}
          variant="secondary"
          size="small"
          style={styles.editButton}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
            {totalConversations}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Conversations
          </Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>
            {groupConversations}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Groups
          </Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.statNumber, { color: theme.colors.accent }]}>
            {user.status === 'online' ? 'Online' : 'Offline'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Status
          </Text>
        </View>
      </View>

      {/* Profile Options */}
      <View style={styles.optionsContainer}>
        {renderProfileItem('settings-outline', 'Settings', 'App preferences', handleSettings)}
        {renderProfileItem('notifications-outline', 'Notifications', 'Manage notifications', handleNotifications)}
        {renderProfileItem('shield-outline', 'Privacy', 'Privacy & security', handlePrivacy)}
        {renderProfileItem('help-circle-outline', 'Help & Support', 'Get help', handleHelp)}
        {renderProfileItem('log-out-outline', 'Logout', 'Sign out of your account', handleLogout, false)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 4,
  },
  fullName: {
    fontSize: 14,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  optionsContainer: {
    margin: 16,
    gap: 8,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileItemSubtitle: {
    fontSize: 14,
  },
});

export default ProfileScreen;