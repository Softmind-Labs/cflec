

# Phase 2: Trade History & Position Management

Add a trade history view and enhance positions with sell/close capabilities so users can manage their portfolio end-to-end.

## What to build

### 1. Trade History section on Hub page
Below "My Positions", add a "Recent Activity" section showing the last 10 trades from the `trades` table:
- Columns: Date, Asset, Type (buy/sell/invest badge), Quantity, Price, Total
- Color-coded type badges (green=buy/invest, red=sell)
- "View All" link to a full trade history page (future)

### 2. Sell/Close flow on simulator pages
Currently TradePanel only handles `buy` and `invest`. Enhance each simulator page to show the user's existing positions for that category and offer a "Sell" / "Close" button:
- **Trading page**: Show "Your Positions" section above market data with current holdings and a Sell button per position
- **Investment page**: Same pattern for stock holdings
- **Banking page**: Show active deposits with maturity info; "Withdraw Early" option
- **Capital Markets**: Show bond/fund holdings with close option

### 3. Hub positions table — add Sell action
Add a "Sell" button column to the My Positions table on the hub. Clicking opens TradePanel in sell mode with the position's details pre-filled.

### Files to create/modify
| File | Change |
|---|---|
| `src/pages/Simulator.tsx` | Add "Recent Activity" section querying `trades` table; add Sell button to positions table |
| `src/pages/simulator/SimulatorTrading.tsx` | Add "Your Positions" section showing trading positions with Sell buttons |
| `src/pages/simulator/SimulatorInvestment.tsx` | Add "Your Positions" section for stock holdings |
| `src/pages/simulator/SimulatorBanking.tsx` | Add "Active Deposits" section with maturity info |
| `src/pages/simulator/SimulatorCapitalMarkets.tsx` | Add "Your Holdings" section |
| `src/hooks/useSimulatorWallet.ts` | Add `trades` fetch + expose `recentTrades` array |

### No database changes needed
All tables (`trades`, `positions`, `portfolio_wallet`) and the `execute_simulator_trade` RPC already exist and support sell operations.

