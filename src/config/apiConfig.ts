/**
 * API Configuration for the Hive Chat App
 * This file centralizes all API endpoint configurations
 */

// Determine the appropriate base URL based on the platform and environment
export const getBaseUrl = () => {
  // For development environment
  if (__DEV__) {
    // Prefer LAN IP when running on a physical device via Expo Go
    // Update this to your machine's LAN IP if it changes
    const LAN_IP = 'http://192.168.1.12:8080';
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      return LAN_IP;
    }
    // For web or simulator on the same machine
    return 'http://localhost:8080';
  }
  
  // For production environment
  return 'https://api.hiveapp.com'; // Replace with your actual production API URL
};

// Import Platform for OS-specific logic
import { Platform } from 'react-native';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  
  // User endpoints
  USER: {
    ME: '/api/users/me',
    PROFILE: (userId: string) => `/api/users/${userId}/profile`,
    SEARCH: '/api/users/search',
    ALL: '/api/users',
    CHANGE_PASSWORD: '/api/users/password',
    NOTIFICATION_SETTINGS: '/api/users/notification-settings',
  },
  
  // Chat endpoints
  CHAT: {
    SEND: '/api/chat/send',
    GROUPS: '/api/chat/groups',
    ADD_MEMBER: (groupId: string) => `/api/chat/groups/${groupId}/members`,
    REMOVE_MEMBER: (groupId: string, userId: string) => `/api/chat/groups/${groupId}/members/${userId}`,
    TYPING: '/api/chat/typing',
    MESSAGES: (messageId: string) => `/api/chat/messages/${messageId}`,
    CONVERSATIONS: (conversationId: string) => `/api/chat/conversations/${conversationId}`,
  },
  
  // Notification endpoints
  NOTIFICATION: {
    REGISTER_DEVICE: '/api/notifications/devices',
    SETTINGS: '/api/notifications/settings',
  },
  
  // WebSocket endpoint
  WEBSOCKET: {
    ENDPOINT: '/ws',
  },
};

// Full URLs (with base URL)
export const getFullUrl = (endpoint: string) => {
  return `${getBaseUrl()}${endpoint}`;
};

// WebSocket URL
export const getWebSocketUrl = () => {
  return `${getBaseUrl()}${API_ENDPOINTS.WEBSOCKET.ENDPOINT}`;
};

export default {
  getBaseUrl,
  API_ENDPOINTS,
  getFullUrl,
  getWebSocketUrl,
};
