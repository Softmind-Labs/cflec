

# CFLP Platform - Complete Implementation Plan

## Executive Summary

This plan outlines the complete implementation of the Certified Financial Literacy Platform (CFLP) - a scalable learning platform with three user types (Kids, High Schoolers, Adults), certificate-based progression, and an integrated stock trading simulator.

The implementation is organized into **6 phases** to ensure we build a solid foundation before adding complex features.

---

## Phase 1: Database Foundation & Core Schema

### 1.1 Database Tables to Create

**Enums:**
```text
account_type: 'kid' | 'high_schooler' | 'adult'
certificate_level: 'green' | 'white' | 'gold' | 'blue'
subscription_status: 'active' | 'cancelled' | 'expired' | 'pending'
```

**Core Tables:**

| Table | Purpose |
|-------|---------|
| `profiles` | User profile data (account type, DOB, phone, subscription info) |
| `modules` | Learning content metadata (title, description, certificate level, order) |
| `module_content` | Video URLs, text content, images for each module |
| `quizzes` | Quiz questions and answers per module |
| `user_progress` | Track video completion, quiz scores, simulation completion |
| `certificates` | Earned certificates per user |
| `portfolios` | Trading simulator - cash balance, created date |
| `stock_holdings` | Current stock positions per portfolio |
| `transactions` | Buy/sell transaction history |
| `mock_stocks` | Simulated stock data (symbol, name, current price) |
| `leaderboard` | User rankings based on portfolio performance |

### 1.2 Security Setup

- Row Level Security (RLS) on all tables
- Security definer functions for role checks
- Profiles table linked to `auth.users` via trigger

---

## Phase 2: Authentication System

### 2.1 Three Login Methods

| Method | Implementation |
|--------|----------------|
| Email + Password | Native Supabase Auth |
| Phone + OTP | Simulated OTP for MVP (store in profiles) |
| Phone + DOB + Mother's Name | Custom verification against profiles table |

### 2.2 Pages to Create

- `/auth` - Main authentication page with login/signup tabs
- `/auth/register` - Multi-step registration with account type selection

### 2.3 Registration Flow

```text
Step 1: Select Account Type (Kid/High Schooler/Adult)
Step 2: Enter Details (name, email/phone, DOB, security questions)
Step 3: Create Password
Step 4: Email Verification
Step 5: Redirect to Subscription Payment
```

### 2.4 Key Components

- `AuthProvider` context for session management
- `ProtectedRoute` wrapper for authenticated pages
- `LoginForm` with method selector tabs
- `RegisterForm` with multi-step wizard

---

## Phase 3: Landing Page & Portal Selection

### 3.1 Landing Page (`/`)

**Sections:**
- Hero with value proposition
- Feature highlights (certificates, simulator, learning paths)
- Testimonials placeholder
- Dual CTA buttons: "Adult/Teen Portal" and "Kids Portal"
- Footer with links

**Design Notes:**
- Professional, clean aesthetic (Coursera/LinkedIn Learning style)
- Certificate colors featured prominently (Green, White, Gold, Blue)

### 3.2 Kids Portal Entry (`/kids`)

- Colorful, playful design
- Large friendly buttons
- Character mascot placeholder
- Age-appropriate language

---

## Phase 4: Dashboard & Learning System

### 4.1 Adult/High School Dashboard (`/dashboard`)

**Layout:**
```text
+------------------+------------------------+
|    Sidebar       |    Main Content        |
|  - Dashboard     |  +----------------+    |
|  - My Courses    |  | Progress Card  |    |
|  - Simulator     |  +----------------+    |
|  - Certificates  |  | Current Module |    |
|  - Profile       |  +----------------+    |
|                  |  | Leaderboard    |    |
+------------------+------------------------+
```

**Components:**
- `DashboardSidebar` - Navigation
- `ProgressCard` - Certificate progress visualization
- `CurrentModuleCard` - Continue learning CTA
- `ModuleList` - All modules with lock/unlock status
- `LeaderboardPreview` - Top 5 traders

### 4.2 Kids Dashboard (`/kids/dashboard`)

- Fun, gamified progress display
- Star/badge collection
- Current lesson with friendly character prompts
- Simple, large navigation buttons
- Colorful progress bar

### 4.3 Module System

**Module Listing Page (`/modules`):**
- Grid/list of all available modules
- Visual lock icons for inaccessible modules
- Certificate grouping (Green, White, Gold, Blue sections)
- Progress indicators

**Module Player Page (`/modules/:id`):**
- Video player with completion tracking
- Reading materials accordion
- Quiz section (triggered after video completion)
- Simulation assignment launcher (where applicable)

**Completion Logic:**
```text
Module Complete = Video Watched + Quiz Passed + (Simulation Passed if required)
```

---

## Phase 5: Stock Trading Simulator

### 5.1 Simulator Dashboard (`/simulator`)

**Sections:**
- Portfolio summary (total value, gains/losses, chart)
- Cash balance display
- Holdings table with current values
- Quick trade panel

### 5.2 Trading Interface (`/simulator/trade`)

- Stock search/selection
- Buy/Sell toggle
- Quantity input with dollar amount preview
- Order confirmation modal
- Transaction success/failure feedback

### 5.3 Mock Stock Data

**Initial stocks to seed:**
| Symbol | Name | Initial Price |
|--------|------|---------------|
| AAPL | Apple Inc. | $175.50 |
| GOOGL | Alphabet Inc. | $140.25 |
| MSFT | Microsoft Corp. | $378.90 |
| AMZN | Amazon.com Inc. | $178.15 |
| TSLA | Tesla Inc. | $245.60 |
| META | Meta Platforms | $485.30 |
| NVDA | NVIDIA Corp. | $875.40 |
| JPM | JPMorgan Chase | $195.20 |

**Price Simulation:**
- Edge function to randomly adjust prices within realistic ranges
- Runs on user request or scheduled intervals
- Ready for real API integration later

### 5.4 Leaderboard (`/simulator/leaderboard`)

- Rankings by portfolio total value
- Top 10 display with user avatars
- Current user's rank highlighted
- Filter by account type (optional)

---

## Phase 6: Certificates & Profile

### 6.1 Certificate Gallery (`/certificates`)

- Visual certificate cards (Green, White, Gold, Blue)
- Earned vs. locked state
- Progress percentage toward next certificate
- Download certificate as image (future)

### 6.2 Profile Page (`/profile`)

- Account details (name, email, account type)
- Subscription status and management link
- Learning statistics
- Settings (password change, notification preferences)

---

## Technical Architecture

### File Structure

```text
src/
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── DashboardSidebar.tsx
│   │   ├── ProgressCard.tsx
│   │   ├── ModuleCard.tsx
│   │   └── LeaderboardPreview.tsx
│   ├── kids/
│   │   ├── KidsHeader.tsx
│   │   ├── KidsProgressBar.tsx
│   │   └── KidsModuleCard.tsx
│   ├── modules/
│   │   ├── VideoPlayer.tsx
│   │   ├── QuizComponent.tsx
│   │   ├── ReadingMaterials.tsx
│   │   └── SimulationLauncher.tsx
│   ├── simulator/
│   │   ├── PortfolioSummary.tsx
│   │   ├── StockSearch.tsx
│   │   ├── TradePanel.tsx
│   │   ├── HoldingsTable.tsx
│   │   └── TransactionHistory.tsx
│   ├── certificates/
│   │   └── CertificateCard.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── KidsLayout.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useModules.ts
│   ├── useProgress.ts
│   ├── usePortfolio.ts
│   └── useLeaderboard.ts
├── lib/
│   ├── utils.ts
│   └── constants.ts
├── pages/
│   ├── Index.tsx (Landing)
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── Modules.tsx
│   ├── ModulePlayer.tsx
│   ├── Simulator.tsx
│   ├── Trade.tsx
│   ├── Leaderboard.tsx
│   ├── Certificates.tsx
│   ├── Profile.tsx
│   ├── kids/
│   │   ├── KidsLanding.tsx
│   │   ├── KidsDashboard.tsx
│   │   └── KidsModulePlayer.tsx
│   └── NotFound.tsx
└── types/
    └── index.ts
```

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useAuth` | Session, login, logout, user data |
| `useModules` | Fetch modules, check unlock status |
| `useProgress` | Track/update user progress |
| `usePortfolio` | Portfolio data, holdings, transactions |
| `useLeaderboard` | Fetch leaderboard rankings |
| `useStocks` | Mock stock prices, price updates |

### Design System Additions

**CSS Variables to Add:**
```text
--cflp-green: 142 76% 36%
--cflp-white: 0 0% 95%
--cflp-gold: 45 93% 47%
--cflp-blue: 217 91% 60%
--cflp-kids-primary: 280 87% 63%
--cflp-kids-secondary: 45 100% 51%
```

---

## Implementation Order

### Sprint 1 (Foundation)
1. Database migration with all tables and RLS
2. Design system updates (colors, typography)
3. Landing page with dual portals
4. Basic layout components (Header, Footer, Sidebar)

### Sprint 2 (Authentication)
5. Auth pages (login, register)
6. AuthProvider and ProtectedRoute
7. Multi-method login implementation
8. Registration flow with account type

### Sprint 3 (Learning Core)
9. Dashboard pages (Adult and Kids versions)
10. Module listing with lock/unlock logic
11. Module player (video, reading materials)
12. Quiz component with scoring

### Sprint 4 (Trading Simulator)
13. Portfolio and simulator dashboard
14. Mock stocks data and price simulation
15. Trade interface (buy/sell)
16. Holdings and transaction history
17. Leaderboard

### Sprint 5 (Certificates & Polish)
18. Certificate gallery and progress tracking
19. Profile page
20. Kids portal complete styling
21. Responsive design pass
22. Error handling and loading states

### Sprint 6 (Payments - Later)
23. Stripe integration for subscriptions
24. Subscription management page

---

## Database Migration SQL Preview

The migration will include:
- 3 custom enums (account_type, certificate_level, subscription_status)
- 11 tables with proper foreign keys and constraints
- RLS policies for all tables
- Trigger to auto-create profile on user signup
- Security definer functions for role checks
- Seed data for modules and mock stocks

---

## Ready to Build

Upon approval, I will:
1. Create the complete database schema via migration
2. Update the design system with CFLP colors
3. Build the landing page
4. Implement authentication
5. Continue through each sprint systematically

This plan ensures a solid, scalable foundation that can handle your first 1,000+ users while maintaining clean code architecture.

