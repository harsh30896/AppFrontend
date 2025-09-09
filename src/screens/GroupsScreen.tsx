import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useChat } from '../contexts/ChatContext';
import { Group } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';

const GroupsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { conversations, loadConversations, isLoading } = useChat();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const groups = conversations.filter(conv => conv.type === 'group') as Group[];

  const formatMemberCount = (group: Group) => {
    const count = group.members.length;
    return `${count} member${count !== 1 ? 's' : ''}`;
  };

  const renderGroupItem = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={[styles.groupItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => {/* Navigate to group chat */}}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.avatarText, { color: theme.colors.text }]}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={[styles.groupIndicator, { backgroundColor: theme.colors.secondary }]}>
          <Ionicons name="people" size={12} color={theme.colors.text} />
        </View>
      </View>

      <View style={styles.groupContent}>
        <Text style={[styles.groupName, { color: theme.colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.memberCount, { color: theme.colors.textSecondary }]}>
          {formatMemberCount(item)}
        </Text>
        {item.description && (
          <Text
            style={[styles.description, { color: theme.colors.textTertiary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}
      </View>

      <View style={styles.groupActions}>
        {item.isPinned && (
          <Ionicons name="pin" size={16} color={theme.colors.primary} />
        )}
        {item.isMuted && (
          <Ionicons name="volume-mute" size={16} color={theme.colors.textTertiary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={64} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No groups yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Create a group to start chatting with multiple people
      </Text>
      <Button
        title="Create Group"
        onPress={() => {/* Navigate to create group */}}
        variant="primary"
        style={styles.createButton}
      />
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner text="Loading groups..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberCount: {
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  groupActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 32,
  },
});

export default GroupsScreen;