import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { LiveBadge } from '@/components/simulator/LiveBadge';
import { MarketError } from '@/components/simulator/MarketError';
import { useMarketDataWithTimestamp } from '@/hooks/useMarketData';
import { 
  ArrowLeft, 
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  DollarSign,
  Coins,
  Bitcoin,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useState } from 'react';

export default function SimulatorTrading() {
  const [tradingBalance] = useState(10000);

  const { data: forexData, dataUpdatedAt: forexUpdated, isLoading: forexLoading, isError: forexError, refetch: refetchForex } = useMarketDataWithTimestamp('forex');
  const { data: commoditiesData, dataUpdatedAt: commoditiesUpdated, isLoading: commoditiesLoading, isError: commoditiesError, refetch: refetchCommodities } = useMarketDataWithTimestamp('commodities');
  const { data: cryptoData, dataUpdatedAt: cryptoUpdated, isLoading: cryptoLoading, isError: cryptoError, refetch: refetchCrypto } = useMarketDataWithTimestamp('crypto');

  const forex = forexData?.data ?? [];
  const commodities = commoditiesData?.data ?? [];
  const cryptos = cryptoData?.data ?? [];

  const SkeletonRows = () => (
    <div className="space-y-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div>
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/simulator">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-8 w-8" />
              Trading Simulator
            </h1>
            <p className="text-muted-foreground">Trade Forex, Commodities, and Crypto</p>
          </div>
        </div>

        {/* Trading Balance */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card-gold">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1"><Wallet className="h-4 w-4" />Trading Balance</CardDescription>
              <CardTitle className="text-3xl">${tradingBalance.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Virtual funds for trading</p></CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Open Positions</CardDescription>
              <CardTitle className="text-3xl">3</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-cflp-green">+$125.50 unrealized P/L</p></CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Today's P/L</CardDescription>
              <CardTitle className="text-3xl text-cflp-green">+$85.20</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">5 trades completed</p></CardContent>
          </Card>
        </div>

        {/* Market Tabs */}
        <Tabs defaultValue="forex" className="space-y-6">
          <TabsList>
            <TabsTrigger value="forex" className="gap-2"><DollarSign className="h-4 w-4" />Forex</TabsTrigger>
            <TabsTrigger value="commodities" className="gap-2"><Coins className="h-4 w-4" />Commodities</TabsTrigger>
            <TabsTrigger value="crypto" className="gap-2"><Bitcoin className="h-4 w-4" />Crypto</TabsTrigger>
          </TabsList>

          {/* Forex */}
          <TabsContent value="forex">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Forex Trading</CardTitle><CardDescription>Trade major and GHS currency pairs</CardDescription></div>
                  <LiveBadge timestamp={forexData?.timestamp} />
                </div>
              </CardHeader>
              <CardContent>
                {forexLoading ? <SkeletonRows /> : forexError ? <MarketError onRetry={() => refetchForex()} /> : (
                  <div className="space-y-2">
                    {forex.map((pair) => (
                      <div key={pair.pair} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-cflp-blue/10 flex items-center justify-center"><DollarSign className="h-6 w-6 text-cflp-blue" /></div>
                          <div>
                            <p className="font-semibold">{pair.pair}</p>
                            <p className={`text-sm flex items-center gap-1 ${pair.change_percent >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                              {pair.change_percent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {pair.change_percent >= 0 ? '+' : ''}{pair.change_percent}%
                            </p>
                          </div>
                        </div>
                        <div className="text-center"><p className="text-sm text-muted-foreground">Bid</p><p className="font-semibold">{pair.bid}</p></div>
                        <div className="text-center"><p className="text-sm text-muted-foreground">Ask</p><p className="font-semibold">{pair.ask}</p></div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-cflp-green border-cflp-green hover:bg-cflp-green hover:text-white">Buy</Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white">Sell</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commodities */}
          <TabsContent value="commodities">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Commodities Trading</CardTitle><CardDescription>Trade Gold, Cocoa, Oil, and more</CardDescription></div>
                  <LiveBadge timestamp={commoditiesData?.timestamp} />
                </div>
              </CardHeader>
              <CardContent>
                {commoditiesLoading ? <SkeletonRows /> : commoditiesError ? <MarketError onRetry={() => refetchCommodities()} /> : (
                  <div className="space-y-2">
                    {commodities.map((c) => (
                      <div key={c.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-cflp-gold/10 flex items-center justify-center"><Coins className="h-6 w-6 text-cflp-gold" /></div>
                          <div><p className="font-semibold">{c.name}</p><p className="text-sm text-muted-foreground">{c.symbol}</p></div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${c.price.toLocaleString()}{c.unit}</p>
                          <p className={`text-sm flex items-center justify-end gap-1 ${c.change_percent >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                            {c.change_percent >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {c.change_percent >= 0 ? '+' : ''}{c.change_percent}%
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-cflp-green border-cflp-green hover:bg-cflp-green hover:text-white">Buy</Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white">Sell</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crypto */}
          <TabsContent value="crypto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Crypto Trading</CardTitle><CardDescription>Trade Bitcoin, Ethereum, and more</CardDescription></div>
                  <LiveBadge timestamp={cryptoData?.timestamp} />
                </div>
              </CardHeader>
              <CardContent>
                {cryptoLoading ? <SkeletonRows /> : cryptoError ? <MarketError onRetry={() => refetchCrypto()} /> : (
                  <div className="space-y-2">
                    {cryptos.map((crypto) => (
                      <div key={crypto.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Bitcoin className="h-6 w-6 text-primary" /></div>
                          <div><p className="font-semibold">{crypto.name}</p><p className="text-sm text-muted-foreground">{crypto.symbol}</p></div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${crypto.price.toLocaleString()}</p>
                          <p className={`text-sm flex items-center justify-end gap-1 ${crypto.change_24h >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                            {crypto.change_24h >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {crypto.change_24h >= 0 ? '+' : ''}{crypto.change_24h.toFixed(2)}%
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-cflp-green border-cflp-green hover:bg-cflp-green hover:text-white">Buy</Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white">Sell</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
