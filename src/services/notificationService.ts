/**
 * Enhanced Notification Service
 * Handles push notifications and real-time updates
 */

import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { API_ENDPOINTS, getFullUrl } from '../config/apiConfig';
import authService from './authService';
import { PushNotification, NotificationSettings } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private baseUrl: string;
  private deviceToken: string | null = null;

  constructor() {
    this.baseUrl = getFullUrl(API_ENDPOINTS.NOTIFICATION.REGISTER_DEVICE).replace(API_ENDPOINTS.NOTIFICATION.REGISTER_DEVICE, '');
  }

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    try {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      // Get device token
      const token = await this.getDeviceToken();
      if (token) {
        await this.registerDevice(token);
      }

      // Set up notification listeners
      this.setupNotificationListeners();
    } catch (error) {
      console.error('Notification service initialization error:', error);
      throw error;
    }
  }

  /**
   * Get device push token
   */
  private async getDeviceToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return null; // Web doesn't support push notifications
      }

      const token = await Notifications.getExpoPushTokenAsync();
      this.deviceToken = token.data;
      return this.deviceToken;
    } catch (error) {
      console.error('Get device token error:', error);
      return null;
    }
  }

  /**
   * Register device with backend
   */
  private async registerDevice(token: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.NOTIFICATION.REGISTER_DEVICE), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          token,
          platform: Platform.OS,
          appVersion: '1.0.0', // You can get this from app config
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to register device');
      }
    } catch (error) {
      console.error('Register device error:', error);
      throw error;
    }
  }

  /**
   * Set up notification listeners
   */
  private setupNotificationListeners(): void {
    // Handle notification received while app is running
    Notifications.addNotificationReceivedListener(this.handleNotificationReceived);

    // Handle notification tapped
    Notifications.addNotificationResponseReceivedListener(this.handleNotificationResponse);
  }

  /**
   * Handle notification received
   */
  private handleNotificationReceived = (notification: Notifications.Notification) => {
    console.log('Notification received:', notification);
    // You can add custom logic here, like updating UI state
  };

  /**
   * Handle notification response (tapped)
   */
  private handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    console.log('Notification tapped:', response);
    // Handle navigation based on notification data
    this.handleNotificationNavigation(response.notification.request.content.data);
  };

  /**
   * Handle notification navigation
   */
  private handleNotificationNavigation(data: any): void {
    // Implement navigation logic based on notification type
    switch (data.type) {
      case 'message':
        // Navigate to chat screen
        break;
      case 'call':
        // Navigate to call screen
        break;
      case 'group_invite':
        // Navigate to group screen
        break;
      default:
        // Navigate to main screen
        break;
    }
  }

  /**
   * Get notification settings
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.NOTIFICATION.SETTINGS), {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get notification settings');
      }

      return data;
    } catch (error) {
      console.error('Get notification settings error:', error);
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.NOTIFICATION.SETTINGS), {
        method: 'PUT',
        headers,
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update notification settings');
      }
    } catch (error) {
      console.error('Update notification settings error:', error);
      throw error;
    }
  }

  /**
   * Get all notifications
   */
  async getNotifications(page: number = 1, limit: number = 20): Promise<PushNotification[]> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(
        `${this.baseUrl}/api/notifications?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get notifications');
      }

      return data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/api/notifications/read-all`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/api/notifications/clear-all`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to clear all notifications');
      }
    } catch (error) {
      console.error('Clear all notifications error:', error);
      throw error;
    }
  }

  /**
   * Schedule local notification
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    seconds: number = 0
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: seconds > 0 ? { seconds } : null,
      });

      return notificationId;
    } catch (error) {
      console.error('Schedule local notification error:', error);
      throw error;
    }
  }

  /**
   * Cancel local notification
   */
  async cancelLocalNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Cancel local notification error:', error);
      throw error;
    }
  }

  /**
   * Cancel all local notifications
   */
  async cancelAllLocalNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Cancel all local notifications error:', error);
      throw error;
    }
  }

  /**
   * Get notification badge count
   */
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Get badge count error:', error);
      return 0;
    }
  }

  /**
   * Set notification badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Set badge count error:', error);
      throw error;
    }
  }

  /**
   * Show alert for notification
   */
  showNotificationAlert(title: string, message: string, onPress?: () => void): void {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: onPress,
        },
      ]
    );
  }

  /**
   * Check if notifications are enabled
   */
  async areNotificationsEnabled(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Check notification permissions error:', error);
      return false;
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Request notification permissions error:', error);
      return false;
    }
  }
}

export default new NotificationService();