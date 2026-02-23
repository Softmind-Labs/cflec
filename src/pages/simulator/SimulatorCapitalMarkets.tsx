import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { LiveBadge } from '@/components/simulator/LiveBadge';
import { MarketError } from '@/components/simulator/MarketError';
import { SimulationDialog, type SimAssetType } from '@/components/simulator/SimulationDialog';
import { useMarketDataWithTimestamp } from '@/hooks/useMarketData';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  Landmark,
  PieChart,
  BarChart3,
  Wallet,
  Calendar,
  Shield
} from 'lucide-react';

// Mock Bonds (no free API)
const bonds = [
  { name: 'Ghana 5-Year Bond', yield: 29.5, maturity: '2029', rating: 'B-', minInvestment: 1000 },
  { name: 'Ghana 10-Year Bond', yield: 31.0, maturity: '2034', rating: 'B-', minInvestment: 1000 },
  { name: 'Corporate Bond - MTN', yield: 22.5, maturity: '2027', rating: 'BB', minInvestment: 5000 },
  { name: 'Corporate Bond - Ecobank', yield: 24.0, maturity: '2028', rating: 'BB-', minInvestment: 5000 },
];

// Mock Mutual Funds (no free API)
const mutualFunds = [
  { name: 'Databank Epack', type: 'Equity Fund', nav: 2.85, ytdReturn: 18.5, minInvestment: 100 },
  { name: 'Fidelity Equity Fund', type: 'Equity Fund', nav: 1.92, ytdReturn: 15.2, minInvestment: 100 },
  { name: 'SAS Fortune Fund', type: 'Balanced Fund', nav: 3.45, ytdReturn: 12.8, minInvestment: 200 },
  { name: 'EDC Ghana Fixed Income', type: 'Fixed Income', nav: 1.15, ytdReturn: 22.0, minInvestment: 500 },
];

export default function SimulatorCapitalMarkets() {
  const { user } = useAuth();
  const [portfolioBalance, setPortfolioBalance] = useState(0);
  const [holdingsCount, setHoldingsCount] = useState(0);

  // Simulation dialog state
  const [simOpen, setSimOpen] = useState(false);
  const [simAsset, setSimAsset] = useState<{
    name: string; symbol?: string; price: number; type: SimAssetType;
    yieldPct?: number; maturity?: string; ytdReturn?: number;
  } | null>(null);

  const { data: etfResult, isLoading: etfLoading, isError: etfError, refetch: refetchEtf } = useMarketDataWithTimestamp('stocks', { symbols: 'SPY,GLD,QQQ,VTI,IVV,AGG' });
  const etfs = etfResult?.data ?? [];

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;
      const { data: p } = await supabase.from('portfolios').select('*').eq('user_id', user.id).maybeSingle();
      if (p) {
        setPortfolioBalance(Number(p.cash_balance));
        const { data: h } = await supabase.from('stock_holdings').select('id').eq('portfolio_id', p.id);
        setHoldingsCount(h?.length || 0);
      }
    };
    fetchPortfolio();
  }, [user]);

  const openSim = (name: string, price: number, type: SimAssetType, extra?: { symbol?: string; yieldPct?: number; maturity?: string; ytdReturn?: number }) => {
    setSimAsset({ name, price, type, ...extra });
    setSimOpen(true);
  };

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/simulator"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div>
            <h1 className="text-3xl font-display flex items-center gap-2"><Landmark className="h-8 w-8" />Capital Markets Simulator</h1>
            <p className="text-muted-foreground">Invest in Bonds, Mutual Funds, and ETFs</p>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1"><Wallet className="h-4 w-4" />Portfolio Balance</CardDescription>
              <CardTitle className="text-3xl tabular-nums">${portfolioBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Available cash</p></CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardDescription>Stock Holdings</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{holdingsCount}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Open positions</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Capital Markets</CardDescription>
              <CardTitle className="text-3xl text-muted-foreground tabular-nums">Simulation</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Educational simulations only</p></CardContent>
          </Card>
        </div>

        {/* Market Tabs */}
        <Tabs defaultValue="bonds" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bonds" className="gap-2"><Shield className="h-4 w-4" />Bonds</TabsTrigger>
            <TabsTrigger value="mutual-funds" className="gap-2"><PieChart className="h-4 w-4" />Mutual Funds</TabsTrigger>
            <TabsTrigger value="etfs" className="gap-2"><BarChart3 className="h-4 w-4" />ETFs</TabsTrigger>
          </TabsList>

          {/* Bonds */}
          <TabsContent value="bonds">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Government & Corporate Bonds</CardTitle><CardDescription>Fixed income securities with regular interest payments</CardDescription></div>
                  <span className="text-xs text-muted-foreground">Rates as of Feb 2026</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bonds.map((bond, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold">{bond.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">Rating: {bond.rating}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Matures: {bond.maturity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gain tabular-nums">{bond.yield}%</p>
                          <p className="text-sm text-muted-foreground">Yield p.a.</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Min. Investment: GHS {bond.minInvestment.toLocaleString()}</span>
                        <Button size="sm" onClick={() => openSim(bond.name, 0, 'bond', { yieldPct: bond.yield, maturity: bond.maturity })}>Invest</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mutual Funds */}
          <TabsContent value="mutual-funds">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Mutual Funds</CardTitle><CardDescription>Professionally managed investment portfolios</CardDescription></div>
                  <span className="text-xs text-muted-foreground">NAVs as of Feb 2026</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mutualFunds.map((fund, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div><p className="font-semibold">{fund.name}</p><Badge variant="secondary" className="mt-1">{fund.type}</Badge></div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"><PieChart className="h-6 w-6 text-primary" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 my-4">
                         <div><p className="text-sm text-muted-foreground">NAV</p><p className="font-semibold tabular-nums">GHS {fund.nav.toFixed(2)}</p></div>
                         <div><p className="text-sm text-muted-foreground">YTD Return</p><p className="font-semibold text-gain tabular-nums">+{fund.ytdReturn}%</p></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Min: GHS {fund.minInvestment}</span>
                        <Button size="sm" onClick={() => openSim(fund.name, fund.nav, 'fund', { ytdReturn: fund.ytdReturn })}>Invest</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ETFs */}
          <TabsContent value="etfs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Exchange Traded Funds (ETFs)</CardTitle><CardDescription>Trade diversified funds like stocks</CardDescription></div>
                  <LiveBadge timestamp={etfResult?.timestamp} />
                </div>
              </CardHeader>
              <CardContent>
                {etfLoading ? (
                  <div className="space-y-4">{[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-4"><Skeleton className="h-12 w-12 rounded-lg" /><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></div>
                      <Skeleton className="h-4 w-16" /><Skeleton className="h-8 w-20" />
                    </div>
                  ))}</div>
                ) : etfError ? <MarketError onRetry={() => refetchEtf()} /> : (
                  <div className="space-y-4">
                    {etfs.map((etf) => (
                      <div key={etf.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">{etf.symbol}</div>
                          <div><p className="font-semibold">{etf.name}</p><p className="text-sm text-muted-foreground">{etf.symbol}</p></div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold tabular-nums">${Number(etf.price).toFixed(2)}</p>
                           <p className={`text-sm tabular-nums ${etf.change_percent >= 0 ? 'text-gain' : 'text-loss'}`}>
                             {etf.change_percent >= 0 ? '+' : ''}{Number(etf.change_percent).toFixed(2)}%
                           </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openSim(etf.name, etf.price, 'etf', { symbol: etf.symbol })}>Buy</Button>
                          <Button size="sm" variant="outline" onClick={() => openSim(etf.name, etf.price, 'etf', { symbol: etf.symbol })}>Sell</Button>
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

      {/* Simulation Dialog */}
      {simAsset && (
        <SimulationDialog
          open={simOpen}
          onOpenChange={setSimOpen}
          assetName={simAsset.name}
          assetSymbol={simAsset.symbol}
          price={simAsset.price}
          assetType={simAsset.type}
          currency="GHS"
          yieldPct={simAsset.yieldPct}
          maturity={simAsset.maturity}
          ytdReturn={simAsset.ytdReturn}
        />
      )}
    </MainLayout>
  );
}
