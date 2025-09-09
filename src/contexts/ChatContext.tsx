import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import chatService from '../services/chatService';
import { ChatMessage, Conversation, Group, User } from '../types';

interface ChatContextType {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversation: string | null;
  typingUsers: Record<string, string[]>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, messageType?: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO') => Promise<void>;
  createGroup: (groupData: { name: string; description?: string; members: string[]; avatar?: string }) => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
  markMessageAsRead: (messageId: string) => Promise<void>;
  sendTypingIndicator: (conversationId: string, isTyping: boolean) => void;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  
  // Real-time handlers
  onNewMessage: (handler: (message: ChatMessage) => void) => void;
  onMessageRead: (handler: (data: { messageId: string; userId: string }) => void) => void;
  onTypingStart: (handler: (data: { conversationId: string; userId: string; username: string }) => void) => void;
  onTypingStop: (handler: (data: { conversationId: string; userId: string }) => void) => void;
  onUserOnline: (handler: (data: { userId: string }) => void) => void;
  onUserOffline: (handler: (data: { userId: string }) => void) => void;
  
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize chat only after a token is available; otherwise skip silently
    (async () => {
      try {
        await chatService.initializeWebSocket();
        await loadConversations();
        setupWebSocketHandlers();
      } catch (error) {
        console.error('WebSocket initialization error:', error);
        // Do not set global error to avoid breaking screens when unauthenticated
      }
    })();
    return () => {
      chatService.closeWebSocket();
    };
  }, []);

  // removed eager initializeChat to avoid auth-token errors before login

  const setupWebSocketHandlers = () => {
    chatService.onMessage('newMessage', (message: ChatMessage) => {
      setMessages(prev => ({
        ...prev,
        [message.conversationId]: [
          ...(prev[message.conversationId] || []),
          message,
        ],
      }));
      
      // Update conversation last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === message.conversationId 
            ? { ...conv, lastMessage: message, lastActivity: message.timestamp }
            : conv
        )
      );
    });

    chatService.onMessage('messageRead', (data: { messageId: string; userId: string }) => {
      setMessages(prev => {
        const conversationMessages = prev[activeConversation || ''];
        if (!conversationMessages) return prev;

        return {
          ...prev,
          [activeConversation || '']: conversationMessages.map(msg =>
            msg.id === data.messageId ? { ...msg, isRead: true } : msg
          ),
        };
      });
    });

    chatService.onMessage('typingStart', (data: { conversationId: string; userId: string; username: string }) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.conversationId]: [
          ...(prev[data.conversationId] || []).filter(id => id !== data.userId),
          data.userId,
        ],
      }));
    });

    chatService.onMessage('typingStop', (data: { conversationId: string; userId: string }) => {
      setTypingUsers(prev => ({
        ...prev,
        [data.conversationId]: (prev[data.conversationId] || []).filter(id => id !== data.userId),
      }));
    });

    chatService.onMessage('userOnline', (data: { userId: string }) => {
      // Handle user online status
      console.log('User online:', data.userId);
    });

    chatService.onMessage('userOffline', (data: { userId: string }) => {
      // Handle user offline status
      console.log('User offline:', data.userId);
    });
  };

  const loadConversations = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const convs = await chatService.getConversations();
      setConversations(convs);
    } catch (error) {
      console.error('Load conversations error:', error);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await chatService.getMessages(conversationId);
      setMessages(prev => ({
        ...prev,
        [conversationId]: response.data,
      }));
    } catch (error) {
      console.error('Load messages error:', error);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (
    conversationId: string, 
    content: string, 
    messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO' = 'TEXT'
  ): Promise<void> => {
    try {
      const message = await chatService.sendMessage({
        conversationId,
        content,
        messageType,
      });

      // Add message to local state immediately for better UX
      setMessages(prev => ({
        ...prev,
        [conversationId]: [
          ...(prev[conversationId] || []),
          message,
        ],
      }));

      // Update conversation last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, lastMessage: message, lastActivity: message.timestamp }
            : conv
        )
      );
    } catch (error) {
      console.error('Send message error:', error);
      setError('Failed to send message');
    }
  };

  const createGroup = async (groupData: {
    name: string;
    description?: string;
    members: string[];
    avatar?: string;
  }): Promise<void> => {
    try {
      setIsLoading(true);
      const group = await chatService.createGroup(groupData);
      setConversations(prev => [group, ...prev]);
    } catch (error) {
      console.error('Create group error:', error);
      setError('Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  const markMessageAsRead = async (messageId: string): Promise<void> => {
    try {
      await chatService.markMessageAsRead(messageId);
      setMessages(prev => {
        const conversationMessages = prev[activeConversation || ''];
        if (!conversationMessages) return prev;

        return {
          ...prev,
          [activeConversation || '']: conversationMessages.map(msg =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          ),
        };
      });
    } catch (error) {
      console.error('Mark message as read error:', error);
    }
  };

  const sendTypingIndicator = (conversationId: string, isTyping: boolean): void => {
    chatService.sendTypingIndicator(conversationId, isTyping);
  };

  const addReaction = async (messageId: string, emoji: string): Promise<void> => {
    try {
      const reaction = await chatService.addReaction(messageId, emoji);
      
      // Update message with new reaction
      setMessages(prev => {
        const updatedMessages = { ...prev };
        Object.keys(updatedMessages).forEach(convId => {
          updatedMessages[convId] = updatedMessages[convId].map(msg =>
            msg.id === messageId
              ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
              : msg
          );
        });
        return updatedMessages;
      });
    } catch (error) {
      console.error('Add reaction error:', error);
      setError('Failed to add reaction');
    }
  };

  const deleteMessage = async (messageId: string): Promise<void> => {
    try {
      await chatService.deleteMessage(messageId);
      
      // Remove message from local state
      setMessages(prev => {
        const updatedMessages = { ...prev };
        Object.keys(updatedMessages).forEach(convId => {
          updatedMessages[convId] = updatedMessages[convId].filter(msg => msg.id !== messageId);
        });
        return updatedMessages;
      });
    } catch (error) {
      console.error('Delete message error:', error);
      setError('Failed to delete message');
    }
  };

  const editMessage = async (messageId: string, newContent: string): Promise<void> => {
    try {
      const updatedMessage = await chatService.editMessage(messageId, newContent);
      
      // Update message in local state
      setMessages(prev => {
        const updatedMessages = { ...prev };
        Object.keys(updatedMessages).forEach(convId => {
          updatedMessages[convId] = updatedMessages[convId].map(msg =>
            msg.id === messageId ? updatedMessage : msg
          );
        });
        return updatedMessages;
      });
    } catch (error) {
      console.error('Edit message error:', error);
      setError('Failed to edit message');
    }
  };

  const onNewMessage = (handler: (message: ChatMessage) => void): void => {
    chatService.onMessage('newMessage', handler);
  };

  const onMessageRead = (handler: (data: { messageId: string; userId: string }) => void): void => {
    chatService.onMessage('messageRead', handler);
  };

  const onTypingStart = (handler: (data: { conversationId: string; userId: string; username: string }) => void): void => {
    chatService.onMessage('typingStart', handler);
  };

  const onTypingStop = (handler: (data: { conversationId: string; userId: string }) => void): void => {
    chatService.onMessage('typingStop', handler);
  };

  const onUserOnline = (handler: (data: { userId: string }) => void): void => {
    chatService.onMessage('userOnline', handler);
  };

  const onUserOffline = (handler: (data: { userId: string }) => void): void => {
    chatService.onMessage('userOffline', handler);
  };

  const clearError = (): void => {
    setError(null);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        activeConversation,
        typingUsers,
        isLoading,
        error,
        loadConversations,
        loadMessages,
        sendMessage,
        createGroup,
        setActiveConversation,
        markMessageAsRead,
        sendTypingIndicator,
        addReaction,
        deleteMessage,
        editMessage,
        onNewMessage,
        onMessageRead,
        onTypingStart,
        onTypingStop,
        onUserOnline,
        onUserOffline,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
