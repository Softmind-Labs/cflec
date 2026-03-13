import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { LiveBadge } from '@/components/simulator/LiveBadge';
import { DataBadge } from '@/components/simulator/DataBadge';
import { MarketError } from '@/components/simulator/MarketError';
import { TradePanel, type TradeType } from '@/components/simulator/TradePanel';
import { PositionsSection } from '@/components/simulator/PositionsSection';
import { useMarketDataWithTimestamp } from '@/hooks/useMarketData';
import { useSimulatorWallet, type Position } from '@/hooks/useSimulatorWallet';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  DollarSign,
  Coins,
  Bitcoin,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

const AFRICAN_PAIRS = ['USD/GHS', 'EUR/GHS', 'GBP/GHS', 'USD/NGN', 'USD/ZAR'];

export default function SimulatorTrading() {
  const { cashBalance, totalInvested, positionsByType, refetch } = useSimulatorWallet();

  const { data: forexData, isLoading: forexLoading, isError: forexError, refetch: refetchForex } = useMarketDataWithTimestamp('forex');
  const { data: commoditiesData, isLoading: commoditiesLoading, isError: commoditiesError, refetch: refetchCommodities } = useMarketDataWithTimestamp('commodities');
  const { data: cryptoData, isLoading: cryptoLoading, isError: cryptoError, refetch: refetchCrypto } = useMarketDataWithTimestamp('crypto');

  const forex = forexData?.data ?? [];
  const commodities = commoditiesData?.data ?? [];
  const cryptos = cryptoData?.data ?? [];

  // Trade panel state
  const [tradeOpen, setTradeOpen] = useState(false);
  const [tradeAsset, setTradeAsset] = useState<{
    name: string; symbol: string; price: number; category: string; tradeType: TradeType;
  } | null>(null);

  const openTrade = (name: string, symbol: string, price: number, category: string, tradeType: TradeType) => {
    setTradeAsset({ name, symbol, price, category, tradeType });
    setTradeOpen(true);
  };

  const africanForex = useMemo(() => forex.filter(p => AFRICAN_PAIRS.includes(p.pair)), [forex]);
  const majorForex = useMemo(() => forex.filter(p => !AFRICAN_PAIRS.includes(p.pair)), [forex]);

  const metalCommodities = useMemo(() => commodities.filter(c => c.category === 'metal'), [commodities]);
  const energyCommodities = useMemo(() => commodities.filter(c => c.category === 'energy'), [commodities]);
  const agriCommodities = useMemo(() => commodities.filter(c => c.category === 'agricultural'), [commodities]);

  const tradingPositions = positionsByType['trading'];

  const SkeletonGrid = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i}><CardContent className="pt-6 space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-16" />
        </CardContent></Card>
      ))}
    </div>
  );

  const ForexRow = ({ pair }: { pair: typeof forex[0] }) => {
    const spread = (pair.ask - pair.bid);
    const spreadStr = spread < 1 ? spread.toFixed(4) : spread.toFixed(2);
    return (
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors gap-3">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-primary" /></div>
          <div>
            <p className="font-semibold">{pair.pair}</p>
             <p className={`text-sm flex items-center gap-1 tabular-nums ${pair.change_percent >= 0 ? 'text-gain' : 'text-loss'}`}>
               {pair.change_percent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
               {pair.change_percent >= 0 ? '+' : ''}{pair.change_percent}%
             </p>
          </div>
        </div>
         <div className="text-center"><p className="text-xs text-muted-foreground">Bid</p><p className="font-semibold text-sm tabular-nums">{pair.bid}</p></div>
         <div className="text-center"><p className="text-xs text-muted-foreground">Ask</p><p className="font-semibold text-sm tabular-nums">{pair.ask}</p></div>
         <div className="text-center hidden sm:block"><p className="text-xs text-muted-foreground">Spread</p><p className="text-sm tabular-nums">{spreadStr}</p></div>
        <DataBadge meta={pair._meta} />
        <div className="flex gap-2">
           <Button size="sm" variant="outline" className="text-gain" onClick={() => openTrade(pair.pair, pair.pair, pair.ask, 'forex', 'buy')}>Buy</Button>
           <Button size="sm" variant="outline" className="text-loss" onClick={() => openTrade(pair.pair, pair.pair, pair.bid, 'forex', 'sell')}>Sell</Button>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/simulator">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
             <h1 className="text-3xl font-display flex items-center gap-2">
               <TrendingUp className="h-8 w-8" />
               Trading Simulator
             </h1>
            <p className="text-muted-foreground">Trade Forex, Commodities, and Crypto</p>
          </div>
        </div>

        {/* Trading Balance */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1"><Wallet className="h-4 w-4" />Cash Available</CardDescription>
              <CardTitle className="text-3xl tabular-nums">${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">From shared wallet</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Trading Positions</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{tradingPositions?.count ?? 0}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Open positions</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Invested in Trading</CardDescription>
              <CardTitle className="text-3xl tabular-nums">${(tradingPositions?.totalInvested ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Total value in positions</p></CardContent>
          </Card>
        </div>

        {/* Market Tabs */}
        <Tabs defaultValue="crypto" className="space-y-6">
          <TabsList>
            <TabsTrigger value="crypto" className="gap-2"><Bitcoin className="h-4 w-4" />Crypto</TabsTrigger>
            <TabsTrigger value="forex" className="gap-2"><DollarSign className="h-4 w-4" />Forex</TabsTrigger>
            <TabsTrigger value="commodities" className="gap-2"><Coins className="h-4 w-4" />Commodities</TabsTrigger>
          </TabsList>

          {/* Crypto */}
          <TabsContent value="crypto">
            <div className="flex items-center justify-between mb-4">
              <div><h2 className="text-xl font-semibold">Crypto Trading</h2><p className="text-sm text-muted-foreground">Trade Bitcoin, Ethereum, and more</p></div>
              <LiveBadge timestamp={cryptoData?.timestamp} />
            </div>
            {cryptoLoading ? <SkeletonGrid /> : cryptoError ? <MarketError onRetry={() => refetchCrypto()} /> : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cryptos.map((crypto) => (
                  <Card key={crypto.symbol} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-lg">{crypto.name}</p>
                          <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                        </div>
                        <DataBadge meta={crypto._meta} />
                      </div>
                      <p className="text-2xl font-bold mb-1 tabular-nums">${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                      <div className="flex items-center justify-between">
                         <p className={`text-sm flex items-center gap-1 tabular-nums ${crypto.change_24h >= 0 ? 'text-gain' : 'text-loss'}`}>
                           {crypto.change_24h >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                           {crypto.change_24h >= 0 ? '+' : ''}{crypto.change_24h.toFixed(2)}%
                         </p>
                        <p className="text-xs text-muted-foreground">{formatMarketCap(crypto.market_cap)}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1" onClick={() => openTrade(crypto.name, crypto.symbol, crypto.price, 'crypto', 'buy')}>Buy</Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => openTrade(crypto.name, crypto.symbol, crypto.price, 'crypto', 'sell')}>Sell</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Forex */}
          <TabsContent value="forex">
            <div className="flex items-center justify-between mb-4">
              <div><h2 className="text-xl font-semibold">Forex Trading</h2><p className="text-sm text-muted-foreground">Trade major and GHS currency pairs</p></div>
              <LiveBadge timestamp={forexData?.timestamp} />
            </div>
            {forexLoading ? <SkeletonGrid /> : forexError ? <MarketError onRetry={() => refetchForex()} /> : (
              <div className="space-y-6">
                {africanForex.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">African Pairs</h3>
                    <div className="space-y-2">
                      {africanForex.map(pair => <ForexRow key={pair.pair} pair={pair} />)}
                    </div>
                  </div>
                )}
                {majorForex.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Major Pairs</h3>
                    <div className="space-y-2">
                      {majorForex.map(pair => <ForexRow key={pair.pair} pair={pair} />)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Commodities */}
          <TabsContent value="commodities">
            <div className="flex items-center justify-between mb-4">
              <div><h2 className="text-xl font-semibold">Commodities Trading</h2><p className="text-sm text-muted-foreground">Trade Gold, Cocoa, Oil, and more</p></div>
              <LiveBadge timestamp={commoditiesData?.timestamp} />
            </div>
            {commoditiesLoading ? <SkeletonGrid /> : commoditiesError ? <MarketError onRetry={() => refetchCommodities()} /> : (
              <div className="space-y-6">
                {[
                  { title: 'Metals', items: metalCommodities },
                  { title: 'Energy', items: energyCommodities },
                  { title: 'Agricultural', items: agriCommodities },
                ].map(group => group.items.length > 0 && (
                  <div key={group.title}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">{group.title}</h3>
                    <div className="space-y-2">
                      {group.items.map(c => (
                        <div key={c.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors gap-3">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"><Coins className="h-5 w-5 text-amber-700 dark:text-amber-400" /></div>
                            <div><p className="font-semibold">{c.name}</p><p className="text-sm text-muted-foreground">{c.symbol}</p></div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold tabular-nums">${c.price.toLocaleString()}{c.unit}</p>
                             <p className={`text-sm flex items-center justify-end gap-1 tabular-nums ${c.change_percent >= 0 ? 'text-gain' : 'text-loss'}`}>
                               {c.change_percent >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                               {c.change_percent >= 0 ? '+' : ''}{c.change_percent}%
                             </p>
                          </div>
                          <DataBadge meta={c._meta} />
                          <div className="flex gap-2">
                             <Button size="sm" variant="outline" className="text-gain" onClick={() => openTrade(c.name, c.symbol, c.price, 'commodity', 'buy')}>Buy</Button>
                             <Button size="sm" variant="outline" className="text-loss" onClick={() => openTrade(c.name, c.symbol, c.price, 'commodity', 'sell')}>Sell</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Trade Panel */}
      {tradeAsset && (
        <TradePanel
          open={tradeOpen}
          onOpenChange={setTradeOpen}
          assetName={tradeAsset.name}
          assetSymbol={tradeAsset.symbol}
          price={tradeAsset.price}
          simulatorType="trading"
          category={tradeAsset.category}
          positionType="market"
          tradeType={tradeAsset.tradeType}
          cashBalance={cashBalance}
          onSuccess={refetch}
        />
      )}
    </MainLayout>
  );
}
