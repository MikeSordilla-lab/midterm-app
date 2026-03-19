/**
 * Authentication Debugging Utilities
 * Helps diagnose and fix login issues
 */

import { getBaseURL } from './config';

const BASE_URL = getBaseURL();

export const authDebug = {
  /**
   * Test basic connectivity to the backend
   */
  async testConnectivity(): Promise<{
    online: boolean;
    baseUrl: string;
    timestamp: string;
    details?: string;
  }> {
    try {
      const response = await fetch(`${BASE_URL}/test.php`);
      const data = await response.json();
      return {
        online: true,
        baseUrl: BASE_URL,
        timestamp: new Date().toISOString(),
        details: data.message,
      };
    } catch (error) {
      return {
        online: false,
        baseUrl: BASE_URL,
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Get detailed login diagnostics from backend
   */
  async getLoginDiagnostics(testUsername?: string, testPassword?: string): Promise<any> {
    try {
      const body = testUsername && testPassword
        ? JSON.stringify({ test_username: testUsername, test_password: testPassword })
        : undefined;

      const response = await fetch(`${BASE_URL}/login-diagnostics.php`, {
        method: testUsername && testPassword ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      return await response.json();
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch diagnostics',
      };
    }
  },

  /**
   * Log detailed debug info to console
   */
  async logDebugInfo(): Promise<void> {
    console.log('=== AUTH DEBUG INFO ===');
    console.log('Base URL:', BASE_URL);

    const connectivity = await this.testConnectivity();
    console.log('Connectivity:', connectivity);

    const diagnostics = await this.getLoginDiagnostics();
    console.log('Backend Diagnostics:', diagnostics);

    console.log('=== END DEBUG INFO ===');
  },

  /**
   * Test login with specific credentials
   */
  async testLogin(username: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      return {
        status: response.status,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
