

# Fix and Expand Market-Data Edge Function

## Overview

Comprehensive overhaul of the `market-data` edge function: remove all `Math.random()`, add API key validation, expand coverage across all asset classes, add T-Bills, add `_meta` data quality fields, and update the frontend hook types to match.

## Changes

### 1. Edge Function (`supabase/functions/market-data/index.ts`)

**Cache TTLs** -- Replace the two constants with per-type TTLs:

| Type | TTL |
|------|-----|
| Crypto | 60s |
| Stocks | 120s |
| Forex | 60s |
| GSE | 600s |
| Commodities | 120s |
| T-Bills | 86400s |

**API Key Validation** -- Each fetch function checks for its required key at the top. If missing, logs `console.warn()` and returns fallback data immediately with `_meta.source: "fallback"`.

**fetchCrypto()** changes:
- Expand IDs to: bitcoin, ethereum, solana, cardano, binancecoin, ripple, dogecoin, avalanche-2, chainlink, polkadot, uniswap, litecoin, stellar, algorand
- Expand nameMap with all 14 coins
- Add `_meta` field to response

**fetchStocks(symbols)** changes:
- Default symbols expanded to ~60 stocks covering US Tech, Finance, Healthcare, Energy, Consumer, and ETFs
- Expand nameMap with all new symbols and proper company names
- Add `sector` field to each stock object using a sectorMap
- Add `_meta` field

**fetchForex()** changes:
- Remove `Math.random()` for `change_percent`
- Fetch real previous close from Finnhub's quote endpoint (`/api/v1/quote?symbol=OANDA:USD_GHS`) for each pair to compute real change
- If quote endpoint fails, set `change_percent: 0` and `simulated: true`
- Expand pairs: USD/GHS, EUR/GHS, GBP/GHS, USD/NGN, USD/ZAR, EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, EUR/GBP, XAU/USD
- Add `_meta` field

**fetchGSE()** changes:
- Update fallback with 15 stocks at current approximate prices: MTN (2.20), GCB (6.50), GOIL (2.10), SCB (25.00), TOTAL (4.50), FML (1.80), ECOBANK (9.50), GGBL (1.15), CAL (1.60), EGL (3.40), BOPP (3.80), UNIL (12.00), SOGEGH (1.05), ACCESS (4.20), MTNGH (2.20)
- Add `_meta` field

**fetchCommodities()** changes:
- Remove `Math.random()` for `change_percent`
- For metals (XAU, XAG): fetch current rate and use a second call or stored previous rate to compute real change. If unavailable, set `change_percent: 0` and `simulated: true`
- Expand to 10 commodities with `category` field: Gold (metal), Silver (metal), Crude Oil WTI (energy), Brent Crude (energy), Natural Gas (energy), Cocoa (agricultural), Coffee (agricultural), Corn (agricultural), Wheat (agricultural), Copper (metal)
- Non-metal commodities use Finnhub commodity candle endpoint where possible, fallback with `simulated: true`
- Add `_meta` field

**New fetchTBills() function:**
- Returns Bank of Ghana T-Bill rates as static data
- Structure: `{ tenor: "91-day", rate: 27.5, type: "Treasury Bill", currency: "GHS", updated: "2025-02-22", source: "Bank of Ghana" }`
- Three entries: 91-day, 182-day, 364-day
- Uses 86400s cache TTL
- Add `_meta` field with source: "bog" (Bank of Ghana)

**Switch/case update:**
- Add `case "tbills"` calling `fetchTBills()`
- Update error message to include "tbills" in valid types list

**Response wrapper:**
- Every response includes `_meta: { source, cached, simulated }` per item
- The `getCached` function is updated to return `{ data, cached: true }` when cache hit
- Each fetch function wraps items with `_meta` before returning

### 2. Frontend Hook (`src/hooks/useMarketData.ts`)

- Add `'tbills'` to the `MarketType` union
- Add `TBillData` interface: `{ tenor, rate, type, currency, updated, source }`
- Add `sector` field to `StockData`
- Add `simulated?: boolean` and `_meta?: { source: string; cached: boolean; simulated: boolean }` to all data interfaces
- Add `category?: string` to `CommodityData`
- Update `MarketDataMap` to include `tbills: TBillData[]`

### 3. Frontend Type (`src/types/index.ts`)

No changes needed -- the existing types are for DB mock stocks, not market data API.

---

## Technical Details

### Files Modified

| File | Summary |
|------|---------|
| `supabase/functions/market-data/index.ts` | Full rewrite of function body (same structure, CORS, serve pattern preserved) |
| `src/hooks/useMarketData.ts` | Add TBillData interface, update MarketType union, add sector/simulated/category fields |

### Math.random() Removal Strategy

| Function | Current | New Approach |
|----------|---------|-------------|
| fetchForex | `Math.random() * 0.6 - 0.3` | Fetch Finnhub quote for forex symbol, compute `(current - previousClose) / previousClose * 100`. Fallback: `change_percent: 0, simulated: true` |
| fetchCommodities | `Math.random() * 2 - 1` | For metals: use Finnhub forex/rates twice (current vs cached previous) or candle endpoint. For others: use candle endpoint. Fallback: `change_percent: 0, simulated: true` |

### _meta Field Structure

Each data item gets an `_meta` object:
```text
{
  source: "alpaca" | "coingecko" | "finnhub" | "gse" | "bog" | "fallback",
  cached: true | false,
  simulated: true | false
}
```

The top-level response also includes a global `_meta`:
```text
{
  data: [...items with _meta...],
  timestamp: 1234567890,
  _meta: { source: "alpaca", cached: false, simulated: false }
}
```

### Default Stock Symbols (60 total)

US Tech (15): AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, AMD, INTC, CRM, ORCL, ADBE, NFLX, UBER, PYPL

Finance (10): JPM, BAC, GS, V, MA, BRK.B, C, WFC, AXP, MS

Healthcare (8): JNJ, PFE, UNH, ABBV, MRK, LLY, BMY, AMGN

Energy (5): XOM, CVX, COP, SLB, EOG

Consumer (8): WMT, MCD, KO, PEP, NKE, SBUX, DIS, HD

ETFs (10): SPY, QQQ, GLD, VTI, IVV, AGG, VEA, EEM, IAU, SLV

### Expanded Crypto (14 coins)

bitcoin (BTC), ethereum (ETH), solana (SOL), cardano (ADA), binancecoin (BNB), ripple (XRP), dogecoin (DOGE), avalanche-2 (AVAX), chainlink (LINK), polkadot (DOT), uniswap (UNI), litecoin (LTC), stellar (XLM), algorand (ALGO)

### Implementation Order

1. Rewrite the edge function with all expansions
2. Update the frontend hook types
3. Deploy the edge function
4. Test each endpoint type via curl
