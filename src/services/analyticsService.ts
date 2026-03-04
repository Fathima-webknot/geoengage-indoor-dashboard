import api from './api';

/**
 * Backend Analytics Response (snake_case from API)
 */
interface BackendAnalyticsResponse {
  notifications_sent: number;
  clicks: number;
  ctr: number;
  zone_metrics?: any;
}

/**
 * Notification Analytics Response (camelCase for frontend)
 */
export interface NotificationAnalytics {
  totalTriggered: number;
  totalClicked: number;
  ctr: number; // Click-through rate as a percentage
}

/**
 * Analytics Service
 * Handles analytics data fetching
 */
export const analyticsService = {
  /**
   * Get notification analytics (triggered, clicked, CTR)
   */
  async getNotificationAnalytics(): Promise<NotificationAnalytics> {
    const response = await api.get<BackendAnalyticsResponse>('/analytics');
    
    // Map backend snake_case to frontend camelCase
    return {
      totalTriggered: response.data.notifications_sent || 0,
      totalClicked: response.data.clicks || 0,
      ctr: response.data.ctr || 0,
    };
  },
};
