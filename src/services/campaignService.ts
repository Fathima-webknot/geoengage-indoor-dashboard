import api from './api';
import {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignListResponse,
  CampaignFilters,
} from '@/types/campaign.types';

const CAMPAIGNS_ENDPOINT = '/campaigns';

export const campaignService = {
  /**
   * Get all campaigns with optional filters
   */
  async getAllCampaigns(filters?: CampaignFilters): Promise<CampaignListResponse> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.pageSize !== undefined) params.append('pageSize', filters.pageSize.toString());

    const response = await api.get<CampaignListResponse>(
      `${CAMPAIGNS_ENDPOINT}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single campaign by ID
   */
  async getCampaignById(id: string): Promise<Campaign> {
    const response = await api.get<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create a new campaign
   */
  async createCampaign(data: CreateCampaignRequest): Promise<Campaign> {
    const response = await api.post<Campaign>(CAMPAIGNS_ENDPOINT, data);
    return response.data;
  },

  /**
   * Update an existing campaign
   */
  async updateCampaign(id: string, data: UpdateCampaignRequest): Promise<Campaign> {
    const response = await api.put<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a campaign
   */
  async deleteCampaign(id: string): Promise<void> {
    await api.delete(`${CAMPAIGNS_ENDPOINT}/${id}`);
  },

  /**
   * Activate a campaign (PUT endpoint as per backend API)
   */
  async activateCampaign(id: string): Promise<Campaign> {
    console.log('Calling PUT /campaigns/' + id + ' with active=true');
    const response = await api.put<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`, { active: true });
    return response.data;
  },

  /**
   * Deactivate a campaign (PUT endpoint as per backend API)
   */
  async deactivateCampaign(id: string): Promise<Campaign> {
    console.log('Calling PUT /campaigns/' + id + ' with active=false');
    const response = await api.put<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`, { active: false });
    return response.data;
  },

  /**
   * Pause a campaign
   */
  async pauseCampaign(id: string): Promise<Campaign> {
    const response = await api.post<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}/pause`);
    return response.data;
  },

  /**
   * Get campaign performance metrics
   */
  async getCampaignMetrics(id: string): Promise<{
    impressions: number;
    clicks: number;
    clickThroughRate: number;
    uniqueUsers: number;
  }> {
    const response = await api.get(`${CAMPAIGNS_ENDPOINT}/${id}/metrics`);
    return response.data;
  },
};
