import { useQuery } from '@tanstack/react-query';

export type MarketType = 'crypto' | 'stocks' | 'forex' | 'gse' | 'commodities' | 'tbills';

export interface MetaInfo {
  source: string;
  cached: boolean;
  simulated: boolean;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change_24h: number;
  market_cap: number;
  _meta?: MetaInfo;
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  previous_close: number;
  change_percent: number;
  day_high: number;
  day_low: number;
  _meta?: MetaInfo;
}

export interface ForexData {
  pair: string;
  bid: number;
  ask: number;
  change_percent: number;
  simulated?: boolean;
  _meta?: MetaInfo;
}

export interface GSEData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  _meta?: MetaInfo;
}

export interface CommodityData {
  name: string;
  symbol: string;
  price: number;
  change_percent: number;
  unit: string;
  category?: string;
  simulated?: boolean;
  _meta?: MetaInfo;
}

export interface TBillData {
  tenor: string;
  rate: number;
  type: string;
  currency: string;
  updated: string;
  source: string;
  _meta?: MetaInfo;
}

type MarketDataMap = {
  crypto: CryptoData[];
  stocks: StockData[];
  forex: ForexData[];
  gse: GSEData[];
  commodities: CommodityData[];
  tbills: TBillData[];
};

async function fetchMarketData<T extends MarketType>(
  type: T,
  params?: Record<string, string>
): Promise<{ data: MarketDataMap[T]; timestamp: number; _meta?: MetaInfo }> {
  const searchParams = new URLSearchParams({ type, ...params });
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const res = await fetch(
    `https://${projectId}.supabase.co/functions/v1/market-data?${searchParams}`,
    {
      headers: {
        'apikey': anonKey,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Market data fetch failed: ${res.status}`);
  }

  return res.json();
}

export function useMarketData<T extends MarketType>(
  type: T,
  params?: Record<string, string>
) {
  return useQuery({
    queryKey: ['market-data', type, params],
    queryFn: () => fetchMarketData(type, params),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
    select: (res) => res.data,
  });
}

export function useMarketDataWithTimestamp<T extends MarketType>(
  type: T,
  params?: Record<string, string>
) {
  return useQuery({
    queryKey: ['market-data', type, params],
    queryFn: () => fetchMarketData(type, params),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}
