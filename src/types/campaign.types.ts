export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export enum CampaignType {
  PROMOTIONAL = 'promotional',
  INFORMATIONAL = 'informational',
  NAVIGATIONAL = 'navigational',
  EMERGENCY = 'emergency',
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  contentTitle: string;
  contentMessage: string;
  contentImageUrl?: string;
  contentActionUrl?: string;
  contentActionText?: string;
  zoneIds: string[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignRequest {
  name: string;
  description: string;
  type: CampaignType;
  contentTitle: string;
  contentMessage: string;
  contentImageUrl?: string;
  contentActionUrl?: string;
  contentActionText?: string;
  zoneIds: string[];
  startDate: string;
  endDate?: string;
}

export interface UpdateCampaignRequest extends Partial<CreateCampaignRequest> {
  status?: CampaignStatus;
  isActive?: boolean;
}

export interface CampaignListResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CampaignFilters {
  status?: CampaignStatus;
  type?: CampaignType;
  search?: string;
  page?: number;
  pageSize?: number;
}
