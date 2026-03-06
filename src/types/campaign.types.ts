/**
 * Trigger types for campaigns
 */
export enum CampaignTrigger {
  ZONE_ENTRY = 'zone_entry',
  ZONE_EXIT_NO_TXN = 'zone_exit_no_txn',
}

/**
 * Campaign model as returned by backend API
 */
export interface Campaign {
  id: number;
  zone_id: string;
  message: string;
  name?: string | null;
  active: boolean;
  trigger: CampaignTrigger;
  created_at: string;
  // Client-side enriched field (not from API)
  zone_name?: string;
}

/**
 * Request payload for creating a new campaign
 */
export interface CreateCampaignRequest {
  zone_id: string;
  message: string;
  name?: string;
  trigger?: CampaignTrigger;
}

/**
 * Request payload for updating a campaign
 */
export interface UpdateCampaignRequest {
  active?: boolean;
  message?: string;
  name?: string;
  trigger?: CampaignTrigger;
}

/**
 * Query filters for listing campaigns
 */
export interface CampaignFilters {
  zone_id?: string;
  trigger?: CampaignTrigger;
}
