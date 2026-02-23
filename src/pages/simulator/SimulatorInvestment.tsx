import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { LiveBadge } from '@/components/simulator/LiveBadge';
import { DataBadge } from '@/components/simulator/DataBadge';
import { MarketError } from '@/components/simulator/MarketError';
import { SimulationDialog } from '@/components/simulator/SimulationDialog';
import { useMarketDataWithTimestamp } from '@/hooks/useMarketData';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Globe,
  Building,
  Search,
} from 'lucide-react';
import type { MockStock, Portfolio, StockHolding } from '@/types';
import { STARTING_PORTFOLIO_BALANCE } from '@/lib/constants';

const SECTOR_COLORS: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Finance: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  Healthcare: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  Energy: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  Consumer: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  ETF: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Other: 'bg-muted text-muted-foreground',
};

const SECTOR_TABS = ['All', 'Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'ETF'];

export default function SimulatorInvestment() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [holdings, setHoldings] = useState<(StockHolding & { stock: MockStock })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorTab, setSectorTab] = useState('All');

  // Simulation dialog state
  const [simOpen, setSimOpen] = useState(false);
  const [simStock, setSimStock] = useState<{ name: string; symbol: string; price: number } | null>(null);

  const { data: gseResult, isLoading: gseLoading, isError: gseError, refetch: refetchGse } = useMarketDataWithTimestamp('gse');
  const { data: stocksResult, isLoading: stocksLoading, isError: stocksError, refetch: refetchStocks } = useMarketDataWithTimestamp('stocks');

  const gseStocks = gseResult?.data ?? [];
  const worldStocks = stocksResult?.data ?? [];

  const filteredStocks = useMemo(() => {
    let list = worldStocks;
    if (sectorTab !== 'All') {
      list = list.filter(s => s.sector === sectorTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }
    return list;
  }, [worldStocks, sectorTab, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      let { data: portfolioData } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!portfolioData) {
        const { data: newPortfolio } = await supabase
          .from('portfolios')
          .insert({ user_id: user.id, cash_balance: STARTING_PORTFOLIO_BALANCE })
          .select()
          .single();
        portfolioData = newPortfolio;
      }

      if (portfolioData) {
        setPortfolio(portfolioData as Portfolio);

        const { data: stocksData } = await supabase.from('mock_stocks').select('*');
        const { data: holdingsData } = await supabase
          .from('stock_holdings')
          .select('*')
          .eq('portfolio_id', portfolioData.id);

        if (holdingsData && stocksData) {
          const holdingsWithStocks = holdingsData.map(h => ({
            ...h,
            stock: stocksData.find(s => s.id === h.stock_id)!
          }));
          setHoldings(holdingsWithStocks as (StockHolding & { stock: MockStock })[]);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const calculateTotalValue = () => {
    const holdingsValue = holdings.reduce((sum, h) =>
      sum + (h.quantity * Number(h.stock.current_price)), 0
    );
    return Number(portfolio?.cash_balance || 0) + holdingsValue;
  };

  const calculatePL = () => {
    const totalValue = calculateTotalValue();
    const pl = totalValue - STARTING_PORTFOLIO_BALANCE;
    const plPercent = STARTING_PORTFOLIO_BALANCE > 0 ? (pl / STARTING_PORTFOLIO_BALANCE) * 100 : 0;
    return { pl, plPercent };
  };

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

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (<div key={i} className="h-32 bg-muted rounded-lg" />))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { pl, plPercent } = calculatePL();

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/simulator"><Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button></Link>
          <div className="flex-1">
            <h1 className="text-3xl font-display flex items-center gap-2"><TrendingUp className="h-8 w-8" />Investment Simulator</h1>
            <p className="text-muted-foreground">Trade stocks on Ghana Stock Exchange and World Markets</p>
          </div>
          <Link to="/simulator/trade"><Button className="gap-2"><TrendingUp className="h-4 w-4" />Trade Now</Button></Link>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1"><Wallet className="h-4 w-4" />Total Portfolio Value</CardDescription>
              <CardTitle className="text-3xl tabular-nums">${calculateTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center gap-1 text-sm ${pl >= 0 ? 'text-gain' : 'text-loss'}`}>
                {pl >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {pl >= 0 ? '+' : ''}{plPercent.toFixed(1)}% all time
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Cash Balance</CardDescription>
              <CardTitle className="text-3xl tabular-nums">${Number(portfolio?.cash_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">Available to invest</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Holdings Value</CardDescription>
              <CardTitle className="text-3xl tabular-nums">${holdings.reduce((sum, h) => sum + (h.quantity * Number(h.stock.current_price)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground">{holdings.length} positions</p></CardContent>
          </Card>
        </div>

        {/* Market Tabs */}
        <Tabs defaultValue="gse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="gse" className="gap-2"><Building className="h-4 w-4" />Ghana Stock Exchange</TabsTrigger>
            <TabsTrigger value="world" className="gap-2"><Globe className="h-4 w-4" />World Markets</TabsTrigger>
          </TabsList>

          {/* GSE - show ALL stocks */}
          <TabsContent value="gse">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Ghana Stock Exchange (GSE)</CardTitle><CardDescription>All {gseStocks.length} listed Ghanaian stocks</CardDescription></div>
                  <LiveBadge timestamp={gseResult?.timestamp} />
                </div>
              </CardHeader>
              <CardContent>
                {gseLoading ? <SkeletonRows /> : gseError ? <MarketError onRetry={() => refetchGse()} /> : (
                  <div className="space-y-2">
                    {gseStocks.map((stock) => (
                      <div key={stock.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">{stock.symbol.slice(0, 4)}</div>
                          <div><p className="font-semibold">{stock.name}</p><p className="text-sm text-muted-foreground">{stock.symbol}</p></div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold tabular-nums">GHS {Number(stock.price).toFixed(2)}</p>
                          <p className={`text-sm flex items-center justify-end gap-1 tabular-nums ${stock.change >= 0 ? 'text-gain' : 'text-loss'}`}>
                            {stock.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {stock.change >= 0 ? '+' : ''}{Number(stock.change).toFixed(2)}%
                          </p>
                        </div>
                        <Button size="sm" onClick={() => { setSimStock({ name: stock.name, symbol: stock.symbol, price: stock.price }); setSimOpen(true); }}>Trade</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* World Markets */}
          <TabsContent value="world">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>World Stock Markets</CardTitle><CardDescription>Trade international stocks (NYSE, NASDAQ)</CardDescription></div>
                  <LiveBadge timestamp={stocksResult?.timestamp} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by symbol or company name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sector Tabs */}
                <div className="flex flex-wrap gap-2">
                  {SECTOR_TABS.map(tab => (
                    <Button
                      key={tab}
                      variant={sectorTab === tab ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSectorTab(tab)}
                    >
                      {tab === 'ETF' ? 'ETFs' : tab}
                    </Button>
                  ))}
                </div>

                {stocksLoading ? <SkeletonRows /> : stocksError ? <MarketError onRetry={() => refetchStocks()} /> : (
                  <div className="space-y-2">
                    {filteredStocks.map((stock) => (
                      <div key={stock.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors gap-3">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">{stock.symbol.slice(0, 2)}</div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold">{stock.symbol}</p>
                              <Badge variant="secondary" className={`text-xs ${SECTOR_COLORS[stock.sector] || SECTOR_COLORS.Other}`}>
                                {stock.sector}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold tabular-nums">${Number(stock.price).toFixed(2)}</p>
                          <p className={`text-sm flex items-center justify-end gap-1 tabular-nums ${stock.change_percent >= 0 ? 'text-gain' : 'text-loss'}`}>
                            {stock.change_percent >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {stock.change_percent >= 0 ? '+' : ''}{Number(stock.change_percent).toFixed(2)}%
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground shrink-0 hidden md:block tabular-nums">
                          <p>H: ${Number(stock.day_high).toFixed(2)}</p>
                          <p>L: ${Number(stock.day_low).toFixed(2)}</p>
                        </div>
                        <DataBadge meta={stock._meta} />
                        <Link to={`/simulator/trade?symbol=${stock.symbol}`}><Button size="sm">Trade</Button></Link>
                      </div>
                    ))}
                    {filteredStocks.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No stocks found matching your search.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* GSE Stock Simulation Dialog */}
      {simStock && (
        <SimulationDialog
          open={simOpen}
          onOpenChange={setSimOpen}
          assetName={simStock.name}
          assetSymbol={simStock.symbol}
          price={simStock.price}
          assetType="gse-stock"
          currency="GHS"
        />
      )}
    </MainLayout>
  );
}
