export enum ZoneType {
  ENTRANCE = 'entrance',
  CHECKOUT = 'checkout',
  PRODUCT_SECTION = 'product_section',
  WAITING_AREA = 'waiting_area',
  FOOD_COURT = 'food_court',
  PARKING = 'parking',
  CUSTOM = 'custom',
}

export interface ZoneCoordinates {
  latitude: number;
  longitude: number;
}

export interface Zone {
  id: string;
  name: string;
  type: ZoneType;
  description?: string;
  floorLevel: number;
  coordinates: ZoneCoordinates;
  radius: number; // in meters
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateZoneRequest {
  name: string;
  type: ZoneType;
  description?: string;
  floorLevel: number;
  coordinates: ZoneCoordinates;
  radius: number;
  metadata?: Record<string, any>;
}

export interface UpdateZoneRequest extends Partial<CreateZoneRequest> {
  isActive?: boolean;
}

export interface ZoneListResponse {
  zones: Zone[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ZoneFilters {
  type?: ZoneType;
  floorLevel?: number;
  isActive?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ZonePerformance {
  zoneId: string;
  zoneName: string;
  impressions: number;
  clicks: number;
  clickThroughRate: number;
  activeCampaigns: number;
}
