/**
 * Authentication Service
 * Handles API calls for login, logout, and session management
 */

import { getBaseURL } from './config';
import { storageService } from './storage';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  status: 'ok' | 'failed';
  message: string;
  user?: User;
  session_id?: string;
}

export interface CheckAuthResponse {
  isAuthenticated: boolean;
  user?: User;
}

const BASE_URL = getBaseURL();

export const authService = {
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Attempting login for:', username);

      const response = await fetch(`${BASE_URL}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        // Note: Don't include credentials on login request (no session yet)
        // The server will set the session cookie in the response
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', {
        contentType: response.headers.get('content-type'),
        corsOrigin: response.headers.get('access-control-allow-origin'),
      });

      // Try to parse JSON response
      let data: LoginResponse;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        console.error('Response status:', response.status);
        return {
          status: 'failed',
          message: `Server error: Invalid response format (Status: ${response.status})`,
        };
      }

      console.log('Login response:', {
        status: data.status,
        message: data.message,
        hasUser: !!data.user,
      });

      if (data.status === 'ok' && data.user) {
        // Store user info locally
        await authService.saveUserLocally(data.user);
      }

      return data;
    } catch (error) {
      console.error('Login fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'failed',
        message: `Connection error: ${errorMessage}`,
      };
    }
  },

  /**
   * Logout and clear session
   */
  async logout(): Promise<void> {
    try {
      console.log('Attempting logout...');

      const response = await fetch(`${BASE_URL}/logout.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Logout response:', data);

      // Clear local user data
      await authService.clearUserLocally();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API call fails
      await authService.clearUserLocally();
    }
  },

  /**
   * Check if user is still authenticated
   */
  async checkAuth(): Promise<CheckAuthResponse> {
    try {
      console.log('Checking authentication status...');

      const response = await fetch(`${BASE_URL}/auth/check.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Auth check response status:', response.status);

      let data: CheckAuthResponse;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse auth check response:', jsonError);
        console.error('Response status:', response.status);
        return { isAuthenticated: false };
      }

      console.log('Auth check result:', {
        isAuthenticated: data.isAuthenticated,
        hasUser: !!data.user,
      });

      return data;
    } catch (error) {
      console.error('Auth check fetch error:', error);
      return { isAuthenticated: false };
    }
  },

  /**
   * Save user info to local storage
   */
  async saveUserLocally(user: User): Promise<void> {
    try {
      console.log('💾 Saving user locally:', user.username);
      await storageService.setItem('user', JSON.stringify(user));
      console.log('✅ User saved successfully');
    } catch (error) {
      console.error('❌ Error saving user locally:', error);
    }
  },

  /**
   * Get user from local storage
   */
  async getUserLocally(): Promise<User | null> {
    try {
      const userJson = await storageService.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        console.log('✅ User retrieved from storage:', user.username);
        return user;
      }
      console.log('ℹ️ No user found in storage');
      return null;
    } catch (error) {
      console.error('❌ Error getting user locally:', error);
      return null;
    }
  },

  /**
   * Clear user from local storage
   */
  async clearUserLocally(): Promise<void> {
    try {
      console.log('🗑️ Clearing user from storage');
      await storageService.removeItem('user');
      console.log('✅ User cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing user locally:', error);
    }
  },
};
