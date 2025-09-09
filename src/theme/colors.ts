export const colors = {
  // Dark theme colors
  dark: {
    primary: '#6366f1', // Indigo
    primaryDark: '#4f46e5',
    secondary: '#8b5cf6', // Purple
    accent: '#06b6d4', // Cyan
    
    background: '#0f0f23', // Very dark blue
    surface: '#1a1a2e', // Dark blue
    surfaceVariant: '#16213e', // Slightly lighter dark blue
    card: '#1e293b', // Dark slate
    
    text: '#f8fafc', // Almost white
    textSecondary: '#cbd5e1', // Light gray
    textTertiary: '#94a3b8', // Medium gray
    textDisabled: '#64748b', // Dark gray
    
    border: '#334155', // Dark border
    borderLight: '#475569', // Lighter border
    
    success: '#10b981', // Green
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    info: '#3b82f6', // Blue
    
    // Chat specific colors
    messageSent: '#6366f1', // Primary color for sent messages
    messageReceived: '#374151', // Dark gray for received messages
    messageText: '#f8fafc',
    messageTime: '#94a3b8',
    
    // Status colors
    online: '#10b981',
    offline: '#6b7280',
    away: '#f59e0b',
    busy: '#ef4444',
    
    // Input colors
    inputBackground: '#1e293b',
    inputBorder: '#334155',
    inputFocus: '#6366f1',
    placeholder: '#64748b',
    
    // Button colors
    buttonPrimary: '#6366f1',
    buttonSecondary: '#374151',
    buttonDanger: '#ef4444',
    buttonSuccess: '#10b981',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    modalBackground: 'rgba(0, 0, 0, 0.9)',
  },
  
  // Light theme colors (for reference, but we'll primarily use dark)
  light: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceVariant: '#f1f5f9',
    card: '#ffffff',
    
    text: '#1e293b',
    textSecondary: '#475569',
    textTertiary: '#64748b',
    textDisabled: '#94a3b8',
    
    border: '#e2e8f0',
    borderLight: '#cbd5e1',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    messageSent: '#6366f1',
    messageReceived: '#f1f5f9',
    messageText: '#1e293b',
    messageTime: '#64748b',
    
    online: '#10b981',
    offline: '#6b7280',
    away: '#f59e0b',
    busy: '#ef4444',
    
    inputBackground: '#ffffff',
    inputBorder: '#e2e8f0',
    inputFocus: '#6366f1',
    placeholder: '#94a3b8',
    
    buttonPrimary: '#6366f1',
    buttonSecondary: '#f1f5f9',
    buttonDanger: '#ef4444',
    buttonSuccess: '#10b981',
    
    overlay: 'rgba(0, 0, 0, 0.5)',
    modalBackground: 'rgba(0, 0, 0, 0.7)',
  }
};

export const gradients = {
  primary: ['#6366f1', '#8b5cf6'],
  secondary: ['#8b5cf6', '#06b6d4'],
  background: ['#0f0f23', '#1a1a2e'],
  surface: ['#1a1a2e', '#16213e'],
  message: ['#6366f1', '#4f46e5'],
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};
