

# Comprehensive Market Data & Simulator Pages Update

## Overview

Six-part update: switch forex to Alpaca, rebuild Banking page with live T-Bills, enhance Investment page with sector tabs and search, expand Trading page with grouped data, create a reusable DataBadge component, and verify all env keys.

---

## Part 1: Switch Forex to Alpaca (Edge Function)

**File:** `supabase/functions/market-data/index.ts`

Replace the `fetchForex()` function (lines 187-280):

- Remove all Finnhub-based forex fetching logic and the `forexPairsConfig` array
- New implementation uses Alpaca endpoint: `https://data.alpaca.markets/v1beta3/forex/latest/rates`
- Auth via existing `ALPACA_API_KEY` and `ALPACA_API_SECRET` headers (`APCA-API-KEY-ID`, `APCA-API-SECRET-KEY`)
- Alpaca-supported pairs: USD/GHS, EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, EUR/GBP, XAU/USD
- For each pair, fetch the rate, compute bid/ask with a small spread, and use previous close if available for `change_percent`
- African pairs not on Alpaca (USD/NGN, USD/ZAR, EUR/GHS, GBP/GHS) remain in `forexFallback` with `simulated: true` and `_meta.source: "fallback"`
- Keep `forexFallback` array but update `_meta` source to `"alpaca"` for Alpaca-sourced items
- Cache TTL remains 60s
- Response structure unchanged: `{ pair, bid, ask, change_percent, simulated, _meta }`

---

## Part 2: Rebuild Banking Simulator Page

**File:** `src/pages/simulator/SimulatorBanking.tsx` -- full rewrite of content (same MainLayout wrapper)

### Section 1: T-Bills (Live Data)
- Import and use `useMarketData('tbills')` hook
- Display 3 cards in a responsive grid (1 col mobile, 3 col desktop)
- Each card shows: tenor heading ("91-Day T-Bill"), rate as large bold number, "Annual Yield" label, "Bank of Ghana" source in muted text, updated date, "Simulated Investment" button
- Show loading skeleton while fetching
- Show DataBadge per card based on `_meta`

### Section 2: Fixed Deposit Calculator
- Single calculator Card with inputs:
  - Principal Amount (GHS) -- number input
  - Interest Rate (% p.a.) -- number input, default 22
  - Tenure -- Select dropdown: 3, 6, 9, 12, 24 months
  - Institution -- Select dropdown: GCB Bank, Ecobank, Absa Bank, Fidelity Bank, Stanbic Bank
- "Calculate" button triggers client-side computation
- Formula: `Interest = Principal x Rate/100 x Tenure/12`
- Results section (conditionally rendered after calculate):
  - Maturity Amount, Interest Earned, Effective Monthly Rate
  - Visual bar showing Principal vs Interest proportions

### Section 3: Savings Account Rates
- Static Card with a table of 5 banks:
  - GCB Bank 8.5% GHS 50, Ecobank 9.0% GHS 100, Absa 8.0% GHS 200, Fidelity 10.5% GHS 50, Stanbic 9.5% GHS 100
- Disclaimer note: "Rates are indicative. Contact your bank for current offers."
- DataBadge showing "Simulated"

### Remove
- Remove old `glass-card` and `glass-card-primary` class references
- Remove the old portfolio overview cards (they showed hardcoded mock values)

---

## Part 3: Update Investment Page -- Stock Sector Tabs

**File:** `src/pages/simulator/SimulatorInvestment.tsx`

Changes to the World Markets tab content:

- Remove the hardcoded `symbols: 'AAPL,MSFT,GOOGL,AMZN,TSLA,META'` param -- fetch all default symbols instead
- Add a search bar above the sector tabs to filter by symbol or company name
- Add sector sub-tabs inside the World Markets tab: All | Technology | Finance | Healthcare | Energy | Consumer | ETFs
- Default tab: All
- Each stock row/card shows:
  - Symbol (bold) + Company name (muted)
  - Sector badge (small colored pill)
  - Current price (bold)
  - Change % with green/red color and arrow icon
  - Day high / Day low
  - "Trade" button
  - DataBadge per item based on `_meta.simulated`
- Remove `glass-card-green` and `glass-card` class references on portfolio overview cards
- GSE section remains unchanged

---

## Part 4: Update Trading Page

**File:** `src/pages/simulator/SimulatorTrading.tsx`

### Crypto Section
- Already fetches via `useMarketData('crypto')` -- enhance display
- Switch to a card grid layout (2 cols on md, 3 on lg)
- Each card shows: coin name + symbol, price in USD, 24h change % (green/red with arrow), market cap abbreviated (e.g. "$1.2T", "$45.6B"), "Trade" button, DataBadge
- Market cap formatting helper: values >= 1T show as "T", >= 1B as "B", >= 1M as "M"

### Forex Section
- Already fetches via `useMarketData('forex')` -- enhance display
- Group into two visual sections: "African Pairs" (USD/GHS, EUR/GHS, GBP/GHS, USD/NGN, USD/ZAR) and "Major Pairs" (rest)
- Each row shows: pair, bid, ask, spread (ask - bid, formatted to 4 decimal places for small values), change %, DataBadge
- Keep existing Buy/Sell buttons

### Commodities Section
- Already fetches via `useMarketData('commodities')` -- enhance display
- Group by category using sub-headings: "Metals", "Energy", "Agricultural"
- Each item shows: name, price + unit, change %, DataBadge
- Keep existing Buy/Sell buttons

### Remove
- Remove `glass-card-gold` and `glass-card` class references on balance cards

---

## Part 5: DataBadge Component

**New file:** `src/components/simulator/DataBadge.tsx`

```
interface DataBadgeProps {
  meta?: { source: string; cached: boolean; simulated: boolean };
}
```

Logic:
- If `meta.simulated === true`: orange dot + "Simulated"
- Else if `meta.cached === true`: blue dot + "Cached"
- Else: green dot + "Live"

Styling: small inline Badge with `variant="outline"`, 2px dot, `text-xs`, non-intrusive. Similar to existing `LiveBadge` but driven by `_meta`.

Usage: Replace the existing `LiveBadge` on Trading/Investment pages with per-item `DataBadge` where `_meta` is available. Keep `LiveBadge` for the top-level timestamp display.

---

## Part 6: Environment Variable Verification

Confirm in the edge function that all keys are accessed via `Deno.env.get()`:
- `ALPACA_API_KEY` -- already used in `fetchStocks()`, will also be used in new `fetchForex()`
- `ALPACA_API_SECRET` -- same
- `FINNHUB_API_KEY` -- used in `fetchCommodities()` (forex no longer uses it)
- `COINGECKO_API_KEY` -- used in `fetchCrypto()`

No hardcoded values. All four secrets already exist in Supabase secrets.

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/market-data/index.ts` | Modify | Replace fetchForex() with Alpaca implementation |
| `src/components/simulator/DataBadge.tsx` | Create | Reusable Live/Simulated/Cached badge component |
| `src/pages/simulator/SimulatorBanking.tsx` | Rewrite | 3 sections: live T-Bills, FD calculator, savings rates |
| `src/pages/simulator/SimulatorInvestment.tsx` | Modify | Add sector tabs, search bar, DataBadge, remove glass classes |
| `src/pages/simulator/SimulatorTrading.tsx` | Modify | Card grid crypto, grouped forex/commodities, DataBadge, remove glass classes |

### Implementation Order
1. Create DataBadge component
2. Update edge function (forex to Alpaca)
3. Deploy edge function
4. Rewrite SimulatorBanking page
5. Update SimulatorInvestment page
6. Update SimulatorTrading page
7. Test all endpoints via curl

