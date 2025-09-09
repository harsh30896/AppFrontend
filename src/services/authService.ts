/**
 * Enhanced Authentication Service
 * Handles user authentication operations with improved error handling and token management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, getFullUrl } from '../config/apiConfig';
import { LoginRequest, RegisterRequest, AuthResponse, User, ApiResponse } from '../types';

class AuthService {
  private baseUrl: string;
  private tokenRefreshPromise: Promise<AuthResponse> | null = null;

  constructor() {
    this.baseUrl = getFullUrl(API_ENDPOINTS.AUTH.LOGIN).replace(API_ENDPOINTS.AUTH.LOGIN, '');
  }

  /**
   * Login user with enhanced error handling
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(getFullUrl(API_ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      // Store tokens
      await this.storeTokens(data.accessToken, data.refreshToken);
      
      // Store user data
      if (data.user) {
        await this.storeUser(data.user);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  /**
   * Register new user with validation
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Validate input
      this.validateRegistrationData(userData);

      const response = await fetch(getFullUrl(API_ENDPOINTS.AUTH.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      // Store tokens
      await this.storeTokens(data.accessToken, data.refreshToken);
      
      // Store user data
      if (data.user) {
        await this.storeUser(data.user);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  /**
   * Logout user with cleanup
   */
  async logout(): Promise<void> {
    try {
      const token = await this.getStoredToken();
      if (token) {
        await fetch(getFullUrl(API_ENDPOINTS.AUTH.LOGOUT), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local data
      await this.clearStoredData();
    }
  }

  /**
   * Refresh access token with retry logic
   */
  async refreshToken(): Promise<AuthResponse> {
    // Prevent multiple simultaneous refresh attempts
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.tokenRefreshPromise;
      return result;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<AuthResponse> {
    try {
      const refreshToken = await this.getStoredRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(getFullUrl(API_ENDPOINTS.AUTH.REFRESH), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      await this.storeTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.clearStoredData();
      throw error;
    }
  }

  /**
   * Get authenticated request headers
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getValidToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get valid token (refresh if needed)
   */
  async getValidToken(): Promise<string> {
    const token = await this.getStoredToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      if (payload.exp && payload.exp < now + 60) { // Refresh if expires in less than 1 minute
        const refreshed = await this.refreshToken();
        return refreshed.accessToken;
      }
      
      return token;
    } catch (error) {
      // If token parsing fails, try to refresh
      const refreshed = await this.refreshToken();
      return refreshed.accessToken;
    }
  }

  /**
   * Store authentication tokens
   */
  private async storeTokens(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ...(refreshToken ? [['refreshToken', refreshToken]] : []),
      ]);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  /**
   * Store user data
   */
  private async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  }

  /**
   * Get stored access token
   */
  private async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  /**
   * Get stored refresh token
   */
  private async getStoredRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Error getting stored refresh token:', error);
      return null;
    }
  }

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  private async clearStoredData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getStoredToken();
      const user = await this.getStoredUser();
      return !!(token && user);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get current access token
   */
  async getCurrentToken(): Promise<string | null> {
    return await this.getStoredToken();
  }

  /**
   * Validate registration data
   */
  private validateRegistrationData(data: RegisterRequest): void {
    if (!data.username || data.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (!data.password || data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Please enter a valid email address');
    }
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await fetch(getFullUrl(API_ENDPOINTS.AUTH.REFRESH), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to send reset email');
    }
  }
}

export default new AuthService();