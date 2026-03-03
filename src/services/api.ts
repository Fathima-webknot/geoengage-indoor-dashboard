import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { auth } from '../config/firebase';

/**
 * Base API URL from environment variables
 * Default to localhost if not configured
 */
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
// Remove trailing slash if present
if (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420', // Skip ngrok browser warning
  },
});

/**
 * Request Interceptor
 * Automatically attaches Firebase authentication token to all requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get the current user from Firebase Auth
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Get the ID token from Firebase
        const token = await currentUser.getIdToken();
        
        // Log token in a persistent way
        console.group('🔑 FIREBASE TOKEN - Click to expand and copy');
        console.warn('FULL TOKEN (copy this):', token);
        console.log('User Email:', currentUser.email);
        console.log('User UID:', currentUser.uid);
        console.groupEnd();
        
        // Also store in window for easy access
        (window as any).FIREBASE_TOKEN = token;
        console.info('💡 TIP: Type "FIREBASE_TOKEN" in console to see token again');

        // Attach the token to the Authorization header
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
          config.headers['ngrok-skip-browser-warning'] = '69420';
        }
      } else {
        console.warn('⚠️ No authenticated user found');
      }
    } catch (error) {
      console.error('Error getting Firebase token:', error);
    }

    return config;
  },
  (error: AxiosError) => {
    // Handle request errors
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common response errors and authentication issues
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  async (error: AxiosError) => {
    // Handle error responses
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('Authentication error: User is not authenticated');
          
          // Optionally, you can redirect to login or refresh token here
          // For now, we'll just log the error
          // window.location.href = '/login';
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Authorization error: User does not have permission');
          break;

        case 404:
          // Not found
          console.error('Resource not found:', error.config?.url);
          break;

        case 500:
          // Server error
          console.error('Server error:', data);
          break;

        default:
          console.error(`Error ${status}:`, data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error: No response from server');
    } else {
      // Something else happened
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * API Service Methods
 * Wrapper functions for common HTTP methods
 */
export const apiService = {
  /**
   * GET request
   */
  get: async <T>(url: string, config = {}) => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  /**
   * POST request
   */
  post: async <T>(url: string, data?: unknown, config = {}) => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data?: unknown, config = {}) => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   */
  patch: async <T>(url: string, data?: unknown, config = {}) => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string, config = {}) => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

// Export the configured Axios instance for advanced use cases
export default apiClient;
