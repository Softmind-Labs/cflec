

# Fix: Market Data Cache Timing & GSE Data Reliability

## Problems Found

1. **Cache timing never fixed**: `useMarketData.ts` still uses `staleTime: 30_000` and `refetchInterval: 60_000` instead of the approved 5-minute intervals. This causes excessive edge function calls, leading to WORKER_LIMIT errors that make ALL market data (including GSE) fail.

2. **No `refetchOnWindowFocus: false`**: Every tab switch triggers refetch, compounding the overload.

3. **GSE API fragility**: The external GSE API (`dev.kwayisi.org/apis/gse/live`) can timeout, and the edge function call itself timed out during testing. The fallback data exists but the edge function may be hitting compute limits before it even gets to serve GSE data.

## Changes

### 1. Fix `src/hooks/useMarketData.ts`
Both `useMarketData` and `useMarketDataWithTimestamp` hooks:
- `staleTime`: 30,000 → **300,000** (5 min)
- `refetchInterval`: 60,000 → **300,000** (5 min)  
- Add `refetchOnWindowFocus: false`

### 2. Harden GSE fetch in edge function (`supabase/functions/market-data/index.ts`)
- Add a timeout (5 seconds) to the GSE API fetch using `AbortController` so it fails fast and falls back to `gseFallback` instead of hanging
- Apply the same timeout pattern to other external API calls (Alpaca, CoinGecko, Finnhub) for resilience

### 3. Expand GSE fallback data
The current fallback has 15 stocks with stale placeholder prices. Ensure all 37 GSE tickers from `gseCompanyMap` are in the fallback so users always see the full list even when the API is down.

| File | Change |
|---|---|
| `src/hooks/useMarketData.ts` | Fix staleTime, refetchInterval, add refetchOnWindowFocus |
| `supabase/functions/market-data/index.ts` | Add AbortController timeout to GSE fetch (and other APIs), expand GSE fallback to all 37 tickers |

