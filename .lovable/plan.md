

# Make All Simulator Fields Functional + Fix GSE Data Accuracy

## Problems Identified

### 1. GSE stocks show ticker as company name
The GSE API (`dev.kwayisi.org/apis/gse/live`) only returns `name` as the ticker symbol (e.g., `"name": "MTNGH"`). The edge function maps `item.company || item.name` but the API has no `company` field, so the company name falls back to the ticker. All 37 GSE stocks are listed but with no human-readable names.

**Fix**: Add a comprehensive `gseCompanyMap` in the edge function mapping all 37 tickers to full company names (e.g., `MTNGH` -> `MTN Ghana Ltd`, `GCB` -> `GCB Bank Ltd`, `SOGEGH` -> `Société Générale Ghana`, etc.).

### 2. GSE tab only shows 10 of 37 stocks
`SimulatorInvestment.tsx` line 204: `.slice(0, 10)` artificially limits the display. All 37 stocks should be shown.

### 3. All Buy/Sell/Trade/Invest buttons are non-functional
Every button across Banking (T-Bills), Trading (Crypto, Forex, Commodities), Investment (GSE, World), and Capital Markets (Bonds, Mutual Funds, ETFs) does nothing when clicked.

### 4. Hardcoded portfolio stats
- **Investment page**: "+5.2% all time" is hardcoded (line 167)
- **Trading page**: "Open Positions: 3", "+$125.50 P/L", "+$85.20 Today's P/L" are all hardcoded (lines 120-130), balance hardcoded to $10,000 (line 35)
- **Capital Markets page**: "$15,000" balance, "18.5%" yield, "5 investments" all hardcoded (lines 39, 61, 68-69, 75)

### 5. World stocks Trade button doesn't pass context
The "Trade" link on world stocks goes to `/simulator/trade` without indicating which stock the user wants to trade.

## Technical Plan

### A. Edge Function: Fix GSE company names
**File: `supabase/functions/market-data/index.ts`**

Add a complete `gseCompanyMap` dictionary mapping all 37 current GSE tickers to their official company names:

```
AADS -> AngloGold Ashanti (Dep. Shares)
ACCESS -> Access Bank Ghana
ADB -> Agricultural Development Bank
AGA -> AngloGold Ashanti Ltd
ALLGH -> Allianz Insurance Ghana
ASG -> Aluworks Ltd (formerly)
BOPP -> Benso Oil Palm Plantation
CAL -> CalBank Ltd
CLYD -> Clydestone Ghana
CMLT -> Camelot Ghana
CPC -> Cocoa Processing Company
DASPHARMA -> Danadams Pharmaceutical
DIGICUT -> DigiCut Ltd
EGH -> Ecobank Ghana
EGL -> Enterprise Group Ltd
ETI -> Ecobank Transnational Inc
FAB -> Fan Milk Ltd (now Danone)
FML -> Fan Milk Ltd
GCB -> GCB Bank Ltd
GGBL -> Guinness Ghana Breweries
GLD -> Gold Fields Ghana (Dep. Shares)
GOIL -> GOIL PLC
HORDS -> Hords Ltd
IIL -> Intravenous Infusions Ltd
MAC -> Mega African Capital
MMH -> Mechanical Lloyd
MTNGH -> MTN Ghana Ltd
RBGH -> Republic Bank Ghana
SAMBA -> Sam Woode Ltd
SCB -> Standard Chartered Bank Ghana
SCBPREF -> Standard Chartered Bank (Pref)
SIC -> SIC Insurance Company
SOGEGH -> Société Générale Ghana
TBL -> Trust Bank Ltd (The Gambia)
TLW -> Tullow Oil Ghana
TOTAL -> TotalEnergies Marketing Ghana
UNIL -> Unilever Ghana Ltd
```

Update the `fetchGSE` function to use this map: `name: gseCompanyMap[item.name] || item.name`.

### B. Create SimulationDialog component
**New file: `src/components/simulator/SimulationDialog.tsx`**

A reusable dialog for educational simulations. It accepts:
- Asset name, price/rate, asset type (`crypto | forex | commodity | bond | fund | etf | tbill | gse-stock`)
- Shows investment amount input
- Calculates simulated outcome based on type:
  - **T-Bills**: `principal x rate x (tenor_days / 365)` = interest earned
  - **Crypto/Stocks/ETFs/GSE**: Shows quantity purchasable, projected 1-year return
  - **Forex**: Shows conversion at bid/ask
  - **Commodities**: Shows units purchasable
  - **Bonds**: Shows annual interest and maturity value
  - **Mutual Funds**: Shows units at NAV and projected return
- Displays "This is an educational simulation" disclaimer
- No database writes -- purely client-side

### C. Wire all buttons across simulator pages

**`SimulatorBanking.tsx`**: T-Bill "Simulated Investment" buttons open SimulationDialog with the bill's rate and tenor.

**`SimulatorTrading.tsx`**:
- Crypto "Trade" buttons -> SimulationDialog
- Forex Buy/Sell buttons -> SimulationDialog (shows conversion)
- Commodity Buy/Sell buttons -> SimulationDialog
- Replace hardcoded stats with real portfolio data from Supabase (or show $0/0 defaults)

**`SimulatorInvestment.tsx`**:
- Remove `.slice(0, 10)` to show all 37 GSE stocks
- GSE "Trade" buttons -> SimulationDialog
- World stocks "Trade" links -> `/simulator/trade?symbol=AAPL` (pass symbol as query param)
- Replace hardcoded "+5.2% all time" with actual calculated P/L from portfolio

**`SimulatorCapitalMarkets.tsx`**:
- Bonds "Invest" buttons -> SimulationDialog with yield calculation
- Mutual Funds "Invest" buttons -> SimulationDialog
- ETFs Buy/Sell buttons -> SimulationDialog
- Replace hardcoded portfolio stats with real data or zero defaults

**`Trade.tsx`**: Read `?symbol=` query param on mount, auto-select matching stock, open trade dialog.

### D. Replace hardcoded stats with real portfolio data
All three sub-pages (Trading, Investment, Capital Markets) will fetch the user's portfolio and holdings from Supabase and compute actual values:
- Total portfolio value = cash + sum(holdings x current_price)
- P/L = total_value - starting_balance ($500)
- Open positions = holdings count
- Today's P/L = 0 (no intraday tracking yet, show as "N/A" honestly)

## Files Changed

| File | Change |
|---|---|
| `supabase/functions/market-data/index.ts` | Add `gseCompanyMap` for all 37 GSE tickers; use in `fetchGSE` |
| `src/components/simulator/SimulationDialog.tsx` | **New** -- reusable simulation dialog |
| `src/pages/simulator/SimulatorBanking.tsx` | Wire T-Bill buttons to SimulationDialog |
| `src/pages/simulator/SimulatorTrading.tsx` | Wire all buttons; replace hardcoded stats with real portfolio data |
| `src/pages/simulator/SimulatorInvestment.tsx` | Show all 37 GSE stocks; wire buttons; fix hardcoded P/L |
| `src/pages/simulator/SimulatorCapitalMarkets.tsx` | Wire all buttons; replace hardcoded stats |
| `src/pages/Trade.tsx` | Read `?symbol=` query param to pre-select stock |

## No database changes required
All simulation calculations are client-side. The existing `execute_trade` RPC and portfolio tables handle real stock trading.

