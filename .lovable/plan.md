

# Phase 1: Hub Page Redesign — Live Portfolio Dashboard

Transform the simulator hub from a static menu into a live dashboard that reflects the user's actual wallet and positions.

## What changes

### 1. Portfolio Overview (top section)
Replace the static "$500 / Leaderboard" cards with three live stat cards:
- **Cash Available** — reads `portfolio_wallet.cash_balance` (auto-creates wallet on first visit if none exists)
- **Total Portfolio** — cash + sum of all position values (market-priced use live prices, fixed-term use invested amount)
- **Total Return** — `((total - 500) / 500) * 100%`, green if positive, red if negative

### 2. Category cards — add position summaries
Each of the 4 category cards gets a live subtitle:
- Banking: "X active deposits" or "No positions"
- Investment: "X stocks held" + mini P/L
- Trading: "X positions" + mini P/L  
- Capital Markets: "X bonds/funds" + mini P/L

Data comes from querying `positions` grouped by `simulator_type`.

### 3. "My Positions" section
Below the 4 cards, a compact table showing ALL open positions across categories:
- Asset name, category badge, current value, P/L
- Clicking a row navigates to that simulator
- Empty state: "No positions yet — pick a market to start investing"

### 4. New hook: `useSimulatorWallet`
A reusable hook that:
- Fetches or creates the user's `portfolio_wallet`
- Fetches all `positions` for the user
- Computes totals (cash, invested, portfolio value)
- Returns loading/error states

### Files to create/modify
- `src/hooks/useSimulatorWallet.ts` — new hook
- `src/pages/Simulator.tsx` — redesign with live data
- No database changes needed (tables already exist)

### Leaderboard card
Keep existing but show user's own rank + top 3 (uses existing `get_leaderboard` RPC).

