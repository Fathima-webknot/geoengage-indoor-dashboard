# 📡 API Services - Complete Explanation

## Overview
API services handle all communication with the backend server. They use Axios for HTTP requests and automatically attach authentication tokens.

---

## 📄 File: `src/services/api.ts`

**Purpose:** Configure Axios HTTP client with interceptors for authentication

### Line-by-Line Breakdown:

#### Part 1: Setup and Configuration

```typescript
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { auth } from '../config/firebase';
```
- **Lines 1-2:** Import Axios and Firebase auth
- `AxiosInstance`: TypeScript type for Axios client
- `auth`: Firebase auth instance to get current user's token

```typescript
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
if (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}
```
- **Lines 8-11:** Get backend URL from environment
- Falls back to localhost if not set
- Remove trailing slash if present (prevents double slashes in URLs)

```typescript
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
});
```
- **Lines 16-23:** Create Axios instance with defaults
- `baseURL`: All requests prepend this URL
- `timeout: 30000`: Cancel request after 30 seconds
- `Content-Type`: Tell server we're sending JSON
- `ngrok-skip-browser-warning`: Skip ngrok warning page (useful for development)

#### Part 2: Request Interceptor

**What is an interceptor?** A function that runs **before every API request** to modify it.

```typescript
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
```
- **Lines 29-31:** Start request interceptor
- Runs automatically before every API call
- `config`: Request configuration object (URL, headers, etc.)

```typescript
      const currentUser = auth.currentUser;
```
- **Line 33:** Get currently logged-in user from Firebase

```typescript
      if (currentUser) {
        const token = await currentUser.getIdToken(true);
```
- **Lines 35-36:** If user is logged in
- Get Firebase authentication token
- `true` parameter forces refresh if token expired

```typescript
        console.group('🔑 FIREBASE TOKEN - Click to expand and copy');
        console.warn('FULL TOKEN (copy this):', token);
        console.log('User Email:', currentUser.email);
        console.log('User UID:', currentUser.uid);
        console.groupEnd();
```
- **Lines 39-43:** Log token to console
- Useful for debugging
- `console.group`: Makes logs collapsible

```typescript
        (window as any).FIREBASE_TOKEN = token;
        console.info('💡 TIP: Type "FIREBASE_TOKEN" in console to see token again');
```
- **Lines 46-47:** Store token on window object
- Allows developers to easily copy token from browser console

```typescript
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
          config.headers['ngrok-skip-browser-warning'] = '69420';
        }
```
- **Lines 49-52:** Add token to request headers
- `Authorization: Bearer <token>` is standard format
- Backend reads this header to authenticate user

```typescript
      } else {
        console.warn('⚠️ No authenticated user found');
      }
```
- **Lines 53-55:** Warn if no user logged in
- API calls may fail without token

```typescript
    } catch (error) {
      console.error('Error getting Firebase token:', error);
    }
    return config;
  },
```
- **Lines 56-60:** Catch any errors
- Still return config even if token fetch failed
- Request will proceed (may fail at backend)

```typescript
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);
```
- **Lines 61-65:** Handle interceptor errors
- Rarely happens
- Reject promise so request doesn't proceed

### Request Interceptor Flow:

```
API call made (e.g., get /campaigns)
     ↓
Request interceptor runs
     ↓
Get Firebase token for current user
     ↓
Add token to Authorization header
     ↓
Request sent to backend with token
     ↓
Backend verifies token
     ↓
Backend processes request
```

#### Part 3: Response Interceptor

**What is a response interceptor?** A function that runs **after every API response** to handle errors.

```typescript
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
```
- **Lines 72-75:** Success handler
- If request succeeds, just return response as-is

```typescript
  async (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
```
- **Lines 76-78:** Error handler
- `error.response` exists if server responded (even with error)
- Extract status code and data

```typescript
      switch (status) {
        case 401:
          console.error('Authentication error: User is not authenticated');
          break;
```
- **Lines 80-83:** Handle 401 Unauthorized
- Token invalid or expired
- Could redirect to login page here

```typescript
        case 403:
          console.error('Authorization error: User does not have permission');
          break;
```
- **Lines 85-87:** Handle 403 Forbidden
- User is logged in but doesn't have permission
- E.g., not an admin

```typescript
        case 404:
          console.error('Resource not found:', error.config?.url);
          break;
```
- **Lines 89-91:** Handle 404 Not Found
- Endpoint doesn't exist
- Or resource with that ID doesn't exist

```typescript
        case 500:
          console.error('Server error:', data);
          break;
```
- **Lines 93-95:** Handle 500 Internal Server Error
- Backend crashed or database error

```typescript
        default:
          console.error(`Error ${status}:`, data);
      }
```
- **Lines 97-99:** Handle other status codes

```typescript
    } else if (error.request) {
      console.error('Network error: No response from server');
    } else {
      console.error('Request error:', error.message);
    }
```
- **Lines 100-104:** Handle other error types
- `error.request`: Request sent but no response (server down?)
- Neither: Error setting up request

```typescript
    return Promise.reject(error);
  }
);
```
- **Lines 106-108:** Reject promise
- Allows calling code to catch error with `try/catch`

#### Part 4: API Service Methods

```typescript
export const apiService = {
  get: async <T>(url: string, config = {}) => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },
```
- **Lines 116-120:** GET request helper
- `<T>`: TypeScript generic for response type
- Returns just the data (not entire response object)

**Example usage:**
```typescript
const campaigns = await apiService.get<Campaign[]>('/campaigns');
```

```typescript
  post: async <T>(url: string, data?: unknown, config = {}) => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },
```
- **Lines 125-128:** POST request helper
- Used for creating resources

**Example usage:**
```typescript
await apiService.post('/campaigns', { name: 'New Campaign', ... });
```

```typescript
  put: async <T>(url: string, data?: unknown, config = {}) => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },
```
- **Lines 133-136:** PUT request helper
- Used for updating entire resources

```typescript
  patch: async <T>(url: string, data?: unknown, config = {}) => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },
```
- **Lines 141-144:** PATCH request helper
- Used for partial updates

```typescript
  delete: async <T>(url: string, config = {}) => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
```
- **Lines 149-152:** DELETE request helper
- Used for deleting resources

```typescript
export default apiClient;
```
- **Line 156:** Export raw Axios instance
- For advanced use cases that need full Axios features

### What This File Does (Layman):

This file is the **"post office"** of your app:
1. **Prepares packages** (adds auth tokens to requests)
2. **Sends letters** (makes HTTP requests to backend)
3. **Handles delivery issues** (processes error responses)
4. **Returns messages** (gives data back to your app)

### HTTP Methods Explained:

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Fetch data | Get list of campaigns |
| POST | Create new resource | Create new campaign |
| PUT | Update entire resource | Update all campaign fields |
| PATCH | Update part of resource | Just change active status |
| DELETE | Remove resource | Delete a campaign |

---

## 📄 File: `src/services/adminService.ts`

**Purpose:** Handle admin verification API call

```typescript
import api from './api';
```
- **Line 1:** Import api service we just created

```typescript
export interface AdminVerificationResponse {
  success: boolean;
  message: string;
  user?: any;
}
```
- **Lines 6-10:** Define response type
- Backend returns this format
- `user?` is optional (only included if successful)

```typescript
export const adminService = {
  async verifyAdmin(): Promise<AdminVerificationResponse> {
    const response = await api.get<AdminVerificationResponse>('/verify-admin');
    return response.data;
  },
};
```
- **Lines 15-19:** Admin service with one method
- `verifyAdmin()`: Check if current user is admin
- Uses GET request (no data needed, token in header)
- Backend checks token and verifies email is in admin list

**Called from:** AuthContext when user logs in

---

## 📄 File: `src/services/campaignService.ts`

**Purpose:** All campaign-related API calls

```typescript
import api from './api';
import {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignFilters,
} from '@/types/campaign.types';
```
- **Lines 1-7:** Imports
- `api`: Our configured Axios instance
- Types: TypeScript definitions for requests/responses

```typescript
const CAMPAIGNS_ENDPOINT = '/campaigns';
```
- **Line 9:** Base endpoint for all campaign operations

### Method: getAllCampaigns

```typescript
async getAllCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
  const params = new URLSearchParams();
  
  if (filters?.zone_id) params.append('zone_id', filters.zone_id);
  if (filters?.trigger) params.append('trigger', filters.trigger);
```
- **Lines 16-20:** Build query parameters
- Optional filters for zone and trigger type
- `URLSearchParams`: Builds query string like `?zone_id=abc&trigger=entry`

```typescript
  const queryString = params.toString();
  const url = queryString ? `${CAMPAIGNS_ENDPOINT}?${queryString}` : CAMPAIGNS_ENDPOINT;
```
- **Lines 22-23:** Build full URL
- If filters exist: `/campaigns?zone_id=abc`
- If no filters: `/campaigns`

```typescript
  try {
    const response = await api.get<Campaign[]>(url);
    
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      const dataObj = response.data as any;
      if (Array.isArray(dataObj.campaigns)) return dataObj.campaigns;
      if (Array.isArray(dataObj.data)) return dataObj.data;
    }
    
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('❌ Failed to fetch campaigns:', error);
    throw error;
  }
}
```
- **Lines 30-44:** Make request and handle response
- Handles different backend response formats
- Returns array of campaigns or empty array
- Logs detailed errors

### Method: createCampaign

```typescript
async createCampaign(data: CreateCampaignRequest): Promise<Campaign> {
  const response = await api.post<Campaign>(CAMPAIGNS_ENDPOINT, data);
  return response.data;
}
```
- **Lines 54-57:** Create new campaign
- POST request with campaign data
- Returns created campaign

**Request payload:**
```typescript
{
  zone_id: "zone-123",
  message: "Welcome to our store!",
  trigger: "zone_entry",
  name: "Welcome Campaign"
}
```

### Method: activateCampaign

```typescript
async activateCampaign(id: number): Promise<Campaign> {
  const response = await api.put<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`, { active: true });
  return response.data;
}
```
- **Lines 74-77:** Activate campaign
- PUT request to `/campaigns/:id`
- Sends `{ active: true }`
- Backend automatically deactivates other campaigns with same zone+trigger

### Method: deactivateCampaign

```typescript
async deactivateCampaign(id: number): Promise<Campaign> {
  const response = await api.put<Campaign>(`${CAMPAIGNS_ENDPOINT}/${id}`, { active: false });
  return response.data;
}
```
- **Lines 83-86:** Deactivate campaign
- Similar to activate, but sets `active: false`

### What This File Does (Layman):

This file contains all the **"campaign actions"** your app can do:
- 📋 **Get campaigns** (fetch list)
- ➕ **Create campaign** (add new)
- ✏️ **Update campaign** (change details)
- ❌ **Delete campaign** (remove)
- ✅ **Activate** (turn on)
- 🔴 **Deactivate** (turn off)

---

## 📄 File: `src/services/zoneService.ts`

**Purpose:** All zone-related API calls

Similar structure to campaignService. Key methods:

```typescript
async getAllZones(filters?: ZoneFilters): Promise<ZoneListResponse>
```
- Fetch all zones with optional filters

```typescript
async getZoneById(id: string): Promise<Zone>
```
- Get single zone details

```typescript
async getZonePerformance(): Promise<ZonePerformance[]>
```
- Get analytics for each zone (notification count, clicks, etc.)

---

## 📄 File: `src/services/analyticsService.ts`

**Purpose:** Fetch analytics data

```typescript
export interface NotificationAnalytics {
  totalTriggered: number;  // How many notifications sent
  totalClicked: number;    // How many notifications clicked
  ctr: number;            // Click-through rate (percentage)
}
```
- **Lines 13-17:** Analytics data structure

```typescript
async getNotificationAnalytics(): Promise<NotificationAnalytics> {
  const response = await api.get<BackendAnalyticsResponse>('/analytics');
  
  return {
    totalTriggered: response.data.notifications_sent || 0,
    totalClicked: response.data.clicks || 0,
    ctr: response.data.ctr || 0,
  };
}
```
- **Lines 25-33:** Fetch and transform analytics
- Backend uses snake_case (`notifications_sent`)
- Frontend uses camelCase (`totalTriggered`)
- This function converts between formats

---

## 🔄 Complete API Request Flow

```
Component calls service method
     ↓
Service method calls api.get/post/put/etc
     ↓
Request interceptor runs
     ↓
Get Firebase token from auth.currentUser
     ↓
Add token to Authorization header
     ↓
Send HTTP request to backend
     ↓
Backend receives request
     ↓
Backend verifies token with Firebase
     ↓
Backend checks admin status
     ↓
Backend processes request (database operations)
     ↓
Backend sends response
     ↓
Response interceptor runs
     ↓
If error: Log and categorize
     ↓
Return data to service method
     ↓
Service method returns to component
     ↓
Component updates UI
```

---

## 🔐 Security Flow

Every API request includes these headers:

```
Authorization: Bearer eyJhbGciOiJSUzI1NiI...  (Firebase token)
Content-Type: application/json
ngrok-skip-browser-warning: 69420
```

**Backend verification process:**
1. Extract token from Authorization header
2. Verify token signature with Firebase Admin SDK
3. Extract user email from verified token
4. Check if email exists in admins table
5. If valid admin: Process request
6. If not admin: Return 403 Forbidden

---

## 📊 Service Methods Summary

### AdminService
- `verifyAdmin()` - Check if user is admin

### CampaignService
- `getAllCampaigns()` - Fetch campaigns list
- `getCampaignById()` - Get single campaign
- `createCampaign()` - Create new campaign
- `updateCampaign()` - Update campaign
- `activateCampaign()` - Activate (and deactivate others)
- `deactivateCampaign()` - Deactivate

### ZoneService
- `getAllZones()` - Fetch zones list
- `getZoneById()` - Get single zone
- `getZonePerformance()` - Get zone analytics

### AnalyticsService
- `getNotificationAnalytics()` - Get overall analytics

---

**Next:** See [04-COMPONENTS.md](./04-COMPONENTS.md) for UI component explanations.
