/**
 * Debug Service for API Connectivity Issues
 * Provides comprehensive diagnostic logging and error handling
 */

import { getBaseURL } from './config';

export interface DiagnosticResult {
  timestamp: string;
  status: string;
  connectivity: {
    canReachServer: boolean;
    responseTime: number;
    httpStatus: number;
  };
  api: {
    baseUrl: string;
    studentsEndpoint: string;
    online: boolean;
  };
  errors?: string[];
  recommendations?: string[];
}

/**
 * Run comprehensive diagnostics on API connectivity
 */
export const runDiagnostics = async (): Promise<DiagnosticResult> => {
  const baseUrl = getBaseURL();
  const result: DiagnosticResult = {
    timestamp: new Date().toISOString(),
    status: 'running',
    connectivity: {
      canReachServer: false,
      responseTime: 0,
      httpStatus: 0,
    },
    api: {
      baseUrl,
      studentsEndpoint: `${baseUrl}/students.php`,
      online: false,
    },
    errors: [],
    recommendations: [],
  };

  try {
    // Test 1: Network connectivity to backend
    console.log('🔍 Starting diagnostics...');
    console.log('📍 Attempting to reach:', result.api.baseUrl);

    const startTime = Date.now();

    try {
      const response = await fetch(`${baseUrl}/diagnose.php`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      const responseTime = Date.now() - startTime;
      result.connectivity.responseTime = responseTime;
      result.connectivity.httpStatus = response.status;

      console.log(`✅ Server responded with status ${response.status} in ${responseTime}ms`);

      if (response.ok) {
        result.connectivity.canReachServer = true;
        const diagnosticData = await response.json();
        console.log('📊 Server Diagnostics:', diagnosticData);

        // Check server health
        if (diagnosticData.database?.status === 'connected') {
          result.api.online = true;
          console.log('✅ Database is connected');
        } else {
          result.errors?.push('Database connection failed on server');
          result.recommendations?.push('Check MySQL is running and credentials are correct');
        }

        if (!diagnosticData.database?.students_table_exists) {
          result.recommendations?.push('Students table does not exist - run setup.php');
        }
      } else {
        result.errors?.push(`HTTP ${response.status} error from server`);
        result.recommendations?.push('Server is responding but with an error status');
      }
    } catch (networkError) {
      console.error('❌ Network Error:', networkError);
      result.errors?.push(`Cannot reach server: ${String(networkError)}`);
      result.recommendations?.push(
        `Server at ${baseUrl} is not accessible. Check:\n` +
        '1. Apache/PHP server is running\n' +
        '2. IP address 192.168.0.78 is correct (run ipconfig on your PC)\n' +
        '3. Device is connected to same WiFi\n' +
        '4. Firewall is not blocking traffic'
      );
    }

    // Test 2: Attempt to fetch students
    try {
      console.log('🔄 Testing students endpoint...');
      const response = await fetch(`${baseUrl}/students.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Students endpoint working, received', data.count || data.data?.length || 0, 'students');
        result.api.online = true;
      } else {
        console.warn('⚠️  Students endpoint returned:', response.status);
      }
    } catch (error) {
      console.error('❌ Students endpoint error:', error);
      result.errors?.push(`Students endpoint unreachable: ${String(error)}`);
    }

    result.status = result.api.online ? 'healthy' : 'unhealthy';

  } catch (error) {
    console.error('❌ Diagnostic error:', error);
    result.status = 'error';
    result.errors?.push(String(error));
  }

  return result;
};

/**
 * Log detailed error information for debugging
 */
export const logDetailedError = (
  context: string,
  error: unknown,
  additionalInfo?: Record<string, unknown>
): void => {
  console.error(`\n${'='.repeat(60)}`);
  console.error(`❌ ERROR in ${context}`);
  console.error(`Timestamp: ${new Date().toISOString()}`);
  
  if (error instanceof Error) {
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
  } else if (error instanceof Response) {
    console.error(`Response Status: ${error.status} ${error.statusText}`);
    console.error(`Response URL: ${error.url}`);
  } else {
    console.error(`Error: ${String(error)}`);
  }

  if (additionalInfo) {
    console.error('Additional Info:', additionalInfo);
  }

  console.error(`${'='.repeat(60)}\n`);
};

/**
 * Safe fetch wrapper with detailed error logging
 */
export const safeFetch = async <T>(
  url: string,
  options?: RequestInit,
  context?: string
): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    logDetailedError(context || url, error, {
      url,
      method: options?.method || 'GET',
      hasBody: !!options?.body,
    });
    throw error;
  }
};
