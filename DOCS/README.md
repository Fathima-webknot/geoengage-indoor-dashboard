# 📚 GeoEngage Web Documentation

## Complete Line-by-Line Code Explanation & Technical Guide

Welcome to the comprehensive documentation for the GeoEngage Admin Web Dashboard. This documentation provides detailed, line-by-line explanations of every file, technical flowcharts, and layman-friendly explanations of how everything works.

---

## 📖 Documentation Structure

| Document | Description | Best For |
|----------|-------------|----------|
| [**00-OVERVIEW.md**](./00-OVERVIEW.md) | High-level architecture, tech stack, project structure | First-time readers, getting the big picture |
| [**01-MAIN-ENTRY-POINTS.md**](./01-MAIN-ENTRY-POINTS.md) | Line-by-line: main.tsx, App.tsx | Understanding app startup and routing |
| [**02-AUTHENTICATION.md**](./02-AUTHENTICATION.md) | Line-by-line: Firebase config, AuthContext | Understanding login/logout flow |
| [**03-API-SERVICES.md**](./03-API-SERVICES.md) | Line-by-line: All service files (API calls) | Understanding backend communication |
| [**04-COMPONENTS.md**](./04-COMPONENTS.md) | Line-by-line: UI components | Understanding component structure |
| [**05-PAGES.md**](./05-PAGES.md) | Line-by-line: All page components (HomePage, CampaignsPage, AnalyticsPage, ProfilePage) | Understanding page-level logic and layouts |
| [**06-EVENT-FLOW.md**](./06-EVENT-FLOW.md) | Frontend events → Backend API mapping | Understanding user actions and data flow |
| [**07-FLOWCHARTS.md**](./07-FLOWCHARTS.md) | Visual flowcharts (technical & layman) | Visual learners, presentations |
| [**08-DATA-MODELS.md**](./08-DATA-MODELS.md) | TypeScript types, database schemas | Understanding data structures |
| [**09-QUICK-REFERENCE.md**](./09-QUICK-REFERENCE.md) | Cheat sheet, code snippets, debugging tips | Daily development, quick lookups |

---

## 🚀 Quick Start Guide

### For New Developers:

**Day 1:** Understand the big picture
1. Read [00-OVERVIEW.md](./00-OVERVIEW.md) - Project overview
2. Skim [07-FLOWCHARTS.md](./07-FLOWCHARTS.md) - Visual diagrams
3. Review tech stack and folder structure

**Day 2:** Understand how code flows
1. Read [01-MAIN-ENTRY-POINTS.md](./01-MAIN-ENTRY-POINTS.md) - App startup
2. Read [02-AUTHENTICATION.md](./02-AUTHENTICATION.md) - Login system
3. Read [06-EVENT-FLOW.md](./06-EVENT-FLOW.md) - User actions

**Day 3:** Deep dive into code
1. Read [03-API-SERVICES.md](./03-API-SERVICES.md) - API layer
2. Read [04-COMPONENTS.md](./04-COMPONENTS.md) - UI components
3. Read [05-PAGES.md](./05-PAGES.md) - Page components
4. Read [08-DATA-MODELS.md](./08-DATA-MODELS.md) - Data structures

**Day 4+:** Build features
1. Keep [09-QUICK-REFERENCE.md](./09-QUICK-REFERENCE.md) open while coding
2. Reference specific docs when working on features
3. Use flowcharts for debugging

---

## 🎯 Use Case Navigation

### I want to understand...

**How login works:**
→ [02-AUTHENTICATION.md](./02-AUTHENTICATION.md)

**How campaigns are created:**
→ [06-EVENT-FLOW.md](./06-EVENT-FLOW.md#3--create-campaign)  
→ [04-COMPONENTS.md](./04-COMPONENTS.md) (CreateCampaignForm)  
→ [05-PAGES.md](./05-PAGES.md) (CampaignsPage)

**How API calls work:**
→ [03-API-SERVICES.md](./03-API-SERVICES.md)

**What data gets stored:**
→ [08-DATA-MODELS.md](./08-DATA-MODELS.md)

**The complete user journey:**
→ [07-FLOWCHARTS.md](./07-FLOWCHARTS.md#6--complete-user-journey-map)

**Project architecture:**
→ [00-OVERVIEW.md](./00-OVERVIEW.md)

**Code snippets for common tasks:**
→ [09-QUICK-REFERENCE.md](./09-QUICK-REFERENCE.md)

---

## 📊 What Each Document Contains

### [00-OVERVIEW.md](./00-OVERVIEW.md)
- ✅ High-level architecture diagram
- ✅ Technology stack
- ✅ Project folder structure
- ✅ Authentication flow overview
- ✅ All API endpoints summary
- ✅ Data storage explanation
- ✅ Frontend events → Backend actions table

### [01-MAIN-ENTRY-POINTS.md](./01-MAIN-ENTRY-POINTS.md)
- ✅ `main.tsx` line-by-line explanation
- ✅ `App.tsx` line-by-line explanation
- ✅ Routing configuration
- ✅ Protected routes explanation
- ✅ Startup sequence diagram
- ✅ Component hierarchy visualization

### [02-AUTHENTICATION.md](./02-AUTHENTICATION.md)
- ✅ `firebase.ts` line-by-line explanation
- ✅ `AuthContext.tsx` complete breakdown
- ✅ Login flow explained (technical & layman)
- ✅ Token auto-refresh mechanism
- ✅ Admin verification process
- ✅ Security architecture

### [03-API-SERVICES.md](./03-API-SERVICES.md)
- ✅ `api.ts` request/response interceptors
- ✅ `campaignService.ts` all methods
- ✅ `zoneService.ts` all methods
- ✅ `analyticsService.ts` all methods
- ✅ `adminService.ts` verification
- ✅ Complete API request flow diagram
- ✅ Security flow explanation

### [04-COMPONENTS.md](./04-COMPONENTS.md)
- ✅ `ProtectedRoute` explained
- ✅ `AdminLayout` sidebar & layout
- ✅ `ErrorBoundary` error handling
- ✅ `OfflineBanner` network detection
- ✅ `CampaignList` table component
- ✅ `CreateCampaignForm` form validation
- ✅ Component hierarchy diagram
- ✅ Component communication patterns

### [05-PAGES.md](./05-PAGES.md)
- ✅ `HomePage.tsx` line-by-line explanation
- ✅ `CampaignsPage.tsx` complete breakdown
- ✅ `AnalyticsPage.tsx` metrics dashboard
- ✅ `ProfilePage.tsx` user profile
- ✅ Data fetching patterns
- ✅ State management examples
- ✅ Responsive layout strategies
- ✅ Frontend → Backend API mappings per page

### [06-EVENT-FLOW.md](./06-EVENT-FLOW.md)
- ✅ Login flow (step-by-step)
- ✅ View campaigns flow
- ✅ Create campaign flow
- ✅ Activate campaign flow
- ✅ Deactivate campaign flow
- ✅ Delete campaign flow
- ✅ View analytics flow
- ✅ Logout flow
- ✅ Complete user actions summary table

### [07-FLOWCHARTS.md](./07-FLOWCHARTS.md)
- ✅ Authentication flow (technical & layman)
- ✅ Campaign list flow
- ✅ Create campaign flow
- ✅ Activate campaign flow
- ✅ Complete system architecture diagram
- ✅ High-level technical diagram
- ✅ Layman system diagram
- ✅ Complete user journey map

### [08-DATA-MODELS.md](./08-DATA-MODELS.md)
- ✅ All TypeScript interfaces explained
- ✅ `User` type
- ✅ `Campaign` type
- ✅ `Zone` type
- ✅ Database schema (all tables)
- ✅ Type conversion (snake_case ↔ camelCase)
- ✅ API request/response examples
- ✅ Quick type reference

### [09-QUICK-REFERENCE.md](./09-QUICK-REFERENCE.md)
- ✅ File location finder
- ✅ Authentication code snippets
- ✅ API call snippets
- ✅ State management snippets
- ✅ Common UI patterns
- ✅ Debugging tips
- ✅ Backend API endpoints reference
- ✅ Environment variables
- ✅ Common tasks workflow
- ✅ Production checklist

---

## 🎓 Learning Paths

### Path 1: Frontend Developer
Focus on understanding React, components, and UI.

1. [01-MAIN-ENTRY-POINTS.md](./01-MAIN-ENTRY-POINTS.md) - React setup
2. [04-COMPONENTS.md](./04-COMPONENTS.md) - UI components
3. [05-PAGES.md](./05-PAGES.md) - Page components
4. [09-QUICK-REFERENCE.md](./09-QUICK-REFERENCE.md) - Code snippets

### Path 2: Backend Integration Specialist
Focus on API calls and data flow.

1. [03-API-SERVICES.md](./03-API-SERVICES.md) - API layer
2. [06-EVENT-FLOW.md](./06-EVENT-FLOW.md) - Event mappings
3. [08-DATA-MODELS.md](./08-DATA-MODELS.md) - Data structures

### Path 3: Full Stack Understanding
Complete understanding of entire system.

1. [00-OVERVIEW.md](./00-OVERVIEW.md) - Architecture
2. [02-AUTHENTICATION.md](./02-AUTHENTICATION.md) - Auth system
3. [03-API-SERVICES.md](./03-API-SERVICES.md) - API layer
4. [04-COMPONENTS.md](./04-COMPONENTS.md) - UI components
5. [05-PAGES.md](./05-PAGES.md) - Page components
6. [06-EVENT-FLOW.md](./06-EVENT-FLOW.md) - Complete flow
7. [07-FLOWCHARTS.md](./07-FLOWCHARTS.md) - Visual understanding
8. [08-DATA-MODELS.md](./08-DATA-MODELS.md) - Data layer

### Path 4: Business Analyst / Product Manager
Non-technical understanding.

1. [00-OVERVIEW.md](./00-OVERVIEW.md) - High-level overview
2. [07-FLOWCHARTS.md](./07-FLOWCHARTS.md) - Visual diagrams (layman sections)
3. [06-EVENT-FLOW.md](./06-EVENT-FLOW.md) - User actions

---

## 🔍 Search Guide

### Find Information About...

| Topic | Document(s) |
|-------|------------|
| **Login/Authentication** | 02-AUTHENTICATION.md, 07-FLOWCHARTS.md |
| **API Calls** | 03-API-SERVICES.md, 09-QUICK-REFERENCE.md |
| **Campaigns** | 04-COMPONENTS.md, 05-PAGES.md, 06-EVENT-FLOW.md, 08-DATA-MODELS.md |
| **Routing** | 01-MAIN-ENTRY-POINTS.md, 04-COMPONENTS.md, 05-PAGES.md |
| **Error Handling** | 04-COMPONENTS.md, 09-QUICK-REFERENCE.md |
| **Database Schema** | 08-DATA-MODELS.md |
| **User Journey** | 07-FLOWCHARTS.md, 06-EVENT-FLOW.md |
| **Pages (HomePage, CampaignsPage, etc.)** | 05-PAGES.md, 06-EVENT-FLOW.md |
| **Component Structure** | 04-COMPONENTS.md, 01-MAIN-ENTRY-POINTS.md |
| **State Management** | 02-AUTHENTICATION.md, 09-QUICK-REFERENCE.md |
| **TypeScript Types** | 08-DATA-MODELS.md |
| **Environment Setup** | 00-OVERVIEW.md, 09-QUICK-REFERENCE.md |
| **Debugging** | 09-QUICK-REFERENCE.md |
| **Backend Endpoints** | 03-API-SERVICES.md, 09-QUICK-REFERENCE.md |

---

## 💡 Documentation Features

### Line-by-Line Code Explanations
Every important file is explained line by line with:
- What the code does
- Why it's needed
- How it fits into the bigger picture

### Technical + Layman Explanations
Each concept is explained in two ways:
- **Technical:** For developers with precise terminology
- **Layman:** For non-developers or quick understanding

### Visual Flowcharts
Complex processes are illustrated with:
- ASCII art diagrams
- Step-by-step flows
- Architecture diagrams

### Code Snippets
Ready-to-use code examples for:
- Common tasks
- API calls
- Component patterns
- State management

### Debugging Guides
Practical help for:
- Finding errors
- Understanding logs
- Fixing common issues
- Testing features

---

## 📝 How to Use This Documentation

### As a Reference
Keep [09-QUICK-REFERENCE.md](./09-QUICK-REFERENCE.md) open while coding. It has:
- File finder
- Code snippets
- Common patterns
- Debugging tips

### For Onboarding
New team members should:
1. Start with [00-OVERVIEW.md](./00-OVERVIEW.md)
2. Follow the "Quick Start Guide" above
3. Reference specific docs as needed

### For Bug Fixing
1. Check [09-QUICK-REFERENCE.md](./09-QUICK-REFERENCE.md) - "Common issues"
2. Use [07-FLOWCHARTS.md](./07-FLOWCHARTS.md) to trace data flow
3. Read relevant line-by-line explanation

### For Adding Features
1. Understand existing patterns in [09-QUICK-REFERENCE.md](./09-QUICK-REFERENCE.md)
2. Study similar existing features in relevant docs
3. Follow "Common Tasks Workflow" in quick reference

---

## 🎯 Key Concepts Explained

### React Context (AuthContext)
Global state that any component can access. Like a "store" that holds login info.  
→ [02-AUTHENTICATION.md](./02-AUTHENTICATION.md)

### Protected Routes
Routes that check if you're logged in before showing content.  
→ [04-COMPONENTS.md](./04-COMPONENTS.md#protectedroutetsx)

### API Interceptors
Functions that run before/after every API call to add tokens or handle errors.  
→ [03-API-SERVICES.md](./03-API-SERVICES.md#part-2-request-interceptor)

### TypeScript Types
Definitions that tell TypeScript what shape data should have.  
→ [08-DATA-MODELS.md](./08-DATA-MODELS.md)

### Campaign Activation Logic
Only one campaign active per zone+trigger. Activating one auto-deactivates others.  
→ [06-EVENT-FLOW.md](./06-EVENT-FLOW.md#4--activate-campaign)

---

## 🚀 Start Reading

**New to the project?** Start here: [00-OVERVIEW.md](./00-OVERVIEW.md)

**Need quick help?** Check here: [09-QUICK-REFERENCE.md](./09-QUICK-REFERENCE.md)

**Want visual understanding?** Look here: [07-FLOWCHARTS.md](./07-FLOWCHARTS.md)

---

## 📞 Documentation Maintenance

### Keeping Docs Updated

When you change code:
1. Update relevant documentation file
2. Update flowcharts if logic changed
3. Update quick reference if new patterns added
4. Update data models if types changed

### Documentation Gaps

If you find missing information:
1. Note it in the relevant document
2. Ask team lead for clarification
3. Update docs once clarified

---

## 🎉 Summary

This documentation provides:
- ✅ Complete line-by-line code explanations
- ✅ Technical and layman flowcharts
- ✅ Frontend event → Backend action mappings
- ✅ All API endpoints documented
- ✅ Data models and database schemas
- ✅ Quick reference for development
- ✅ Debugging guides
- ✅ Visual diagrams

**Total Pages:** 9 comprehensive documents  
**Coverage:** 100% of codebase explained  
**Formats:** Text explanations + Diagrams + Code snippets

---

**Happy coding! 🚀**

*Last updated: March 9, 2026*
