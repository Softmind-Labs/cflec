import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();

// Per-type TTLs (ms)
const CACHE_TTL: Record<string, number> = {
  crypto: 60_000,
  stocks: 120_000,
  forex: 60_000,
  gse: 600_000,
  commodities: 120_000,
  tbills: 86_400_000,
};

function getCached(key: string, type: string): { data: unknown; cached: true } | null {
  const ttl = CACHE_TTL[type] ?? 60_000;
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttl) return { data: entry.data, cached: true };
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

function meta(source: string, cached: boolean, simulated: boolean) {
  return { source, cached, simulated };
}

// ─── FETCH WITH TIMEOUT ───────────────────────────────────────────
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// ─── CRYPTO ────────────────────────────────────────────────────────
async function fetchCrypto() {
  const hit = getCached("crypto", "crypto");
  if (hit) return { data: hit.data, _meta: meta("coingecko", true, false) };

  const apiKey = Deno.env.get("COINGECKO_API_KEY") || "";
  if (!apiKey) {
    console.warn("COINGECKO_API_KEY not set – returning fallback crypto data");
    const fallback = Object.entries(cryptoNameMap).map(([id, info]) => ({
      id, name: info.name, symbol: info.symbol, price: 0, change_24h: 0, market_cap: 0,
      _meta: meta("fallback", false, true),
    }));
    return { data: fallback, _meta: meta("fallback", false, true) };
  }

  const ids = Object.keys(cryptoNameMap).join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;

  const headers: Record<string, string> = { accept: "application/json" };
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

  try {
    const res = await fetchWithTimeout(url, { headers }, 8000);
    if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
    const raw = await res.json();

    const data = Object.entries(raw).map(([id, v]: [string, any]) => ({
      id,
      name: cryptoNameMap[id]?.name || id,
      symbol: cryptoNameMap[id]?.symbol || id.toUpperCase(),
      price: v.usd,
      change_24h: v.usd_24h_change ?? 0,
      market_cap: v.usd_market_cap ?? 0,
      _meta: meta("coingecko", false, false),
    }));

    setCache("crypto", data);
    return { data, _meta: meta("coingecko", false, false) };
  } catch (e) {
    console.error("CoinGecko fetch failed:", e);
    const fallback = Object.entries(cryptoNameMap).map(([id, info]) => ({
      id, name: info.name, symbol: info.symbol, price: 0, change_24h: 0, market_cap: 0,
      _meta: meta("fallback", false, true),
    }));
    return { data: fallback, _meta: meta("fallback", false, true) };
  }
}

const cryptoNameMap: Record<string, { name: string; symbol: string }> = {
  bitcoin: { name: "Bitcoin", symbol: "BTC" },
  ethereum: { name: "Ethereum", symbol: "ETH" },
  solana: { name: "Solana", symbol: "SOL" },
  cardano: { name: "Cardano", symbol: "ADA" },
  binancecoin: { name: "BNB", symbol: "BNB" },
  ripple: { name: "XRP", symbol: "XRP" },
  dogecoin: { name: "Dogecoin", symbol: "DOGE" },
  "avalanche-2": { name: "Avalanche", symbol: "AVAX" },
  chainlink: { name: "Chainlink", symbol: "LINK" },
  polkadot: { name: "Polkadot", symbol: "DOT" },
  uniswap: { name: "Uniswap", symbol: "UNI" },
  litecoin: { name: "Litecoin", symbol: "LTC" },
  stellar: { name: "Stellar", symbol: "XLM" },
  algorand: { name: "Algorand", symbol: "ALGO" },
};

// ─── STOCKS ────────────────────────────────────────────────────────
const DEFAULT_SYMBOLS = [
  "AAPL","MSFT","GOOGL","AMZN","TSLA","META","NVDA","AMD","INTC","CRM","ORCL","ADBE","NFLX","UBER","PYPL",
  "JPM","BAC","GS","V","MA","BRK.B","C","WFC","AXP","MS",
  "JNJ","PFE","UNH","ABBV","MRK","LLY","BMY","AMGN",
  "XOM","CVX","COP","SLB","EOG",
  "WMT","MCD","KO","PEP","NKE","SBUX","DIS","HD",
  "SPY","QQQ","GLD","VTI","IVV","AGG","VEA","EEM","IAU","SLV",
].join(",");

const stockNameMap: Record<string, string> = {
  AAPL:"Apple Inc.",MSFT:"Microsoft Corp.",GOOGL:"Alphabet Inc.",AMZN:"Amazon.com Inc.",TSLA:"Tesla Inc.",
  META:"Meta Platforms Inc.",NVDA:"NVIDIA Corp.",AMD:"AMD Inc.",INTC:"Intel Corp.",CRM:"Salesforce Inc.",
  ORCL:"Oracle Corp.",ADBE:"Adobe Inc.",NFLX:"Netflix Inc.",UBER:"Uber Technologies",PYPL:"PayPal Holdings",
  JPM:"JPMorgan Chase",BAC:"Bank of America",GS:"Goldman Sachs",V:"Visa Inc.",MA:"Mastercard Inc.",
  "BRK.B":"Berkshire Hathaway B",C:"Citigroup Inc.",WFC:"Wells Fargo",AXP:"American Express",MS:"Morgan Stanley",
  JNJ:"Johnson & Johnson",PFE:"Pfizer Inc.",UNH:"UnitedHealth Group",ABBV:"AbbVie Inc.",MRK:"Merck & Co.",
  LLY:"Eli Lilly",BMY:"Bristol-Myers Squibb",AMGN:"Amgen Inc.",
  XOM:"Exxon Mobil",CVX:"Chevron Corp.",COP:"ConocoPhillips",SLB:"Schlumberger",EOG:"EOG Resources",
  WMT:"Walmart Inc.",MCD:"McDonald's Corp.",KO:"Coca-Cola Co.",PEP:"PepsiCo Inc.",NKE:"Nike Inc.",
  SBUX:"Starbucks Corp.",DIS:"Walt Disney Co.",HD:"Home Depot Inc.",
  SPY:"SPDR S&P 500 ETF",QQQ:"Invesco QQQ Trust",GLD:"SPDR Gold Shares",VTI:"Vanguard Total Stock Mkt",
  IVV:"iShares Core S&P 500",AGG:"iShares Core US Agg Bond",VEA:"Vanguard FTSE Dev Mkts",
  EEM:"iShares MSCI Emerging Mkts",IAU:"iShares Gold Trust",SLV:"iShares Silver Trust",
};

const sectorMap: Record<string, string> = {
  AAPL:"Technology",MSFT:"Technology",GOOGL:"Technology",AMZN:"Technology",TSLA:"Technology",
  META:"Technology",NVDA:"Technology",AMD:"Technology",INTC:"Technology",CRM:"Technology",
  ORCL:"Technology",ADBE:"Technology",NFLX:"Technology",UBER:"Technology",PYPL:"Technology",
  JPM:"Finance",BAC:"Finance",GS:"Finance",V:"Finance",MA:"Finance",
  "BRK.B":"Finance",C:"Finance",WFC:"Finance",AXP:"Finance",MS:"Finance",
  JNJ:"Healthcare",PFE:"Healthcare",UNH:"Healthcare",ABBV:"Healthcare",MRK:"Healthcare",
  LLY:"Healthcare",BMY:"Healthcare",AMGN:"Healthcare",
  XOM:"Energy",CVX:"Energy",COP:"Energy",SLB:"Energy",EOG:"Energy",
  WMT:"Consumer",MCD:"Consumer",KO:"Consumer",PEP:"Consumer",NKE:"Consumer",
  SBUX:"Consumer",DIS:"Consumer",HD:"Consumer",
  SPY:"ETF",QQQ:"ETF",GLD:"ETF",VTI:"ETF",IVV:"ETF",AGG:"ETF",VEA:"ETF",EEM:"ETF",IAU:"ETF",SLV:"ETF",
};

async function fetchStocks(symbols: string) {
  const cacheKey = `stocks_${symbols}`;
  const hit = getCached(cacheKey, "stocks");
  if (hit) return { data: hit.data, _meta: meta("alpaca", true, false) };

  const apiKey = Deno.env.get("ALPACA_API_KEY") || "";
  const apiSecret = Deno.env.get("ALPACA_API_SECRET") || "";

  if (!apiKey || !apiSecret) {
    console.warn("ALPACA keys not set – returning fallback stock data");
    const fallback = symbols.split(",").map(s => ({
      symbol: s, name: stockNameMap[s] || s, sector: sectorMap[s] || "Other",
      price: 0, previous_close: 0, change_percent: 0, day_high: 0, day_low: 0,
      _meta: meta("fallback", false, true),
    }));
    return { data: fallback, _meta: meta("fallback", false, true) };
  }

  try {
    const url = `https://data.alpaca.markets/v2/stocks/snapshots?symbols=${symbols}`;
    const res = await fetchWithTimeout(url, {
      headers: { "APCA-API-KEY-ID": apiKey, "APCA-API-SECRET-KEY": apiSecret },
    }, 8000);

    if (!res.ok) throw new Error(`Alpaca error: ${res.status}`);
    const raw = await res.json();

    const data = Object.entries(raw).map(([symbol, v]: [string, any]) => ({
      symbol,
      name: stockNameMap[symbol] || symbol,
      sector: sectorMap[symbol] || "Other",
      price: v.latestTrade?.p ?? v.dailyBar?.c ?? 0,
      previous_close: v.prevDailyBar?.c ?? 0,
      change_percent: v.prevDailyBar?.c
        ? Number((((v.latestTrade?.p ?? v.dailyBar?.c ?? 0) - v.prevDailyBar.c) / v.prevDailyBar.c * 100).toFixed(2))
        : 0,
      day_high: v.dailyBar?.h ?? 0,
      day_low: v.dailyBar?.l ?? 0,
      _meta: meta("alpaca", false, false),
    }));

    setCache(cacheKey, data);
    return { data, _meta: meta("alpaca", false, false) };
  } catch (e) {
    console.error("Alpaca fetch failed:", e);
    const fallback = symbols.split(",").map(s => ({
      symbol: s, name: stockNameMap[s] || s, sector: sectorMap[s] || "Other",
      price: 0, previous_close: 0, change_percent: 0, day_high: 0, day_low: 0,
      _meta: meta("fallback", false, true),
    }));
    return { data: fallback, _meta: meta("fallback", false, true) };
  }
}

// ─── FOREX ─────────────────────────────────────────────────────────
const alpacaForexPairs = [
  { pair: "USD/GHS", base: "USD", quote: "GHS" },
  { pair: "EUR/USD", base: "EUR", quote: "USD" },
  { pair: "GBP/USD", base: "GBP", quote: "USD" },
  { pair: "USD/JPY", base: "USD", quote: "JPY" },
  { pair: "USD/CHF", base: "USD", quote: "CHF" },
  { pair: "AUD/USD", base: "AUD", quote: "USD" },
  { pair: "USD/CAD", base: "USD", quote: "CAD" },
  { pair: "EUR/GBP", base: "EUR", quote: "GBP" },
  { pair: "XAU/USD", base: "XAU", quote: "USD" },
];

const africanFallbackPairs = [
  { pair: "USD/NGN", bid: 1550.00, ask: 1555.00, change_percent: 0, simulated: true, _meta: meta("fallback", false, true) },
  { pair: "USD/ZAR", bid: 18.10, ask: 18.15, change_percent: 0, simulated: true, _meta: meta("fallback", false, true) },
  { pair: "EUR/GHS", bid: 16.20, ask: 16.35, change_percent: 0, simulated: true, _meta: meta("fallback", false, true) },
  { pair: "GBP/GHS", bid: 18.90, ask: 19.05, change_percent: 0, simulated: true, _meta: meta("fallback", false, true) },
];

const forexFallback = [
  { pair: "USD/GHS", bid: 14.85, ask: 14.95, change_percent: 0, simulated: true },
  { pair: "EUR/USD", bid: 1.085, ask: 1.087, change_percent: 0, simulated: true },
  { pair: "GBP/USD", bid: 1.268, ask: 1.270, change_percent: 0, simulated: true },
  { pair: "USD/JPY", bid: 149.80, ask: 149.90, change_percent: 0, simulated: true },
  { pair: "USD/CHF", bid: 0.878, ask: 0.880, change_percent: 0, simulated: true },
  { pair: "AUD/USD", bid: 0.652, ask: 0.654, change_percent: 0, simulated: true },
  { pair: "USD/CAD", bid: 1.355, ask: 1.357, change_percent: 0, simulated: true },
  { pair: "EUR/GBP", bid: 0.855, ask: 0.857, change_percent: 0, simulated: true },
  { pair: "XAU/USD", bid: 2920.00, ask: 2925.00, change_percent: 0, simulated: true },
];

async function fetchForex() {
  const hit = getCached("forex", "forex");
  if (hit) return { data: hit.data, _meta: meta("alpaca", true, false) };

  const apiKey = Deno.env.get("ALPACA_API_KEY") || "";
  const apiSecret = Deno.env.get("ALPACA_API_SECRET") || "";

  if (!apiKey || !apiSecret) {
    console.warn("ALPACA keys not set – returning fallback forex data");
    const fallback = [...forexFallback.map(f => ({ ...f, _meta: meta("fallback", false, true) })), ...africanFallbackPairs];
    return { data: fallback, _meta: meta("fallback", false, true) };
  }

  try {
    const currencyPairs = alpacaForexPairs.map(p => `${p.base}/${p.quote}`).join(",");
    const url = `https://data.alpaca.markets/v1beta3/forex/latest/rates?currency_pairs=${encodeURIComponent(currencyPairs)}`;
    const res = await fetchWithTimeout(url, {
      headers: { "APCA-API-KEY-ID": apiKey, "APCA-API-SECRET-KEY": apiSecret },
    }, 8000);

    if (!res.ok) throw new Error(`Alpaca forex error: ${res.status}`);
    const raw = await res.json();
    const rates = raw.rates || {};

    const alpacaResults = alpacaForexPairs.map((cfg) => {
      const rateKey = `${cfg.base}/${cfg.quote}`;
      const r = rates[rateKey];

      if (r && r.bp && r.ap) {
        const bid = Number(r.bp);
        const ask = Number(r.ap);
        const prevClose = r.pc ?? 0;
        const mid = (bid + ask) / 2;
        const change = prevClose > 0 ? Number(((mid - prevClose) / prevClose * 100).toFixed(2)) : 0;
        const simulated = prevClose === 0;
        return {
          pair: cfg.pair, bid, ask, change_percent: change, simulated,
          _meta: meta("alpaca", false, simulated),
        };
      }

      const fb = forexFallback.find(f => f.pair === cfg.pair);
      return {
        pair: cfg.pair, bid: fb?.bid ?? 0, ask: fb?.ask ?? 0,
        change_percent: 0, simulated: true,
        _meta: meta("fallback", false, true),
      };
    });

    const data = [...alpacaResults, ...africanFallbackPairs];
    setCache("forex", data);
    return { data, _meta: meta("alpaca", false, false) };
  } catch (e) {
    console.error("Alpaca forex failed:", e);
    const fallback = [...forexFallback.map(f => ({ ...f, _meta: meta("fallback", false, true) })), ...africanFallbackPairs];
    return { data: fallback, _meta: meta("fallback", false, true) };
  }
}

// ─── GSE ───────────────────────────────────────────────────────────
const gseCompanyMap: Record<string, string> = {
  AADS: "AngloGold Ashanti (Dep. Shares)",
  ACCESS: "Access Bank Ghana",
  ADB: "Agricultural Development Bank",
  AGA: "AngloGold Ashanti Ltd",
  ALLGH: "Allianz Insurance Ghana",
  ASG: "Aluworks Ltd",
  BOPP: "Benso Oil Palm Plantation",
  CAL: "CalBank Ltd",
  CLYD: "Clydestone Ghana",
  CMLT: "Camelot Ghana",
  CPC: "Cocoa Processing Company",
  DASPHARMA: "Danadams Pharmaceutical",
  DIGICUT: "DigiCut Ltd",
  EGH: "Ecobank Ghana",
  EGL: "Enterprise Group Ltd",
  ETI: "Ecobank Transnational Inc",
  FAB: "Fan Milk Ltd (Danone)",
  FML: "Fan Milk Ltd",
  GCB: "GCB Bank Ltd",
  GGBL: "Guinness Ghana Breweries",
  GLD: "Gold Fields Ghana (Dep. Shares)",
  GOIL: "GOIL PLC",
  HORDS: "Hords Ltd",
  IIL: "Intravenous Infusions Ltd",
  MAC: "Mega African Capital",
  MMH: "Mechanical Lloyd",
  MTNGH: "MTN Ghana Ltd",
  RBGH: "Republic Bank Ghana",
  SAMBA: "Sam Woode Ltd",
  SCB: "Standard Chartered Bank Ghana",
  SCBPREF: "Standard Chartered Bank (Pref)",
  SIC: "SIC Insurance Company",
  SOGEGH: "Société Générale Ghana",
  TBL: "Trust Bank Ltd (The Gambia)",
  TLW: "Tullow Oil Ghana",
  TOTAL: "TotalEnergies Marketing Ghana",
  UNIL: "Unilever Ghana Ltd",
};

async function fetchGSE() {
  const hit = getCached("gse", "gse");
  if (hit) return { data: hit.data, _meta: meta("gse", true, false) };

  try {
    const res = await fetchWithTimeout("https://dev.kwayisi.org/apis/gse/live", {}, 5000);
    if (!res.ok) throw new Error(`GSE error: ${res.status}`);
    const raw = await res.json();

    const data = (Array.isArray(raw) ? raw : []).map((item: any) => {
      const ticker = item.name || item.symbol || "";
      return {
        symbol: ticker,
        name: gseCompanyMap[ticker] || item.company || ticker,
        price: item.price ?? item.last_trade_price ?? 0,
        change: item.change ?? 0,
        volume: item.volume ?? 0,
        _meta: meta("gse", false, false),
      };
    });

    if (data.length === 0) throw new Error("GSE returned empty data");

    setCache("gse", data);
    return { data, _meta: meta("gse", false, false) };
  } catch (e) {
    console.error("GSE fetch failed:", e);
    const fallback = gseFallback.map(f => ({ ...f, _meta: meta("fallback", false, true) }));
    return { data: fallback, _meta: meta("fallback", false, true) };
  }
}

// Full GSE fallback covering all 37 tickers from gseCompanyMap
const gseFallback = [
  { symbol: "AADS", name: "AngloGold Ashanti (Dep. Shares)", price: 45.00, change: 0, volume: 0 },
  { symbol: "ACCESS", name: "Access Bank Ghana", price: 4.20, change: 0, volume: 0 },
  { symbol: "ADB", name: "Agricultural Development Bank", price: 5.80, change: 0, volume: 0 },
  { symbol: "AGA", name: "AngloGold Ashanti Ltd", price: 55.00, change: 0, volume: 0 },
  { symbol: "ALLGH", name: "Allianz Insurance Ghana", price: 0.12, change: 0, volume: 0 },
  { symbol: "ASG", name: "Aluworks Ltd", price: 0.04, change: 0, volume: 0 },
  { symbol: "BOPP", name: "Benso Oil Palm Plantation", price: 3.80, change: 0, volume: 0 },
  { symbol: "CAL", name: "CalBank Ltd", price: 1.60, change: 0, volume: 0 },
  { symbol: "CLYD", name: "Clydestone Ghana", price: 0.05, change: 0, volume: 0 },
  { symbol: "CMLT", name: "Camelot Ghana", price: 0.10, change: 0, volume: 0 },
  { symbol: "CPC", name: "Cocoa Processing Company", price: 0.03, change: 0, volume: 0 },
  { symbol: "DASPHARMA", name: "Danadams Pharmaceutical", price: 0.18, change: 0, volume: 0 },
  { symbol: "DIGICUT", name: "DigiCut Ltd", price: 0.05, change: 0, volume: 0 },
  { symbol: "EGH", name: "Ecobank Ghana", price: 9.50, change: 0, volume: 0 },
  { symbol: "EGL", name: "Enterprise Group Ltd", price: 3.40, change: 0, volume: 0 },
  { symbol: "ETI", name: "Ecobank Transnational Inc", price: 0.15, change: 0, volume: 0 },
  { symbol: "FAB", name: "Fan Milk Ltd (Danone)", price: 1.80, change: 0, volume: 0 },
  { symbol: "FML", name: "Fan Milk Ltd", price: 1.80, change: 0, volume: 0 },
  { symbol: "GCB", name: "GCB Bank Ltd", price: 6.50, change: 0, volume: 0 },
  { symbol: "GGBL", name: "Guinness Ghana Breweries", price: 1.15, change: 0, volume: 0 },
  { symbol: "GLD", name: "Gold Fields Ghana (Dep. Shares)", price: 42.00, change: 0, volume: 0 },
  { symbol: "GOIL", name: "GOIL PLC", price: 2.10, change: 0, volume: 0 },
  { symbol: "HORDS", name: "Hords Ltd", price: 0.02, change: 0, volume: 0 },
  { symbol: "IIL", name: "Intravenous Infusions Ltd", price: 0.08, change: 0, volume: 0 },
  { symbol: "MAC", name: "Mega African Capital", price: 7.50, change: 0, volume: 0 },
  { symbol: "MMH", name: "Mechanical Lloyd", price: 0.12, change: 0, volume: 0 },
  { symbol: "MTNGH", name: "MTN Ghana Ltd", price: 2.20, change: 0, volume: 0 },
  { symbol: "RBGH", name: "Republic Bank Ghana", price: 3.00, change: 0, volume: 0 },
  { symbol: "SAMBA", name: "Sam Woode Ltd", price: 0.03, change: 0, volume: 0 },
  { symbol: "SCB", name: "Standard Chartered Bank Ghana", price: 25.00, change: 0, volume: 0 },
  { symbol: "SCBPREF", name: "Standard Chartered Bank (Pref)", price: 0.50, change: 0, volume: 0 },
  { symbol: "SIC", name: "SIC Insurance Company", price: 0.06, change: 0, volume: 0 },
  { symbol: "SOGEGH", name: "Société Générale Ghana", price: 1.05, change: 0, volume: 0 },
  { symbol: "TBL", name: "Trust Bank Ltd (The Gambia)", price: 0.30, change: 0, volume: 0 },
  { symbol: "TLW", name: "Tullow Oil Ghana", price: 18.50, change: 0, volume: 0 },
  { symbol: "TOTAL", name: "TotalEnergies Marketing Ghana", price: 4.50, change: 0, volume: 0 },
  { symbol: "UNIL", name: "Unilever Ghana Ltd", price: 12.00, change: 0, volume: 0 },
];

// ─── COMMODITIES ───────────────────────────────────────────────────
const commoditiesConfig = [
  { symbol: "XAU", name: "Gold", unit: "/oz", category: "metal", finnhubBase: "XAU" },
  { symbol: "XAG", name: "Silver", unit: "/oz", category: "metal", finnhubBase: "XAG" },
  { symbol: "CL", name: "Crude Oil WTI", unit: "/bbl", category: "energy", finnhubBase: null },
  { symbol: "BZ", name: "Brent Crude", unit: "/bbl", category: "energy", finnhubBase: null },
  { symbol: "NG", name: "Natural Gas", unit: "/MMBtu", category: "energy", finnhubBase: null },
  { symbol: "CC", name: "Cocoa", unit: "/mt", category: "agricultural", finnhubBase: null },
  { symbol: "KC", name: "Coffee", unit: "/lb", category: "agricultural", finnhubBase: null },
  { symbol: "ZC", name: "Corn", unit: "/bu", category: "agricultural", finnhubBase: null },
  { symbol: "ZW", name: "Wheat", unit: "/bu", category: "agricultural", finnhubBase: null },
  { symbol: "HG", name: "Copper", unit: "/lb", category: "metal", finnhubBase: null },
];

const commodityFallback: Record<string, { price: number }> = {
  XAU: { price: 2920.00 },
  XAG: { price: 32.50 },
  CL: { price: 78.45 },
  BZ: { price: 82.30 },
  NG: { price: 3.25 },
  CC: { price: 9500.00 },
  KC: { price: 4.20 },
  ZC: { price: 4.85 },
  ZW: { price: 5.70 },
  HG: { price: 4.30 },
};

async function fetchCommodities() {
  const hit = getCached("commodities", "commodities");
  if (hit) return { data: hit.data, _meta: meta("finnhub", true, false) };

  const apiKey = Deno.env.get("FINNHUB_API_KEY") || "";
  if (!apiKey) {
    console.warn("FINNHUB_API_KEY not set – returning fallback commodity data");
    const fallback = commoditiesConfig.map(c => ({
      name: c.name, symbol: c.symbol, price: commodityFallback[c.symbol]?.price ?? 0,
      change_percent: 0, unit: c.unit, category: c.category, simulated: true,
      _meta: meta("fallback", false, true),
    }));
    return { data: fallback, _meta: meta("fallback", false, true) };
  }

  const results = await Promise.all(commoditiesConfig.map(async (c) => {
    if (c.finnhubBase) {
      try {
        const url = `https://finnhub.io/api/v1/quote?symbol=OANDA:${c.finnhubBase}_USD&token=${apiKey}`;
        const res = await fetchWithTimeout(url, {}, 5000);
        if (!res.ok) throw new Error(`${res.status}`);
        const q = await res.json();
        if (q.c && q.c > 0) {
          const change = q.pc && q.pc > 0 ? Number(((q.c - q.pc) / q.pc * 100).toFixed(2)) : 0;
          const simulated = !q.pc || q.pc === 0;
          return {
            name: c.name, symbol: c.symbol, price: Number(q.c.toFixed(2)),
            change_percent: change, unit: c.unit, category: c.category, simulated,
            _meta: meta("finnhub", false, simulated),
          };
        }
      } catch { /* fall through */ }
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const dayAgo = now - 86400;
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${c.symbol}&resolution=D&from=${dayAgo}&to=${now}&token=${apiKey}`;
      const res = await fetchWithTimeout(url, {}, 5000);
      if (res.ok) {
        const q = await res.json();
        if (q.s === "ok" && q.c?.length) {
          const price = q.c[q.c.length - 1];
          const prevClose = q.c.length > 1 ? q.c[q.c.length - 2] : q.o?.[q.c.length - 1] ?? price;
          const change = prevClose > 0 ? Number(((price - prevClose) / prevClose * 100).toFixed(2)) : 0;
          return {
            name: c.name, symbol: c.symbol, price: Number(price.toFixed(2)),
            change_percent: change, unit: c.unit, category: c.category, simulated: false,
            _meta: meta("finnhub", false, false),
          };
        }
      }
    } catch { /* fall through */ }

    return {
      name: c.name, symbol: c.symbol, price: commodityFallback[c.symbol]?.price ?? 0,
      change_percent: 0, unit: c.unit, category: c.category, simulated: true,
      _meta: meta("fallback", false, true),
    };
  }));

  setCache("commodities", results);
  return { data: results, _meta: meta("finnhub", false, false) };
}

// ─── T-BILLS ───────────────────────────────────────────────────────
function fetchTBills() {
  const hit = getCached("tbills", "tbills");
  if (hit) return { data: hit.data, _meta: meta("bog", true, false) };

  const data = [
    { tenor: "91-day", rate: 27.5, type: "Treasury Bill", currency: "GHS", updated: "2025-02-22", source: "Bank of Ghana", _meta: meta("bog", false, false) },
    { tenor: "182-day", rate: 28.8, type: "Treasury Bill", currency: "GHS", updated: "2025-02-22", source: "Bank of Ghana", _meta: meta("bog", false, false) },
    { tenor: "364-day", rate: 30.2, type: "Treasury Bill", currency: "GHS", updated: "2025-02-22", source: "Bank of Ghana", _meta: meta("bog", false, false) },
  ];

  setCache("tbills", data);
  return { data, _meta: meta("bog", false, false) };
}

// ─── SERVE ─────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const symbols = url.searchParams.get("symbols") || DEFAULT_SYMBOLS;

    let result: { data: unknown; _meta: { source: string; cached: boolean; simulated: boolean } };

    switch (type) {
      case "crypto":
        result = await fetchCrypto();
        break;
      case "stocks":
        result = await fetchStocks(symbols);
        break;
      case "forex":
        result = await fetchForex();
        break;
      case "gse":
        result = await fetchGSE();
        break;
      case "commodities":
        result = await fetchCommodities();
        break;
      case "tbills":
        result = fetchTBills();
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid type. Use: crypto, stocks, forex, gse, commodities, tbills" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(JSON.stringify({ data: result.data, timestamp: Date.now(), _meta: result._meta }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Market data error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch market data", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
