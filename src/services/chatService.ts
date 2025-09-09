/**
 * Enhanced Chat Service
 * Handles real-time messaging with WebSocket support
 */

import { API_ENDPOINTS, getFullUrl, getWebSocketUrl } from '../config/apiConfig';
import authService from './authService';
import { 
  ChatMessage, 
  Conversation, 
  Group, 
  MessageReaction, 
  Attachment,
  ApiResponse,
  PaginatedResponse 
} from '../types';

class ChatService {
  private baseUrl: string;
  private wsUrl: string;
  private websocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Map<string, (message: any) => void> = new Map();

  constructor() {
    this.baseUrl = getFullUrl(API_ENDPOINTS.CHAT.SEND).replace(API_ENDPOINTS.CHAT.SEND, '');
    this.wsUrl = getWebSocketUrl();
  }

  /**
   * Initialize WebSocket connection
   */
  async initializeWebSocket(): Promise<void> {
    try {
      const token = await authService.getCurrentToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const wsUrl = `${this.wsUrl}?token=${token}`;
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.websocket.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      throw error;
    }
  }

  /**
   * Close WebSocket connection
   */
  closeWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  /**
   * Attempt to reconnect WebSocket
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect WebSocket (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.initializeWebSocket();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(data: any): void {
    const { type, payload } = data;

    switch (type) {
      case 'NEW_MESSAGE':
        this.notifyHandlers('newMessage', payload);
        break;
      case 'MESSAGE_READ':
        this.notifyHandlers('messageRead', payload);
        break;
      case 'TYPING_START':
        this.notifyHandlers('typingStart', payload);
        break;
      case 'TYPING_STOP':
        this.notifyHandlers('typingStop', payload);
        break;
      case 'USER_ONLINE':
        this.notifyHandlers('userOnline', payload);
        break;
      case 'USER_OFFLINE':
        this.notifyHandlers('userOffline', payload);
        break;
      case 'MESSAGE_REACTION':
        this.notifyHandlers('messageReaction', payload);
        break;
      default:
        console.log('Unknown WebSocket message type:', type);
    }
  }

  /**
   * Register message handler
   */
  onMessage(type: string, handler: (message: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Remove message handler
   */
  offMessage(type: string): void {
    this.messageHandlers.delete(type);
  }

  /**
   * Notify handlers of message
   */
  private notifyHandlers(type: string, payload: any): void {
    const handler = this.messageHandlers.get(type);
    if (handler) {
      handler(payload);
    }
  }

  /**
   * Send message
   */
  async sendMessage(messageData: {
    conversationId: string;
    content: string;
    messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
    replyTo?: string;
    attachments?: Attachment[];
  }): Promise<ChatMessage> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.CHAT.SEND), {
        method: 'POST',
        headers,
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      return data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  /**
   * Get messages for conversation
   */
  async getMessages(
    conversationId: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<PaginatedResponse<ChatMessage>> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(
        `${getFullUrl(API_ENDPOINTS.CHAT.CONVERSATIONS(conversationId))}/messages?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get messages');
      }

      return data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  /**
   * Get all conversations
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.CHAT.GROUPS), {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get conversations');
      }

      return data;
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  }

  /**
   * Create group
   */
  async createGroup(groupData: {
    name: string;
    description?: string;
    members: string[];
    avatar?: string;
  }): Promise<Group> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.CHAT.GROUPS), {
        method: 'POST',
        headers,
        body: JSON.stringify(groupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create group');
      }

      return data;
    } catch (error) {
      console.error('Create group error:', error);
      throw error;
    }
  }

  /**
   * Add member to group
   */
  async addMemberToGroup(groupId: string, userId: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.CHAT.ADD_MEMBER(groupId)), {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add member to group');
      }
    } catch (error) {
      console.error('Add member to group error:', error);
      throw error;
    }
  }

  /**
   * Remove member from group
   */
  async removeMemberFromGroup(groupId: string, userId: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.CHAT.REMOVE_MEMBER(groupId, userId)), {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove member from group');
      }
    } catch (error) {
      console.error('Remove member from group error:', error);
      throw error;
    }
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.CHAT.MESSAGES(messageId)), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to mark message as read');
      }
    } catch (error) {
      console.error('Mark message as read error:', error);
      throw error;
    }
  }

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(conversationId: string, isTyping: boolean): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      await fetch(getFullUrl(API_ENDPOINTS.CHAT.TYPING), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          conversationId,
          isTyping,
        }),
      });
    } catch (error) {
      console.error('Send typing indicator error:', error);
    }
  }

  /**
   * Add reaction to message
   */
  async addReaction(messageId: string, emoji: string): Promise<MessageReaction> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(`${getFullUrl(API_ENDPOINTS.CHAT.MESSAGES(messageId))}/reactions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ emoji }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add reaction');
      }

      return data;
    } catch (error) {
      console.error('Add reaction error:', error);
      throw error;
    }
  }

  /**
   * Remove reaction from message
   */
  async removeReaction(messageId: string, reactionId: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(`${getFullUrl(API_ENDPOINTS.CHAT.MESSAGES(messageId))}/reactions/${reactionId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove reaction');
      }
    } catch (error) {
      console.error('Remove reaction error:', error);
      throw error;
    }
  }

  /**
   * Delete message
   */
  async deleteMessage(messageId: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.CHAT.MESSAGES(messageId)), {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }

  /**
   * Edit message
   */
  async editMessage(messageId: string, newContent: string): Promise<ChatMessage> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.CHAT.MESSAGES(messageId)), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ content: newContent }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to edit message');
      }

      return data;
    } catch (error) {
      console.error('Edit message error:', error);
      throw error;
    }
  }

  /**
   * Upload file attachment
   */
  async uploadAttachment(fileUri: string, type: 'image' | 'file' | 'audio' | 'video'): Promise<Attachment> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: this.getMimeType(fileUri, type),
        name: this.getFileName(fileUri),
      } as any);

      const response = await fetch(`${this.baseUrl}/api/chat/upload`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload attachment');
      }

      return data;
    } catch (error) {
      console.error('Upload attachment error:', error);
      throw error;
    }
  }

  /**
   * Get MIME type for file
   */
  private getMimeType(uri: string, type: string): string {
    const extension = uri.split('.').pop()?.toLowerCase();
    
    switch (type) {
      case 'image':
        return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
      case 'video':
        return `video/${extension}`;
      case 'audio':
        return `audio/${extension}`;
      default:
        return 'application/octet-stream';
    }
  }

  /**
   * Get file name from URI
   */
  private getFileName(uri: string): string {
    return uri.split('/').pop() || 'file';
  }
}

export default new ChatService();