/**
 * Enhanced User Service
 * Handles user-related operations with real-time updates
 */

import { API_ENDPOINTS, getFullUrl } from '../config/apiConfig';
import authService from './authService';
import { User, UserProfile, ApiResponse, PaginatedResponse } from '../types';

class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getFullUrl(API_ENDPOINTS.USER.ME).replace(API_ENDPOINTS.USER.ME, '');
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.USER.ME), {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user profile');
      }

      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.USER.ME), {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.USER.PROFILE(userId)), {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user');
      }

      return data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  /**
   * Search users
   */
  async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(
        `${getFullUrl(API_ENDPOINTS.USER.SEARCH)}?q=${encodeURIComponent(query)}&limit=${limit}`,
        {
          method: 'GET',
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search users');
      }

      return data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  /**
   * Get all users (with pagination)
   */
  async getAllUsers(page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(
        `${getFullUrl(API_ENDPOINTS.USER.ALL)}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get users');
      }

      return data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.USER.CHANGE_PASSWORD), {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: any): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(getFullUrl(API_ENDPOINTS.USER.NOTIFICATION_SETTINGS), {
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
   * Upload profile picture
   */
  async uploadProfilePicture(imageUri: string): Promise<string> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const formData = new FormData();
      formData.append('profilePicture', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await fetch(getFullUrl(API_ENDPOINTS.USER.ME), {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload profile picture');
      }

      return data.avatarUrl;
    } catch (error) {
      console.error('Upload profile picture error:', error);
      throw error;
    }
  }

  /**
   * Block user
   */
  async blockUser(userId: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(`${getFullUrl(API_ENDPOINTS.USER.ME)}/block`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to block user');
      }
    } catch (error) {
      console.error('Block user error:', error);
      throw error;
    }
  }

  /**
   * Unblock user
   */
  async unblockUser(userId: string): Promise<void> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(`${getFullUrl(API_ENDPOINTS.USER.ME)}/unblock`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to unblock user');
      }
    } catch (error) {
      console.error('Unblock user error:', error);
      throw error;
    }
  }

  /**
   * Get blocked users
   */
  async getBlockedUsers(): Promise<User[]> {
    try {
      const headers = await authService.getAuthHeaders();
      const response = await fetch(`${getFullUrl(API_ENDPOINTS.USER.ME)}/blocked`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get blocked users');
      }

      return data;
    } catch (error) {
      console.error('Get blocked users error:', error);
      throw error;
    }
  }
}

export default new UserService();