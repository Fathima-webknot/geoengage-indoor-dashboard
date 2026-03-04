import api from './api';

/**
 * Admin verification response
 */
export interface AdminVerificationResponse {
  success: boolean;
  message: string;
  user?: any;
}

/**
 * Admin Service
 * Handles admin verification and authorization
 */
export const adminService = {
  /**
   * Verify if the current user is an admin
   * Requires Firebase authentication token in headers
   */
  async verifyAdmin(): Promise<AdminVerificationResponse> {
    const response = await api.get<AdminVerificationResponse>('/verify-admin');
    return response.data;
  },
};
