import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageBubbleProps } from '../../types';

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = false,
  showTime = true,
  onPress,
  onLongPress,
  onReaction,
}) => {
  const { theme } = useTheme();
  const [showReactions, setShowReactions] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    } else {
      setShowReactions(true);
    }
  };

  const handleReaction = (emoji: string) => {
    if (onReaction) {
      onReaction(emoji);
    }
    setShowReactions(false);
  };

  const getBubbleStyle = () => {
    const baseStyle = {
      maxWidth: '80%',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 18,
      marginVertical: 2,
    };

    if (isOwn) {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.messageSent,
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: theme.colors.messageReceived,
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
      };
    }
  };

  const getTextStyle = () => {
    return {
      color: theme.colors.messageText,
      fontSize: 16,
      lineHeight: 20,
    };
  };

  const getTimeStyle = () => {
    return {
      color: theme.colors.messageTime,
      fontSize: 12,
      marginTop: 4,
      alignSelf: isOwn ? 'flex-end' : 'flex-start',
    };
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    return (
      <View style={[styles.reactions, isOwn ? styles.reactionsRight : styles.reactionsLeft]}>
        {message.reactions.map((reaction, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.reaction, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleReaction(reaction.emoji)}
          >
            <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
            <Text style={[styles.reactionCount, { color: theme.colors.textSecondary }]}>
              {reaction.userId}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReactionPicker = () => {
    if (!showReactions) return null;

    const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

    return (
      <View style={[styles.reactionPicker, isOwn ? styles.reactionPickerRight : styles.reactionPickerLeft]}>
        {reactions.map((emoji, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.reactionButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleReaction(emoji)}
          >
            <Text style={styles.reactionEmoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, isOwn ? styles.containerRight : styles.containerLeft]}>
      <Pressable
        onPress={onPress}
        onLongPress={handleLongPress}
        style={getBubbleStyle()}
        android_ripple={{ color: theme.colors.primary + '20' }}
      >
        <Text style={getTextStyle()}>{message.content}</Text>
        
        {message.isEdited && (
          <Text style={[styles.editedText, { color: theme.colors.textTertiary }]}>
            (edited)
          </Text>
        )}
        
        {showTime && (
          <Text style={getTimeStyle()}>
            {formatTime(message.timestamp)}
          </Text>
        )}
      </Pressable>

      {renderReactions()}
      {renderReactionPicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 2,
  },
  containerRight: {
    alignItems: 'flex-end',
  },
  containerLeft: {
    alignItems: 'flex-start',
  },
  editedText: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 2,
  },
  reactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  reactionsRight: {
    justifyContent: 'flex-end',
  },
  reactionsLeft: {
    justifyContent: 'flex-start',
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 10,
    fontWeight: '600',
  },
  reactionPicker: {
    position: 'absolute',
    top: -40,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  reactionPickerRight: {
    right: 0,
  },
  reactionPickerLeft: {
    left: 0,
  },
  reactionButton: {
    padding: 8,
    borderRadius: 16,
  },
});

export default MessageBubble;
