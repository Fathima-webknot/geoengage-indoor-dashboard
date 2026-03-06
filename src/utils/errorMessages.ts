/**
 * Centralized Error Message Mapper
 * Translates technical API/Firebase errors into user-friendly messages
 */

export interface ErrorResponse {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Map API/Firebase errors to user-friendly messages
 */
export const getErrorMessage = (error: any): string => {
  // Handle null/undefined errors
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Firebase Authentication Errors
  if (error.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/operation-not-allowed':
        return 'This operation is not allowed. Please contact support.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/user-token-expired':
        return 'Your session has expired. Please login again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/popup-blocked':
        return 'Login popup was blocked. Please allow popups and try again.';
      case 'auth/popup-closed-by-user':
        return 'Login was cancelled. Please try again.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized. Please contact support.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please try again.';
      default:
        // Check if it's another auth error
        if (error.code.startsWith('auth/')) {
          return 'Authentication error. Please try again or contact support.';
        }
    }
  }

  // Axios/HTTP Response Errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Use backend error message if available
    if (data?.message) {
      return data.message;
    }

    // Map common HTTP status codes
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with existing data. Please refresh and try again.';
      case 422:
        return 'Invalid data provided. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Our team has been notified. Please try again later.';
      case 502:
      case 503:
        return 'Service temporarily unavailable. Please try again in a few moments.';
      case 504:
        return 'Request timed out. Please check your connection and try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Network Errors (no response from server)
  if (error.request) {
    return 'Unable to reach the server. Please check your internet connection.';
  }

  // Error has a message property
  if (error.message) {
    // Check for common error message patterns
    if (error.message.includes('Network Error')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    if (error.message.includes('Failed to fetch')) {
      return 'Unable to connect to server. Please check your connection.';
    }
    
    // Return the message if it looks user-friendly (not too technical)
    if (error.message.length < 100 && !error.message.includes('Error:')) {
      return error.message;
    }
  }

  // Fallback for unknown errors
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Get success message for common operations
 */
export const getSuccessMessage = (operation: string): string => {
  const messages: Record<string, string> = {
    'campaign-created': '✅ Campaign created successfully!',
    'campaign-activated': '✅ Campaign activated successfully!',
    'campaign-deactivated': '✅ Campaign deactivated successfully!',
    'campaign-deleted': '✅ Campaign deleted successfully!',
    'profile-updated': '✅ Profile updated successfully!',
    'session-refreshed': '✅ Session refreshed successfully!',
    'copied': '✅ Copied to clipboard!',
    'saved': '✅ Changes saved successfully!',
  };

  return messages[operation] || '✅ Operation completed successfully!';
};

/**
 * Format error for logging (includes technical details)
 */
export const formatErrorForLogging = (error: any): string => {
  const parts: string[] = [];

  if (error.code) {
    parts.push(`Code: ${error.code}`);
  }

  if (error.response?.status) {
    parts.push(`Status: ${error.response.status}`);
  }

  if (error.message) {
    parts.push(`Message: ${error.message}`);
  }

  if (error.response?.data) {
    parts.push(`Data: ${JSON.stringify(error.response.data)}`);
  }

  return parts.length > 0 ? parts.join(' | ') : 'Unknown error';
};
