import api from './api';
import {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignFilters,
} from '@/types/campaign.types';

const CAMPAIGNS_ENDPOINT = '/campaigns';

export const campaignService = {
  /**
   * Get all campaigns with optional filters
   * Supports filtering by zone_id and trigger type
   */
  async getAllCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    const params = new URLSearchParams();
    
    if (filters?.zone_id) params.append('zone_id', filters.zone_id);
    if (filters?.trigger) params.append('trigger', filters.trigger);

    const queryString = params.toString();
    const url = queryString ? `${CAMPAIGNS_ENDPOINT}?${queryString}` : CAMPAIGNS_ENDPOINT;
    
    try {
      const response = await api.get<Campaign[]>(url);
      
      // Handle case where backend might return an object instead of array
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        console.warn('⚠️ Backend returned object instead of array, attempting to extract array');
        const dataObj = response.data as any;
        if (Array.isArray(dataObj.campaigns)) return dataObj.campaigns;
        if (Array.isArray(dataObj.data)) return dataObj.data;
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('❌ Failed to fetch campaigns:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  /**
   * Get a single campaign by ID
   */
  async getCampaignById(id: number): Promise<Campaign> {
    const response = await api.get<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create a new campaign
   * POST /api/v1/campaigns
   */
  async createCampaign(data: CreateCampaignRequest): Promise<Campaign> {
    const response = await api.post<Campaign>(CAMPAIGNS_ENDPOINT, data);
    return response.data;
  },

  /**
   * Update an existing campaign
   * PUT /api/v1/campaigns/{id}
   */
  async updateCampaign(id: number, data: UpdateCampaignRequest): Promise<Campaign> {
    const response = await api.put<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a campaign
   */
  async deleteCampaign(id: number): Promise<void> {
    await api.delete(`${CAMPAIGNS_ENDPOINT}/${id}`);
  },

  /**
   * Activate a campaign
   * When activating, backend will automatically deactivate other campaigns 
   * with the same zone_id and trigger type
   */
  async activateCampaign(id: number): Promise<Campaign> {
    const response = await api.put<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`, { active: true });
    return response.data;
  },

  /**
   * Deactivate a campaign
   */
  async deactivateCampaign(id: number): Promise<Campaign> {
    const response = await api.put<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`, { active: false });
    return response.data;
  },
};
