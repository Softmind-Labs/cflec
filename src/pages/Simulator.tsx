import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PieChart
} from 'lucide-react';
import type { Portfolio, StockHolding, MockStock, Transaction } from '@/types';
import { STARTING_PORTFOLIO_BALANCE } from '@/lib/constants';

export default function Simulator() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [holdings, setHoldings] = useState<(StockHolding & { stock: MockStock })[]>([]);
  const [stocks, setStocks] = useState<MockStock[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch stocks first
      const { data: stocksData } = await supabase
        .from('mock_stocks')
        .select('*')
        .order('symbol');
      
      if (stocksData) setStocks(stocksData as MockStock[]);

      // Fetch or create portfolio
      let { data: portfolioData } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!portfolioData) {
        // Create new portfolio
        const { data: newPortfolio } = await supabase
          .from('portfolios')
          .insert({ user_id: user.id, cash_balance: STARTING_PORTFOLIO_BALANCE })
          .select()
          .single();
        portfolioData = newPortfolio;
      }

      if (portfolioData) {
        setPortfolio(portfolioData as Portfolio);

        // Fetch holdings with stock data
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

        // Fetch recent transactions
        const { data: txData } = await supabase
          .from('transactions')
          .select('*')
          .eq('portfolio_id', portfolioData.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (txData && stocksData) {
          const txWithStocks = txData.map(t => ({
            ...t,
            stock: stocksData.find(s => s.id === t.stock_id)
          }));
          setTransactions(txWithStocks as Transaction[]);
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

  const calculateGainLoss = () => {
    const total = calculateTotalValue();
    const initial = STARTING_PORTFOLIO_BALANCE;
    return {
      amount: total - initial,
      percentage: ((total - initial) / initial) * 100
    };
  };

  const gainLoss = calculateGainLoss();

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Trading Simulator
            </h1>
            <p className="text-muted-foreground mt-1">
              Practice trading with virtual money - no risk involved!
            </p>
          </div>
          <Link to="/simulator/trade">
            <Button size="lg" className="mt-4 md:mt-0 gap-2">
              <TrendingUp className="h-5 w-5" />
              Trade Now
            </Button>
          </Link>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                Total Value
              </CardDescription>
              <CardTitle className="text-3xl">
                ${calculateTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center gap-1 text-sm ${gainLoss.amount >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                {gainLoss.amount >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {gainLoss.amount >= 0 ? '+' : ''}${gainLoss.amount.toFixed(2)} ({gainLoss.percentage.toFixed(2)}%)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                Cash Balance
              </CardDescription>
              <CardTitle className="text-3xl">
                ${Number(portfolio?.cash_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Available to trade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Holdings Value
              </CardDescription>
              <CardTitle className="text-3xl">
                ${holdings.reduce((sum, h) => sum + (h.quantity * Number(h.stock.current_price)), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {holdings.length} positions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Total Trades
              </CardDescription>
              <CardTitle className="text-3xl">{transactions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Transactions made
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Holdings */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
                <CardDescription>Current stock positions in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                {holdings.length > 0 ? (
                  <div className="space-y-4">
                    {holdings.map((holding) => {
                      const currentValue = holding.quantity * Number(holding.stock.current_price);
                      const costBasis = holding.quantity * Number(holding.average_cost);
                      const gain = currentValue - costBasis;
                      const gainPercent = (gain / costBasis) * 100;

                      return (
                        <div key={holding.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                              {holding.stock.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold">{holding.stock.symbol}</p>
                              <p className="text-sm text-muted-foreground">{holding.stock.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className={`text-sm ${gain >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                              {gain >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{holding.quantity} shares</p>
                            <p className="text-sm text-muted-foreground">
                              @ ${Number(holding.stock.current_price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No holdings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start trading to build your portfolio!
                    </p>
                    <Link to="/simulator/trade">
                      <Button>Make Your First Trade</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
                <CardDescription>Available stocks to trade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stocks.slice(0, 5).map((stock) => {
                    const change = Number(stock.current_price) - Number(stock.previous_close || stock.current_price);
                    const changePercent = (change / Number(stock.previous_close || stock.current_price)) * 100;

                    return (
                      <div key={stock.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{stock.symbol}</p>
                          <p className="text-xs text-muted-foreground">{stock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${Number(stock.current_price).toFixed(2)}</p>
                          <p className={`text-xs ${change >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                            {change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link to="/simulator/trade" className="block mt-4">
                  <Button variant="outline" className="w-full">View All Stocks</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={tx.transaction_type === 'buy' ? 'default' : 'secondary'}>
                            {tx.transaction_type.toUpperCase()}
                          </Badge>
                          <span className="text-sm">{tx.stock?.symbol}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${Number(tx.total_amount).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{tx.quantity} shares</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No transactions yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Leaderboard CTA */}
            <Card className="bg-gradient-to-br from-cflp-gold/10 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏆 Leaderboard
                </CardTitle>
                <CardDescription>
                  See how you rank against other traders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/simulator/leaderboard">
                  <Button variant="outline" className="w-full">
                    View Rankings
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
