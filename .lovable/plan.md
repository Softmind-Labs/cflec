

# Real Market Data Integration for CFLEC Simulator

## Overview

Replace all hardcoded mock data across the 4 simulator categories with live market data from free APIs. An edge function acts as a unified proxy, fetching from multiple providers and caching results to stay within free-tier limits.

## API Strategy

| Data Need | API Provider | Cost | Auth Required | Rate Limits (Free) |
|-----------|-------------|------|---------------|-------------------|
| US Stocks (NYSE/NASDAQ) | Alpaca Markets | Free | API Key + Secret | 200 req/min |
| Forex rates | Finnhub | Free | API Key | 60 req/min |
| Crypto prices | CoinGecko | Free | API Key (Demo) | 30 req/min, 10k/month |
| GSE (Ghana stocks) | GSE-API (kwayisi.org) | Free | None | No documented limit |
| Commodities (Gold, Oil) | Finnhub | Free | API Key | Shared with forex |

## Architecture

```text
Browser (React)
    |
    v
Supabase Edge Function: "market-data"
    |
    +---> /crypto    --> CoinGecko API
    +---> /stocks    --> Alpaca Markets API
    +---> /forex     --> Finnhub API
    +---> /gse       --> GSE-API (kwayisi.org)
    +---> /commodities --> Finnhub API
```

The edge function will:
- Route requests by market type (query param)
- Cache responses in-memory (60-second TTL for trading data, 5-minute for stocks)
- Normalize all responses to a consistent format
- Handle CORS for browser calls

## Secrets Required

Before building, three API keys need to be added:

| Secret Name | Where to Get It | Free Tier |
|-------------|----------------|-----------|
| `ALPACA_API_KEY` | https://app.alpaca.markets/signup (paper trading account) | Free, unlimited paper trading |
| `ALPACA_API_SECRET` | Same as above (key + secret pair) | Free |
| `FINNHUB_API_KEY` | https://finnhub.io/register | Free, 60 calls/min |
| `COINGECKO_API_KEY` | https://www.coingecko.com/en/api (Demo plan) | Free, 10k calls/month |

GSE-API requires no key.

## Edge Function: `market-data`

### Endpoints

**GET /market-data?type=crypto**
- Fetches BTC, ETH, SOL, ADA prices from CoinGecko `/simple/price`
- Returns: `{ id, name, symbol, price, change_24h, market_cap }`

**GET /market-data?type=stocks&symbols=AAPL,MSFT,GOOGL**
- Fetches latest quotes from Alpaca `/v2/stocks/snapshots`
- Returns: `{ symbol, name, price, previous_close, change_percent, day_high, day_low }`

**GET /market-data?type=forex**
- Fetches forex rates from Finnhub `/forex/rates?base=USD`
- Plus specific pairs: USD/GHS, EUR/GHS, GBP/GHS, EUR/USD, GBP/USD
- Returns: `{ pair, bid, ask, change_percent }`

**GET /market-data?type=gse**
- Fetches all GSE listed stocks from `https://dev.kwayisi.org/apis/gse`
- Returns: `{ symbol, name, price, change, volume }`

**GET /market-data?type=commodities**
- Fetches Gold (XAU), Silver (XAG), Oil from Finnhub commodity endpoints
- Returns: `{ name, symbol, price, change_percent, unit }`

### Caching Strategy
- In-memory Map with TTL per data type
- Crypto/Forex/Commodities: 60-second cache (fast-moving markets)
- Stocks/GSE: 5-minute cache (less volatile, saves API calls)
- This keeps CoinGecko well under 10k calls/month even with heavy usage

## Frontend Changes

### New: `src/hooks/useMarketData.ts`
A React Query hook that calls the edge function:

```typescript
// Usage examples:
const { data: cryptos } = useMarketData('crypto');
const { data: forex } = useMarketData('forex');
const { data: gseStocks } = useMarketData('gse');
const { data: stocks } = useMarketData('stocks', { symbols: 'AAPL,MSFT,GOOGL,AMZN,TSLA,META' });
const { data: commodities } = useMarketData('commodities');
```

- Uses `@tanstack/react-query` with `staleTime: 30000` (30s) and `refetchInterval: 60000` (1min auto-refresh)
- Shows loading skeletons while fetching
- Falls back to cached/stale data on error

### SimulatorTrading.tsx Updates
- **Forex tab**: Live bid/ask from Finnhub, auto-refreshing
- **Commodities tab**: Live Gold, Cocoa, Oil, Silver prices from Finnhub
- **Crypto tab**: Live BTC, ETH, SOL, ADA from CoinGecko (remove "Demo" label)

### SimulatorInvestment.tsx Updates
- **GSE tab**: Live prices from GSE-API replacing hardcoded `gseStocks` array
- **World Markets tab**: Live US stock prices from Alpaca replacing Supabase `mock_stocks` query
- Show "Last updated: X seconds ago" indicator

### SimulatorCapitalMarkets.tsx Updates
- **Bonds**: Keep mock data (no free API for Ghana bonds)
- **Mutual Funds**: Keep mock data (no free API for Ghana mutual funds)
- **ETFs**: Fetch ETF prices from Alpaca (GLD, SPY, etc.)

### SimulatorBanking.tsx Updates
- **Treasury Bills**: Keep current mock rates (Bank of Ghana rates don't have a free API; these can be manually updated)
- **Fixed Deposits**: Keep mock data (bank-specific, no API)
- **Savings**: No change needed

### UI Enhancements
- Add a small "Live" badge with a pulsing green dot next to real-time data
- Add "Last updated" timestamp on each market section
- Show skeleton loaders during initial fetch
- Graceful error state: "Market data temporarily unavailable" with retry button

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/market-data/index.ts` | Edge function proxy for all market APIs |
| `src/hooks/useMarketData.ts` | React Query hook for fetching market data |

## Files to Modify

| File | Changes |
|------|---------|
| `supabase/config.toml` | Add `[functions.market-data]` with `verify_jwt = false` |
| `src/pages/simulator/SimulatorTrading.tsx` | Replace mock arrays with live data hook |
| `src/pages/simulator/SimulatorInvestment.tsx` | Replace mock GSE + use Alpaca for world stocks |
| `src/pages/simulator/SimulatorCapitalMarkets.tsx` | Use Alpaca for ETFs, keep bonds/funds as mock |
| `src/pages/simulator/SimulatorBanking.tsx` | Minor: add "rates as of" note, no API change |

## Implementation Order

1. **Secrets Setup** - Request user to add Alpaca, Finnhub, and CoinGecko API keys
2. **Edge Function** - Create `market-data` edge function with all 5 endpoints
3. **React Hook** - Create `useMarketData` hook with React Query
4. **Update Simulator Pages** - Wire up each page to live data
5. **Test** - Verify all data loads correctly and fallbacks work

## What Stays as Mock Data

Some categories don't have free APIs:
- Ghana Treasury Bill rates (Bank of Ghana publishes weekly, no API)
- Ghana Fixed Deposit rates (bank-specific)
- Ghana Bonds (no free API)
- Ghana Mutual Fund NAVs (no free API)
- Savings account rates

These will keep their current mock values with a note saying "Rates as of [date]" to be periodically updated manually.

