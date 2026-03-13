

# Phase 1B: Universal Trade Execution

Replace the client-side-only `SimulationDialog` with a real trade system that persists to the new unified tables (`portfolio_wallet`, `positions`, `trades`).

## Overview

Currently, Buy/Sell buttons across all 4 simulator categories open a `SimulationDialog` that only calculates hypothetical outcomes. This phase makes trades real — deducting from the shared $500 wallet, creating positions, and logging every trade.

## What to build

### 1. Database RPC: `execute_simulator_trade`
A `SECURITY DEFINER` function (like the existing `execute_trade`) that:
- Locks the user's `portfolio_wallet` row (`FOR UPDATE`)
- Validates: sufficient cash (buy) or sufficient position quantity (sell)
- On **buy**: deducts cash, creates or updates a `positions` row, logs to `trades`
- On **sell**: adds cash back, reduces or deletes position, logs to `trades`
- On **invest** (fixed-term like T-Bills/bonds): deducts cash, creates position with `interest_rate`, `term_days`, `maturity_date`
- Returns the new cash balance and trade details
- Accepts: `p_simulator_type`, `p_category`, `p_asset_symbol`, `p_asset_name`, `p_position_type`, `p_trade_type` (buy/sell/invest), `p_quantity`, `p_price`, optional `p_interest_rate`, `p_term_days`

### 2. New component: `TradePanel` (Sheet)
A slide-in Sheet (from right) that replaces `SimulationDialog` for wallet-backed trades:
- Shows asset name, current price, wallet cash balance
- Input for quantity (market assets) or amount (fixed-term)
- Live total calculation
- "Confirm Trade" button calls the RPC
- Success: toast + closes panel + triggers `refetch` on the wallet hook
- Reusable across all 4 simulator pages

### 3. Wire up simulator pages
Each page's Buy/Sell buttons open the new `TradePanel` instead of `SimulationDialog`:
- **Banking**: T-Bill "Invest" → `TradePanel` with `position_type='fixed_term'`, `interest_rate`, `term_days`
- **Investment**: GSE/World stock "Trade" → `TradePanel` with `position_type='market'`
- **Trading**: Crypto/Forex/Commodity Buy/Sell → `TradePanel` with `position_type='market'`
- **Capital Markets**: Bond/Fund/ETF "Invest" → `TradePanel`

The existing `SimulationDialog` stays available as a secondary "What-if Calculator" option but is no longer the primary action.

### Files
- **New migration**: `execute_simulator_trade` RPC function
- **New**: `src/components/simulator/TradePanel.tsx`
- **Edit**: All 4 simulator pages to use `TradePanel`
- **Keep**: `SimulationDialog` as-is (optional educational tool)

### Key design decisions
- The RPC uses server-side price validation where possible (for `mock_stocks` it reads the price from DB; for live market assets the client passes the price since there's no server-side price table for forex/crypto/commodities)
- Quantity is decimal (not integer) to support fractional crypto/forex
- Fixed-term positions set `maturity_date = now() + term_days` and `is_matured = false`

