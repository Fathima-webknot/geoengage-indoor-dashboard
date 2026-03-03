import api from './api';
import {
  Zone,
  CreateZoneRequest,
  UpdateZoneRequest,
  ZoneListResponse,
  ZoneFilters,
  ZonePerformance,
} from '@/types/zone.types';

const ZONES_ENDPOINT = '/zones';

export const zoneService = {
  /**
   * Get all zones with optional filters
   */
  async getAllZones(filters?: ZoneFilters): Promise<ZoneListResponse> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.floorLevel !== undefined) params.append('floorLevel', filters.floorLevel.toString());
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.pageSize !== undefined) params.append('pageSize', filters.pageSize.toString());

    const response = await api.get<ZoneListResponse>(
      `${ZONES_ENDPOINT}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single zone by ID
   */
  async getZoneById(id: string): Promise<Zone> {
    const response = await api.get<Zone>(`${ZONES_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create a new zone
   */
  async createZone(data: CreateZoneRequest): Promise<Zone> {
    const response = await api.post<Zone>(ZONES_ENDPOINT, data);
    return response.data;
  },

  /**
   * Update an existing zone
   */
  async updateZone(id: string, data: UpdateZoneRequest): Promise<Zone> {
    const response = await api.put<Zone>(`${ZONES_ENDPOINT}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a zone
   */
  async deleteZone(id: string): Promise<void> {
    await api.delete(`${ZONES_ENDPOINT}/${id}`);
  },

  /**
   * Activate a zone
   */
  async activateZone(id: string): Promise<Zone> {
    const response = await api.patch<Zone>(`${ZONES_ENDPOINT}/${id}/activate`);
    return response.data;
  },

  /**
   * Deactivate a zone
   */
  async deactivateZone(id: string): Promise<Zone> {
    const response = await api.patch<Zone>(`${ZONES_ENDPOINT}/${id}/deactivate`);
    return response.data;
  },

  /**
   * Get zone performance metrics
   */
  async getZonePerformance(): Promise<ZonePerformance[]> {
    const response = await api.get<ZonePerformance[]>(`${ZONES_ENDPOINT}/performance`);
    return response.data;
  },

  /**
   * Get zones by campaign ID
   */
  async getZonesByCampaign(campaignId: string): Promise<Zone[]> {
    const response = await api.get<Zone[]>(`${ZONES_ENDPOINT}/campaign/${campaignId}`);
    return response.data;
  },
};
