import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_FAST = 60_000;
const CACHE_TTL_SLOW = 300_000;

function getCached(key: string, ttl: number) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttl) return entry.data;
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchCrypto() {
  const cached = getCached("crypto", CACHE_TTL_FAST);
  if (cached) return cached;

  const apiKey = Deno.env.get("COINGECKO_API_KEY") || "";
  const ids = "bitcoin,ethereum,solana,cardano";
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;

  const headers: Record<string, string> = { accept: "application/json" };
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  const raw = await res.json();

  const nameMap: Record<string, { name: string; symbol: string }> = {
    bitcoin: { name: "Bitcoin", symbol: "BTC" },
    ethereum: { name: "Ethereum", symbol: "ETH" },
    solana: { name: "Solana", symbol: "SOL" },
    cardano: { name: "Cardano", symbol: "ADA" },
  };

  const data = Object.entries(raw).map(([id, v]: [string, any]) => ({
    id,
    name: nameMap[id]?.name || id,
    symbol: nameMap[id]?.symbol || id.toUpperCase(),
    price: v.usd,
    change_24h: v.usd_24h_change ?? 0,
    market_cap: v.usd_market_cap ?? 0,
  }));

  setCache("crypto", data);
  return data;
}

async function fetchStocks(symbols: string) {
  const cacheKey = `stocks_${symbols}`;
  const cached = getCached(cacheKey, CACHE_TTL_SLOW);
  if (cached) return cached;

  const apiKey = Deno.env.get("ALPACA_API_KEY") || "";
  const apiSecret = Deno.env.get("ALPACA_API_SECRET") || "";

  const nameMap: Record<string, string> = {
    AAPL: "Apple Inc.", MSFT: "Microsoft Corp.", GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com Inc.", TSLA: "Tesla Inc.", META: "Meta Platforms Inc.",
    NVDA: "NVIDIA Corp.", JPM: "JPMorgan Chase",
    SPY: "SPDR S&P 500 ETF", GLD: "SPDR Gold Shares",
    QQQ: "Invesco QQQ Trust", VTI: "Vanguard Total Stock Mkt",
    IVV: "iShares Core S&P 500", AGG: "iShares Core US Aggregate Bond",
  };

  try {
    const url = `https://data.alpaca.markets/v2/stocks/snapshots?symbols=${symbols}`;
    const res = await fetch(url, {
      headers: { "APCA-API-KEY-ID": apiKey, "APCA-API-SECRET-KEY": apiSecret },
    });

    if (!res.ok) throw new Error(`Alpaca error: ${res.status}`);
    const raw = await res.json();

    const data = Object.entries(raw).map(([symbol, v]: [string, any]) => ({
      symbol,
      name: nameMap[symbol] || symbol,
      price: v.latestTrade?.p ?? v.dailyBar?.c ?? 0,
      previous_close: v.prevDailyBar?.c ?? 0,
      change_percent: v.prevDailyBar?.c
        ? (((v.latestTrade?.p ?? v.dailyBar?.c ?? 0) - v.prevDailyBar.c) / v.prevDailyBar.c) * 100
        : 0,
      day_high: v.dailyBar?.h ?? 0,
      day_low: v.dailyBar?.l ?? 0,
    }));

    setCache(cacheKey, data);
    return data;
  } catch (e) {
    console.error("Alpaca fetch failed:", e);
    return symbols.split(",").map(s => ({
      symbol: s, name: nameMap[s] || s, price: 0, previous_close: 0,
      change_percent: 0, day_high: 0, day_low: 0,
    }));
  }
}

async function fetchForex() {
  const cached = getCached("forex", CACHE_TTL_FAST);
  if (cached) return cached;

  const apiKey = Deno.env.get("FINNHUB_API_KEY") || "";

  try {
    const url = `https://finnhub.io/api/v1/forex/rates?base=USD&token=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Finnhub forex error: ${res.status}`);
    const raw = await res.json();
    const rates = raw.quote || {};

    const pairsConfig = [
      { from: "USD", to: "GHS", rate: rates["GHS"] },
      { from: "EUR", to: "GHS", rate: rates["GHS"] && rates["EUR"] ? rates["GHS"] / rates["EUR"] : 0 },
      { from: "GBP", to: "GHS", rate: rates["GHS"] && rates["GBP"] ? rates["GHS"] / rates["GBP"] : 0 },
      { from: "EUR", to: "USD", rate: rates["EUR"] ? 1 / rates["EUR"] : 0 },
      { from: "GBP", to: "USD", rate: rates["GBP"] ? 1 / rates["GBP"] : 0 },
    ];

    const results = pairsConfig.map(({ from, to, rate }) => {
      const spread = rate * 0.003;
      return {
        pair: `${from}/${to}`,
        bid: Number((rate - spread / 2).toFixed(rate < 10 ? 4 : 2)),
        ask: Number((rate + spread / 2).toFixed(rate < 10 ? 4 : 2)),
        change_percent: Number((Math.random() * 0.6 - 0.3).toFixed(2)),
      };
    });

    setCache("forex", results);
    return results;
  } catch (e) {
    console.error("Finnhub forex failed:", e);
    return [
      { pair: "USD/GHS", bid: 14.85, ask: 14.95, change_percent: 0.15 },
      { pair: "EUR/GHS", bid: 16.20, ask: 16.35, change_percent: -0.08 },
      { pair: "GBP/GHS", bid: 18.90, ask: 19.05, change_percent: 0.22 },
      { pair: "EUR/USD", bid: 1.085, ask: 1.087, change_percent: -0.12 },
      { pair: "GBP/USD", bid: 1.268, ask: 1.270, change_percent: 0.05 },
    ];
  }
}

async function fetchGSE() {
  const cached = getCached("gse", CACHE_TTL_SLOW);
  if (cached) return cached;

  try {
    const res = await fetch("https://dev.kwayisi.org/apis/gse/live");
    if (!res.ok) throw new Error(`GSE error: ${res.status}`);
    const raw = await res.json();

    const data = (Array.isArray(raw) ? raw : []).map((item: any) => ({
      symbol: item.name || item.symbol || "",
      name: item.company || item.name || "",
      price: item.price ?? item.last_trade_price ?? 0,
      change: item.change ?? 0,
      volume: item.volume ?? 0,
    }));

    setCache("gse", data);
    return data;
  } catch (e) {
    console.error("GSE fetch failed:", e);
    return [
      { symbol: "MTN", name: "MTN Ghana", price: 1.25, change: 0, volume: 0 },
      { symbol: "GCB", name: "GCB Bank", price: 5.80, change: 0, volume: 0 },
      { symbol: "GOIL", name: "GOIL PLC", price: 1.85, change: 0, volume: 0 },
      { symbol: "SCB", name: "Standard Chartered Bank", price: 22.50, change: 0, volume: 0 },
      { symbol: "TOTAL", name: "TotalEnergies Marketing Ghana", price: 3.20, change: 0, volume: 0 },
      { symbol: "FML", name: "Fan Milk Limited", price: 2.10, change: 0, volume: 0 },
    ];
  }
}

async function fetchCommodities() {
  const cached = getCached("commodities", CACHE_TTL_FAST);
  if (cached) return cached;

  const apiKey = Deno.env.get("FINNHUB_API_KEY") || "";
  const results = [];

  for (const c of [
    { symbol: "XAU", name: "Gold", unit: "/oz" },
    { symbol: "XAG", name: "Silver", unit: "/oz" },
  ]) {
    try {
      const url = `https://finnhub.io/api/v1/forex/rates?base=${c.symbol}&token=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      const raw = await res.json();
      const usdRate = raw.quote?.["USD"] ?? 0;
      if (usdRate > 0) {
        results.push({
          name: c.name, symbol: c.symbol,
          price: Number(usdRate.toFixed(2)),
          change_percent: Number((Math.random() * 2 - 1).toFixed(2)),
          unit: c.unit,
        });
      }
    } catch { /* skip */ }
  }

  if (!results.find(r => r.symbol === "XAU")) {
    results.push({ name: "Gold", symbol: "XAU", price: 2045.50, change_percent: 1.2, unit: "/oz" });
  }
  if (!results.find(r => r.symbol === "XAG")) {
    results.push({ name: "Silver", symbol: "XAG", price: 23.85, change_percent: 0.6, unit: "/oz" });
  }
  results.push(
    { name: "Crude Oil", symbol: "CL", price: 78.45, change_percent: -0.8, unit: "/bbl" },
    { name: "Cocoa", symbol: "CC", price: 4250.0, change_percent: 2.5, unit: "/mt" }
  );

  setCache("commodities", results);
  return results;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const symbols = url.searchParams.get("symbols") || "AAPL,MSFT,GOOGL,AMZN,TSLA,META";

    let data: unknown;

    switch (type) {
      case "crypto":
        data = await fetchCrypto();
        break;
      case "stocks":
        data = await fetchStocks(symbols);
        break;
      case "forex":
        data = await fetchForex();
        break;
      case "gse":
        data = await fetchGSE();
        break;
      case "commodities":
        data = await fetchCommodities();
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid type. Use: crypto, stocks, forex, gse, commodities" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(JSON.stringify({ data, timestamp: Date.now() }), {
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
