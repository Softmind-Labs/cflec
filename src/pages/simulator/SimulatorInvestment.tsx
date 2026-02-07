import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Globe,
  Building
} from 'lucide-react';
import type { MockStock, Portfolio, StockHolding } from '@/types';
import { STARTING_PORTFOLIO_BALANCE } from '@/lib/constants';

// Mock GSE Stocks
const gseStocks = [
  { symbol: 'MTN', name: 'MTN Ghana', price: 1.25, change: 2.5 },
  { symbol: 'GCB', name: 'GCB Bank', price: 5.80, change: -0.8 },
  { symbol: 'GOIL', name: 'GOIL PLC', price: 1.85, change: 1.2 },
  { symbol: 'SCB', name: 'Standard Chartered Bank', price: 22.50, change: 0.5 },
  { symbol: 'TOTAL', name: 'Total Petroleum Ghana', price: 3.20, change: -1.5 },
  { symbol: 'FML', name: 'Fan Milk Limited', price: 2.10, change: 3.2 },
];

export default function SimulatorInvestment() {
  const { user } = useAuth();
  const [stocks, setStocks] = useState<MockStock[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [holdings, setHoldings] = useState<(StockHolding & { stock: MockStock })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data: stocksData } = await supabase
        .from('mock_stocks')
        .select('*')
        .order('symbol');
      
      if (stocksData) setStocks(stocksData as MockStock[]);

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

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/simulator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-8 w-8" />
              Investment Simulator
            </h1>
            <p className="text-muted-foreground">
              Trade stocks on Ghana Stock Exchange and World Markets
            </p>
          </div>
          <Link to="/simulator/trade">
            <Button className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Trade Now
            </Button>
          </Link>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card-green">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                Total Portfolio Value
              </CardDescription>
              <CardTitle className="text-3xl">
                ${calculateTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-cflp-green">
                <ArrowUpRight className="h-4 w-4" />
                +5.2% all time
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Cash Balance</CardDescription>
              <CardTitle className="text-3xl">
                ${Number(portfolio?.cash_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Available to invest</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Holdings Value</CardDescription>
              <CardTitle className="text-3xl">
                ${holdings.reduce((sum, h) => sum + (h.quantity * Number(h.stock.current_price)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{holdings.length} positions</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Tabs */}
        <Tabs defaultValue="gse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="gse" className="gap-2">
              <Building className="h-4 w-4" />
              Ghana Stock Exchange
            </TabsTrigger>
            <TabsTrigger value="world" className="gap-2">
              <Globe className="h-4 w-4" />
              World Markets
            </TabsTrigger>
          </TabsList>

          {/* GSE */}
          <TabsContent value="gse">
            <Card>
              <CardHeader>
                <CardTitle>Ghana Stock Exchange (GSE)</CardTitle>
                <CardDescription>Trade local Ghanaian stocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {gseStocks.map((stock) => (
                    <div 
                      key={stock.symbol}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {stock.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold">{stock.symbol}</p>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">GHS {stock.price.toFixed(2)}</p>
                        <p className={`text-sm flex items-center justify-end gap-1 ${stock.change >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                          {stock.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </p>
                      </div>
                      <Button size="sm">Trade</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* World Markets */}
          <TabsContent value="world">
            <Card>
              <CardHeader>
                <CardTitle>World Stock Markets</CardTitle>
                <CardDescription>Trade international stocks (NYSE, NASDAQ)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stocks.slice(0, 6).map((stock) => {
                    const change = Number(stock.current_price) - Number(stock.previous_close || stock.current_price);
                    const changePercent = (change / Number(stock.previous_close || stock.current_price)) * 100;

                    return (
                      <div 
                        key={stock.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-cflp-blue/10 flex items-center justify-center font-bold text-cflp-blue">
                            {stock.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold">{stock.symbol}</p>
                            <p className="text-sm text-muted-foreground">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${Number(stock.current_price).toFixed(2)}</p>
                          <p className={`text-sm flex items-center justify-end gap-1 ${change >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                            {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                          </p>
                        </div>
                        <Link to="/simulator/trade">
                          <Button size="sm">Trade</Button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <Link to="/simulator/trade" className="block mt-4">
                  <Button variant="outline" className="w-full">View All Stocks</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}