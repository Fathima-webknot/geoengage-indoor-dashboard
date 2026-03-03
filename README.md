# 🎯 GeoEngage Admin Web Dashboard

Web-based admin panel for managing indoor location-based campaigns, analytics tracking, and zone performance monitoring.

---

## 📋 **Project Overview**

**GeoEngage Admin Dashboard** provides administrators with a powerful interface to:
- ✅ Create and manage location-based notification campaigns
- ✅ Monitor zone performance and engagement analytics
- ✅ Activate/deactivate campaigns in real-time
- ✅ Track click-through rates (CTR) and user interactions
- ✅ Manage admin profiles with Google authentication

---

## 🛠️ **Tech Stack**

- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite 5+
- **UI Library:** Material-UI (MUI) v5
- **State Management:** React Context API + React Query
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Authentication:** Firebase Auth (Google Sign-In)
- **Form Management:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Styling:** MUI styled-components + Emotion

---

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+ and npm/yarn
- Firebase project (for authentication)
- Backend API running (GeoEngage backend)

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd geoengage-admin-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your Firebase credentials and API URL
   ```

4. **Configure environment variables in `.env`:**
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   ```
   http://localhost:5173
   ```

---

## 📁 **Project Structure**

```
geoengage-admin-web/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, logos, icons
│   ├── components/        # Reusable React components
│   │   ├── common/       # LoadingSpinner, ErrorBoundary, etc.
│   │   ├── layout/       # AdminLayout, Sidebar, Header
│   │   ├── campaigns/    # Campaign management components
│   │   ├── analytics/    # Analytics dashboard components
│   │   └── profile/      # Profile management components
│   ├── pages/            # Page components (Login, Campaigns, Analytics, Profile)
│   ├── services/         # API services (axios, auth, campaigns, analytics)
│   ├── contexts/         # React contexts (AuthContext)
│   ├── hooks/            # Custom React hooks (useAuth, useCampaigns)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions (formatters, validators)
│   ├── theme/            # MUI theme configuration
│   ├── config/           # Firebase and other configs
│   ├── App.tsx           # Root component
│   └── main.tsx          # App entry point
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📜 **Available Scripts**

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

---

## 🔐 **Authentication**

The app uses **Firebase Google Sign-In** for authentication. Only users with `admin` role can access the dashboard.

**Login Flow:**
1. User clicks "Sign in with Google"
2. Firebase authentication popup appears
3. User signs in with Google account
4. Backend verifies Firebase token and checks if user has admin role
5. If admin → access granted, if not → show error and logout

**Important:** Admin users must be pre-configured in the database with `role: 'admin'`.

---

## 🌐 **Backend API Integration**

The admin dashboard connects to the GeoEngage backend API. Ensure the backend is running and accessible.

**Key Endpoints:**
- `POST /api/v1/campaigns` - Create campaign
- `GET /api/v1/campaigns` - List campaigns
- `PUT /api/v1/campaigns/{id}` - Activate/deactivate campaign
- `GET /api/v1/analytics` - Get analytics dashboard data
- `GET /api/v1/zones` - List zones for campaign targeting
- `DELETE /api/v1/campaigns/{id}` - Delete campaign (if available)

All requests include Firebase authentication token in headers.

---

## 📊 **Key Features**

### **Campaign Management**
- Create campaigns with zone targeting and custom messages
- Activate/deactivate campaigns instantly
- View all active and past campaigns
- Delete campaigns with confirmation

### **Analytics Dashboard**
- View summary metrics (Total Entries, Notifications Sent, Clicks, Avg CTR)
- Zone-wise performance breakdown
- Sortable performance tables
- CTR color-coding for quick insights

### **Profile Management**
- View admin information (Google account details)
- Display role badge and account creation date
- Logout functionality

---

## 🔧 **Development Workflow**

This project follows a **phase-based development approach** with organized commits:

### **Phase 1: Project Setup & Configuration** ✅
- ✅ Commit 1: Initialize React + Vite + TypeScript
- 🔄 Commit 2: Add Material-UI theme
- 🔄 Commit 3: Configure Firebase authentication
- 🔄 Commit 4: Set up Axios API service

### **Phase 2: Authentication & Layout**
- Login page with Google Sign-In
- Protected routes
- Admin layout with sidebar and header

### **Phase 3: Campaigns Management**
- Campaign CRUD operations
- Zone selection and targeting
- Campaign list and actions

### **Phase 4: Analytics Dashboard**
- Metrics cards
- Zone performance tables
- Charts and visualizations

### **Phase 5: Profile Management**
- Admin profile display
- Account information
- Logout functionality

### **Phase 6: Polish & Refinements**
- Loading states and error handling
- Responsive design
- Performance optimization

---

## 🚢 **Deployment**

### **Build for Production**
```bash
npm run build
```

### **Recommended Platforms**
- **Vercel** (easy deployment for Vite projects)
- **Netlify**
- **Firebase Hosting**
- **AWS S3 + CloudFront**

### **Environment Variables**
Ensure all environment variables are configured in your hosting platform's settings.

---

## 🧪 **Testing Checklist**

Before deploying, verify:
- [ ] Google Sign-In works correctly
- [ ] Admin role verification works
- [ ] Campaign CRUD operations work
- [ ] Analytics data displays correctly
- [ ] All routes are protected
- [ ] Responsive design on mobile/tablet
- [ ] No console errors

---

## 🤝 **Contributing**

This project follows a commit-based development workflow. Each feature is implemented in a separate commit for clean version control.

**Commit Message Format:**
```
feat: add campaign creation form
fix: resolve authentication token refresh issue
chore: update dependencies
style: improve mobile responsive layout
```

---

## 📞 **Support**

For issues or questions:
- Check the backend API documentation
- Review Firebase authentication setup
- Verify environment variables are correct
- Check browser console for errors

---

## 📝 **License**

[Your License Here]

---

**Built with ❤️ for GeoEngage Indoor Location Platform**
