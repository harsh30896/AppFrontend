import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { ChatMessage } from '../types';
import MessageBubble from '../components/chat/MessageBubble';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ChatDetailScreenProps {
  route: {
    params: {
      conversationId: string;
      conversationName?: string;
    };
  };
  navigation: any;
}

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ route, navigation }) => {
  const { conversationId, conversationName } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const {
    messages,
    loadMessages,
    sendMessage,
    markMessageAsRead,
    sendTypingIndicator,
    addReaction,
    isLoading,
  } = useChat();

  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadMessages(conversationId);
    navigation.setOptions({
      title: conversationName || 'Chat',
    });
  }, [conversationId]);

  useEffect(() => {
    // Mark messages as read when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      const conversationMessages = messages[conversationId] || [];
      conversationMessages.forEach(message => {
        if (!message.isRead && message.senderId !== user?.id) {
          markMessageAsRead(message.id);
        }
      });
    });

    return unsubscribe;
  }, [navigation, messages, conversationId, user?.id]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const message = messageText.trim();
    setMessageText('');
    
    try {
      await sendMessage(conversationId, message);
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Send message error:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      sendTypingIndicator(conversationId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        sendTypingIndicator(conversationId, false);
      }
    }, 1000);
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await addReaction(messageId, emoji);
    } catch (error) {
      console.error('Add reaction error:', error);
    }
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isOwn = item.senderId === user?.id;
    const prevMessage = index > 0 ? messages[conversationId][index - 1] : null;
    const showAvatar = !isOwn && (!prevMessage || prevMessage.senderId !== item.senderId);

    return (
      <MessageBubble
        message={item}
        isOwn={isOwn}
        showAvatar={showAvatar}
        showTime={true}
        onReaction={(emoji) => handleReaction(item.id, emoji)}
      />
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.typingIndicator, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>
          Someone is typing...
        </Text>
      </View>
    );
  };

  const conversationMessages = messages[conversationId] || [];

  if (isLoading && conversationMessages.length === 0) {
    return <LoadingSpinner text="Loading messages..." />;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ref={flatListRef}
        data={conversationMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        ListFooterComponent={renderTypingIndicator}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.inputWrapper, { backgroundColor: theme.colors.inputBackground }]}>
          <TextInput
            style={[styles.textInput, { color: theme.colors.text }]}
            value={messageText}
            onChangeText={handleTyping}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.placeholder}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={messageText.trim() ? theme.colors.text : theme.colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
  },
  typingIndicator: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default ChatDetailScreen;