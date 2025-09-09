/**
 * API Configuration for the Hive Chat App
 * This file centralizes all API endpoint configurations
 */

// Determine the appropriate base URL based on the platform and environment
export const getBaseUrl = () => {
  // For development environment
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // In Replit environment, use the public domain
    const replitDomain = process.env.REPL_SLUG && process.env.REPL_OWNER 
      ? `https://${process.env.REPL_SLUG}-${process.env.REPL_OWNER}.replit.app`
      : window.location.origin;
    
    if (Platform.OS === 'web') {
      // For web in development, use the current domain with backend port
      return replitDomain.replace(':5000', ':8080'); // Assuming backend runs on 8080
    }
    
    // For mobile apps in development
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
