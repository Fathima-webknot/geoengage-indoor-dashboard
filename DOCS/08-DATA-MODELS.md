# 📚 Data Models & TypeScript Types

## Overview
This document explains all data structures, TypeScript types, and database schemas used in the application.

---

## 📄 File: `src/types/auth.types.ts`

### User Interface

```typescript
export interface User {
  uid: string;                    // Firebase user ID (unique)
  email: string | null;           // User's email
  displayName: string | null;     // User's name from Google
  photoURL: string | null;        // Profile picture URL
  emailVerified: boolean;         // Email verification status
}
```

**Example:**
```json
{
  "uid": "abc123xyz",
  "email": "admin@example.com",
  "displayName": "John Doe",
  "photoURL": "https://lh3.googleusercontent.com/...",
  "emailVerified": true
}
```

**Layman explanation:**
This is your "digital ID card" containing:
- `uid`: Your unique user number
- `email`: Your email address
- `displayName`: Your name
- `photoURL`: Link to your profile picture
- `emailVerified`: Whether Google confirmed your email

---

### AuthContextType Interface

```typescript
export interface AuthContextType {
  currentUser: User | null;       // Current logged-in user (null if not logged in)
  firebaseUser: FirebaseUser | null;  // Firebase's full user object
  loading: boolean;               // True while checking login status
  verifying: boolean;             // True while verifying admin status
  error: string | null;           // Error message (null if no error)
  login: () => Promise<void>;     // Function to log in
  logout: () => Promise<void>;    // Function to log out
  clearError: () => void;         // Function to clear error message
}
```

**Usage in components:**
```typescript
const { currentUser, login, logout, loading, error } = useAuth();

if (loading) return <Spinner />;
if (error) return <ErrorMessage>{error}</ErrorMessage>;
if (!currentUser) return <LoginButton onClick={login} />;
return <WelcomeMessage user={currentUser} onLogout={logout} />;
```

---

## 📄 File: `src/types/campaign.types.ts`

### CampaignTrigger Enum

```typescript
export enum CampaignTrigger {
  ZONE_ENTRY = 'zone_entry',              // Triggered when user enters zone
  ZONE_EXIT_NO_TXN = 'zone_exit_no_txn',  // Triggered when user exits without transaction
}
```

**Layman explanation:**
- `ZONE_ENTRY`: Send notification when someone walks into a zone
- `ZONE_EXIT_NO_TXN`: Send notification when someone leaves without buying anything

---

### Campaign Interface

```typescript
export interface Campaign {
  id: number;                     // Unique campaign ID
  zone_id: string;                // Which zone this campaign targets
  message: string;                // Notification text to send
  name?: string | null;           // Campaign name (optional)
  active: boolean;                // Is this campaign currently running?
  trigger: CampaignTrigger;       // When to send notification
  created_at: string;             // When campaign was created (ISO date string)
  zone_name?: string;             // Zone name (added by frontend, not from API)
}
```

**Example:**
```json
{
  "id": 42,
  "zone_id": "zone-entrance-001",
  "message": "Welcome! Get 20% off today!",
  "name": "Welcome Promotion",
  "active": true,
  "trigger": "zone_entry",
  "created_at": "2025-03-09T10:30:00Z",
  "zone_name": "Main Entrance"
}
```

**Field explanations:**
| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `id` | number | Unique identifier | `42` |
| `zone_id` | string | References zones table | `"zone-entrance-001"` |
| `message` | string | Notification text | `"20% off today!"` |
| `name` | string | Campaign label | `"Welcome Promo"` |
| `active` | boolean | Currently running? | `true` |
| `trigger` | enum | When to send | `"zone_entry"` |
| `created_at` | string | Creation timestamp | `"2025-03-09T10:30:00Z"` |
| `zone_name` | string | Display name (frontend only) | `"Main Entrance"` |

---

### CreateCampaignRequest Interface

```typescript
export interface CreateCampaignRequest {
  zone_id: string;                // Required: Target zone
  message: string;                // Required: Notification message
  name: string;                   // Required: Campaign name
  trigger?: CampaignTrigger;      // Optional: Defaults to zone_entry
}
```

**Example POST /campaigns body:**
```json
{
  "zone_id": "zone-entrance-001",
  "message": "Welcome! Check out our new arrivals!",
  "name": "New Arrivals Campaign",
  "trigger": "zone_entry"
}
```

---

### UpdateCampaignRequest Interface

```typescript
export interface UpdateCampaignRequest {
  active?: boolean;               // Change active status
  message?: string;               // Update message
  name?: string;                  // Update name
  trigger?: CampaignTrigger;      // Update trigger type
}
```

**All fields are optional** - only include what you want to change.

**Example PUT /campaigns/42 body:**
```json
{
  "active": true
}
```

---

## 📄 File: `src/types/zone.types.ts`

### ZoneType Enum

```typescript
export enum ZoneType {
  ENTRANCE = 'entrance',              // Entry/exit areas
  CHECKOUT = 'checkout',              // Payment counters
  PRODUCT_SECTION = 'product_section',// Different store sections
  WAITING_AREA = 'waiting_area',      // Waiting/lounge areas
  FOOD_COURT = 'food_court',          // Food/dining areas
  PARKING = 'parking',                // Parking lots
  CUSTOM = 'custom',                  // Custom zone type
}
```

---

### Zone Interface

```typescript
export interface Zone {
  id: string;                         // Unique zone ID
  name: string;                       // Display name
  type: ZoneType;                     // Category
  description?: string;               // Optional description
  floorLevel: number;                 // Floor number (0=ground, 1=first, -1=basement)
  coordinates: ZoneCoordinates;       // GPS location
  radius: number;                     // Zone size in meters
  isActive: boolean;                  // Is zone enabled?
  metadata?: Record<string, any>;     // Extra custom data
  createdAt: string;                  // Creation timestamp
  updatedAt: string;                  // Last update timestamp
}
```

**Example:**
```json
{
  "id": "zone-entrance-001",
  "name": "Main Entrance",
  "type": "entrance",
  "description": "Primary store entrance from parking lot",
  "floorLevel": 0,
  "coordinates": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "radius": 10,
  "isActive": true,
  "metadata": {
    "hasWiFi": true,
    "capacity": 50
  },
  "createdAt": "2025-01-15T08:00:00Z",
  "updatedAt": "2025-03-09T10:00:00Z"
}
```

**Layman explanation:**
A zone is like a "geofence" or "virtual boundary":
- `name`: What you call it ("Main Entrance")
- `type`: What kind of area it is
- `coordinates`: GPS location (latitude/longitude)
- `radius`: How big the circle is (in meters)
- `isActive`: Whether it's currently monitoring

---

## 🗄️ Database Schema (Backend)

### admins Table

```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Store list of admin email addresses

**Example rows:**
| id | email | created_at |
|----|-------|------------|
| 1  | admin@company.com | 2025-01-01 10:00:00 |
| 2  | manager@company.com | 2025-01-05 14:30:00 |

---

### campaigns Table

```sql
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  zone_id VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  message TEXT NOT NULL,
  trigger VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Store all campaigns

**Example rows:**
| id | zone_id | name | message | trigger | active | created_at |
|----|---------|------|---------|---------|--------|------------|
| 1  | zone-001 | Welcome | Hi! | zone_entry | true | 2025-03-01 |
| 2  | zone-001 | Goodbye | Thanks! | zone_exit_no_txn | false | 2025-03-02 |
| 3  | zone-002 | Sale | 50% off! | zone_entry | true | 2025-03-05 |

**Key constraint:** Only one campaign can have `active=true` per unique `(zone_id, trigger)` combination.

---

### zones Table

```sql
CREATE TABLE zones (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  floor_level INTEGER DEFAULT 0,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  radius INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Store zone definitions

**Example rows:**
| id | name | type | floor_level | latitude | longitude | radius | is_active |
|----|------|------|-------------|----------|-----------|--------|-----------|
| zone-001 | Entrance | entrance | 0 | 37.7749 | -122.4194 | 10 | true |
| zone-002 | Electronics | product_section | 1 | 37.7750 | -122.4195 | 15 | true |

---

### notification_logs Table

```sql
CREATE TABLE notification_logs (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id),
  user_id VARCHAR(255),
  triggered_at TIMESTAMP DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMP
);
```

**Purpose:** Track notification performance for analytics

**Example rows:**
| id | campaign_id | user_id | triggered_at | clicked | clicked_at |
|----|-------------|---------|--------------|---------|------------|
| 1  | 1  | user-abc | 2025-03-09 10:00 | true | 2025-03-09 10:01 |
| 2  | 1  | user-xyz | 2025-03-09 10:05 | false | null |
| 3  | 2  | user-abc | 2025-03-09 11:00 | false | null |

**Analytics calculations:**
```sql
-- Total notifications sent
SELECT COUNT(*) FROM notification_logs;

-- Total clicks
SELECT COUNT(*) FROM notification_logs WHERE clicked = true;

-- Click-through rate (CTR)
SELECT 
  (COUNT(CASE WHEN clicked THEN 1 END) * 100.0 / COUNT(*)) as ctr
FROM notification_logs;
```

---

## 🔄 Data Flow: Frontend ↔ Backend

### GET /campaigns

**Request:**
```
GET https://api.geoengage.com/api/v1/campaigns
Headers: {
  Authorization: Bearer <firebase-token>
}
```

**Backend Query:**
```sql
SELECT * FROM campaigns ORDER BY active DESC, trigger ASC;
```

**Response:**
```json
[
  {
    "id": 1,
    "zone_id": "zone-001",
    "name": "Welcome Campaign",
    "message": "Welcome!",
    "trigger": "zone_entry",
    "active": true,
    "created_at": "2025-03-01T10:00:00Z"
  }
]
```

**Frontend Processing:**
```typescript
// Fetch campaigns and zones
const campaigns = await campaignService.getAllCampaigns();
const zones = await zoneService.getAllZones();

// Create lookup map
const zoneMap = new Map();
zones.forEach(zone => zoneMap.set(zone.id, zone.name));

// Enrich campaigns
const enriched = campaigns.map(campaign => ({
  ...campaign,
  zone_name: zoneMap.get(campaign.zone_id) || 'Unknown'
}));
```

---

### POST /campaigns

**Request:**
```
POST https://api.geoengage.com/api/v1/campaigns
Headers: {
  Authorization: Bearer <token>,
  Content-Type: application/json
}
Body: {
  "zone_id": "zone-001",
  "name": "Welcome Promo",
  "message": "Get 20% off!",
  "trigger": "zone_entry"
}
```

**Backend Query:**
```sql
INSERT INTO campaigns (zone_id, name, message, trigger, active, created_at)
VALUES ($1, $2, $3, $4, false, NOW())
RETURNING *;
```

**Response:**
```json
{
  "id": 42,
  "zone_id": "zone-001",
  "name": "Welcome Promo",
  "message": "Get 20% off!",
  "trigger": "zone_entry",
  "active": false,
  "created_at": "2025-03-09T10:30:00Z"
}
```

---

### PUT /campaigns/:id (Activate)

**Request:**
```
PUT https://api.geoengage.com/api/v1/campaigns/42
Body: { "active": true }
```

**Backend Queries:**
```sql
-- 1. Get campaign details
SELECT zone_id, trigger FROM campaigns WHERE id = 42;

-- 2. Deactivate conflicting campaigns
UPDATE campaigns 
SET active = false 
WHERE zone_id = 'zone-001' 
  AND trigger = 'zone_entry' 
  AND id != 42;

-- 3. Activate requested campaign
UPDATE campaigns 
SET active = true, updated_at = NOW()
WHERE id = 42
RETURNING *;
```

**Response:**
```json
{
  "id": 42,
  "active": true,
  "..."
}
```

---

## 📊 Type Conversion: snake_case ↔ camelCase

### Backend uses snake_case

```json
{
  "notification_sent": 100,
  "zone_id": "zone-001",
  "created_at": "2025-03-09"
}
```

### Frontend uses camelCase

```typescript
{
  notificationSent: 100,
  zoneId: "zone-001",
  createdAt: "2025-03-09"
}
```

### Conversion in Services

```typescript
// analyticsService.ts
const response = await api.get('/analytics');

// Backend returns snake_case
// {
//   notifications_sent: 100,
//   clicks: 25,
//   ctr: 25.0
// }

// Convert to camelCase for frontend
return {
  totalTriggered: response.data.notifications_sent,
  totalClicked: response.data.clicks,
  ctr: response.data.ctr
};
```

---

## 🎯 Quick Type Reference

### Most Common Types

```typescript
// User logged in?
const { currentUser } = useAuth();
if (currentUser) {
  console.log(currentUser.email); // string | null
}

// Campaign
const campaign: Campaign = {
  id: 1,
  zone_id: "zone-001",
  message: "Hello!",
  active: true,
  trigger: CampaignTrigger.ZONE_ENTRY,
  created_at: "2025-03-09T10:00:00Z"
};

// Zone
const zone: Zone = {
  id: "zone-001",
  name: "Entrance",
  type: ZoneType.ENTRANCE,
  floorLevel: 0,
  coordinates: { latitude: 37.7749, longitude: -122.4194 },
  radius: 10,
  isActive: true,
  createdAt: "2025-01-01",
  updatedAt: "2025-03-09"
};
```

---

**Next:** See [08-QUICK-REFERENCE.md](./08-QUICK-REFERENCE.md) for cheat sheet.
