

# Complete Feature Implementation Plan

## Overview

This consolidated plan implements all requested features:
1. **3-Step Signup Wizard** - Credentials, Bank Account Setup (Ghanaian KYC), and Checkout (GHS 312/year)
2. **4-Category Market Simulator** - Banking, Investment, Trading, and Capital Markets
3. **Region-Based Leaderboard** - Country and regional rankings (Ghana regions)
4. **Glassmorphic Dashboard** - Modern glass-effect UI styling

---

## 1. Three-Step Signup Wizard

### Step Flow

```text
Step 1: Credentials          Step 2: Bank Account         Step 3: Checkout
+--------------------+       +--------------------+       +--------------------+
| Full Name          |       | Have bank account? |       | Plan: GHS 312/year |
| Email              |       | [Yes] [No]         |       |                    |
| Account Type       |       |                    |       | - All 27 modules   |
| Date of Birth      |       | If NO, select bank:|       | - Trading simulator|
| Phone              |       | [ABSA, Fidelity,   |       | - 4 certificates   |
| Country            |       |  Ecobank, GCB,     |       | - Leaderboard      |
| Region             |       |  Access, UMB, UBA] |       |                    |
| Mother's Name      |       |                    |       | Payment Method:    |
| Password           |       | KYC Information:   |       | [Mobile Money]     |
| Confirm Password   |       | - Ghana Card #     |       | [Card]             |
|                    |       | - Expiry Date      |       |                    |
| [Next Step ->]     |       | - Occupation       |       | [Complete Signup]  |
+--------------------+       | - Source of Income |       +--------------------+
                             | - Upload Documents |
                             |                    |
                             | [<- Back] [Next ->]|
                             +--------------------+
```

### Ghanaian Banks List
| Bank Code | Full Name |
|-----------|-----------|
| `absa` | Absa Bank Ghana |
| `fidelity` | Fidelity Bank Ghana |
| `ecobank` | Ecobank Ghana |
| `gcb` | GCB Bank |
| `access` | Access Bank Ghana |
| `umb` | Universal Merchant Bank |
| `uba` | United Bank for Africa Ghana |

### Ghana Regions
Greater Accra, Ashanti, Western, Central, Eastern, Volta, Northern, Upper East, Upper West, Bono, Bono East, Ahafo, Western North, Oti, North East, Savannah

### Subscription Pricing
- **Annual Plan**: GHS 312/year
- This replaces the previously planned GHS 99/month

---

## 2. Four-Category Market Simulator

### Simulator Hub Layout

```text
/simulator (Hub Page)
+----------------------------------------------------------+
|  Choose Your Market Category                              |
+----------------------------------------------------------+
|                                                           |
|  +------------------+    +------------------+              |
|  | BANKING          |    | INVESTMENT       |              |
|  | Treasury Bills   |    | Ghana Stock      |              |
|  | Fixed Deposits   |    |   Exchange       |              |
|  | Savings Accounts |    | World Stock      |              |
|  | [Enter ->]       |    |   Market         |              |
|  +------------------+    | [Enter ->]       |              |
|                          +------------------+              |
|                                                           |
|  +------------------+    +------------------+              |
|  | TRADING          |    | CAPITAL MARKETS  |              |
|  | Forex            |    | Bonds            |              |
|  | Commodities      |    | Mutual Funds     |              |
|  | Crypto (Demo)    |    | ETFs             |              |
|  | [Enter ->]       |    | [Enter ->]       |              |
|  +------------------+    +------------------+              |
|                                                           |
+----------------------------------------------------------+
```

### Market Categories Detail

| Category | Sub-Markets | Description |
|----------|-------------|-------------|
| **Banking** | Treasury Bills (91, 182, 364 days), Fixed Deposits, Savings | Low-risk, guaranteed returns simulation |
| **Investment** | GSE Stocks (Ghana Stock Exchange), World Stocks (NYSE, NASDAQ) | Stock trading with real company names |
| **Trading** | Forex (GHS/USD, EUR/GHS), Commodities (Gold, Cocoa), Crypto Demo | Short-term trading simulation |
| **Capital Markets** | Government Bonds, Mutual Funds, ETFs | Long-term investment vehicles |

### New Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/simulator` | `Simulator.tsx` | Hub with 4 category cards |
| `/simulator/banking` | `SimulatorBanking.tsx` | T-Bills, FD, Savings |
| `/simulator/investment` | `SimulatorInvestment.tsx` | Stock exchanges |
| `/simulator/trading` | `SimulatorTrading.tsx` | Forex, Commodities |
| `/simulator/capital-markets` | `SimulatorCapitalMarkets.tsx` | Bonds, Funds |

---

## 3. Region-Based Leaderboard

### Leaderboard Scope Tabs

```text
+----------------------------------------------------------+
|  Leaderboard                                              |
|  [Ghana] [West Africa] [Global]                           |
+----------------------------------------------------------+
|                                                           |
|  Filter by Region: [Greater Accra v]                      |
|                                                           |
|  Your Rankings:                                           |
|  #12 in Greater Accra | #45 in Ghana | #234 Global        |
|                                                           |
+----------------------------------------------------------+
|  Top 3 Podium (for selected scope)                        |
+----------------------------------------------------------+
|  Full Rankings List                                       |
+----------------------------------------------------------+
```

### User Profile Fields (New)
- `country` - Default: 'Ghana'
- `region` - Selected Ghana region (Greater Accra, Ashanti, etc.)

### West African Countries
Ghana, Nigeria, Senegal, Cote d'Ivoire, Cameroon, Mali, Burkina Faso, Niger, Guinea, Benin, Togo, Sierra Leone, Liberia, Mauritania, Gambia, Guinea-Bissau, Cape Verde

---

## 4. Glassmorphic Dashboard Design

### Glass Card Styles

| Class | Effect | Usage |
|-------|--------|-------|
| `glass-card` | White/80 blur, subtle shadow | Stats, lists |
| `glass-card-primary` | Blue/10 tint, blur | Primary actions |
| `glass-card-gold` | Gold/10 tint, blur | Achievements, leaderboard |

### Dashboard Visual Updates

```text
+----------------------------------------------------------+
| Background: gradient from-primary/5 via-bg to-gold/5      |
+----------------------------------------------------------+
|                                                           |
|  +-------------+ +-------------+ +-------------+ +-------+|
|  | GLASS CARD  | | GLASS CARD  | | GLASS CARD  | | GLASS ||
|  | Modules     | | Certificate | | Quiz Rate   | | Streak||
|  | Completed   | | Progress    | |             | |       ||
|  +-------------+ +-------------+ +-------------+ +-------+|
|                                                           |
|  +--------------------------------+ +--------------------+|
|  | GLASS-CARD-PRIMARY             | | GLASS-CARD-PRIMARY ||
|  | Continue Learning              | | Trading Simulator  ||
|  | Current Module                 | |                    ||
|  +--------------------------------+ +--------------------+|
|                                                           |
|  +--------------------------------+ +--------------------+|
|  | GLASS-CARD                     | | GLASS-CARD-GOLD    ||
|  | Upcoming Modules               | | Top Traders        ||
|  |                                | | Leaderboard        ||
|  +--------------------------------+ +--------------------+|
|                                                           |
+----------------------------------------------------------+
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/auth/SignupWizard.tsx` | Main wizard container with step management |
| `src/components/auth/steps/CredentialsStep.tsx` | Step 1: Account credentials + country/region |
| `src/components/auth/steps/BankAccountStep.tsx` | Step 2: Bank selection and KYC |
| `src/components/auth/steps/CheckoutStep.tsx` | Step 3: GHS 312/year checkout |
| `src/pages/simulator/SimulatorBanking.tsx` | Banking products simulation |
| `src/pages/simulator/SimulatorInvestment.tsx` | Stock trading (GSE + World) |
| `src/pages/simulator/SimulatorTrading.tsx` | Forex, Commodities, Crypto |
| `src/pages/simulator/SimulatorCapitalMarkets.tsx` | Bonds, Mutual Funds, ETFs |

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/constants.ts` | Add banks, regions, countries, subscription price |
| `src/types/index.ts` | Add new types (banks, KYC, markets, regions) |
| `src/index.css` | Add glassmorphic utility classes |
| `src/pages/Auth.tsx` | Replace signup form with SignupWizard |
| `src/pages/Dashboard.tsx` | Apply glassmorphic styling, gradient background |
| `src/pages/Simulator.tsx` | Redesign as market category hub |
| `src/pages/Leaderboard.tsx` | Add tabs (Ghana/West Africa/Global), region filter |
| `src/App.tsx` | Add new simulator routes |

---

## Technical Details

### New Type Definitions

```typescript
// Ghanaian Banks
export type GhanaianBank = 'absa' | 'fidelity' | 'ecobank' | 'gcb' | 'access' | 'umb' | 'uba';

// Bank Account Info
export interface BankAccountInfo {
  hasExistingAccount: boolean;
  selectedBank?: GhanaianBank;
  ghanaCardNumber?: string;
  ghanaCardExpiry?: string;
  occupation?: string;
  sourceOfIncome?: string;
}

// Market Categories
export type MarketCategory = 'banking' | 'investment' | 'trading' | 'capital_markets';

// Treasury Bill
export interface TreasuryBill {
  id: string;
  term_days: 91 | 182 | 364;
  interest_rate: number;
  min_investment: number;
}

// Extended Leaderboard Entry
export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  account_type: AccountType;
  country: string;
  region: string | null;
  cash_balance: number;
  holdings_value: number;
  total_value: number;
}
```

### Constants to Add

```typescript
export const SUBSCRIPTION_PRICE = {
  amount: 312,
  currency: 'GHS',
  period: 'year',
  formatted: 'GHS 312/year',
} as const;

export const GHANAIAN_BANKS = {
  absa: 'Absa Bank Ghana',
  fidelity: 'Fidelity Bank Ghana',
  ecobank: 'Ecobank Ghana',
  gcb: 'GCB Bank',
  access: 'Access Bank Ghana',
  umb: 'Universal Merchant Bank',
  uba: 'United Bank for Africa Ghana',
} as const;

export const GHANA_REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 
  'Eastern', 'Volta', 'Northern', 'Upper East', 
  'Upper West', 'Bono', 'Bono East', 'Ahafo', 
  'Western North', 'Oti', 'North East', 'Savannah',
] as const;
```

### Glassmorphic CSS Classes

```css
@layer utilities {
  .glass-card {
    @apply bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl 
           border border-white/30 dark:border-gray-700/30 
           shadow-lg shadow-black/5 rounded-lg;
  }
  .glass-card-primary {
    @apply bg-primary/10 backdrop-blur-xl 
           border border-primary/20 
           shadow-lg shadow-primary/5 rounded-lg;
  }
  .glass-card-gold {
    @apply bg-cflp-gold/10 backdrop-blur-xl 
           border border-cflp-gold/20 
           shadow-lg shadow-cflp-gold/5 rounded-lg;
  }
}
```

---

## Implementation Order

1. **Phase 1: Foundation**
   - Update `src/lib/constants.ts` with banks, regions, pricing
   - Update `src/types/index.ts` with new type definitions
   - Add glassmorphic utilities to `src/index.css`

2. **Phase 2: Dashboard Enhancement**
   - Apply glassmorphic styling to `src/pages/Dashboard.tsx`
   - Add gradient background

3. **Phase 3: Signup Wizard**
   - Create step components (Credentials, Bank, Checkout)
   - Create SignupWizard container
   - Integrate into `src/pages/Auth.tsx`

4. **Phase 4: Simulator Hub**
   - Redesign `src/pages/Simulator.tsx` as category hub
   - Create 4 new simulator pages
   - Update routes in `src/App.tsx`

5. **Phase 5: Leaderboard**
   - Update `src/pages/Leaderboard.tsx` with scope tabs
   - Add region filter

