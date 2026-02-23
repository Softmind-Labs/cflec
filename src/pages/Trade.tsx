import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';
import type { Portfolio, MockStock, StockHolding } from '@/types';

export default function Trade() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [stocks, setStocks] = useState<MockStock[]>([]);
  const [holdings, setHoldings] = useState<StockHolding[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<MockStock | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const [stocksRes, portfolioRes] = await Promise.all([
        supabase.from('mock_stocks').select('*').order('symbol'),
        supabase.from('portfolios').select('*').eq('user_id', user.id).maybeSingle(),
      ]);

      if (stocksRes.data) setStocks(stocksRes.data as MockStock[]);
      
      if (portfolioRes.data) {
        setPortfolio(portfolioRes.data as Portfolio);
        
        const { data: holdingsData } = await supabase
          .from('stock_holdings')
          .select('*')
          .eq('portfolio_id', portfolioRes.data.id);
        
        if (holdingsData) setHoldings(holdingsData as StockHolding[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const filteredStocks = stocks.filter(s => 
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHolding = (stockId: string) => {
    return holdings.find(h => h.stock_id === stockId);
  };

  const calculateTotal = () => {
    if (!selectedStock || !quantity) return 0;
    return Number(selectedStock.current_price) * parseInt(quantity);
  };

  const canAfford = () => {
    if (tradeType === 'buy') {
      return calculateTotal() <= Number(portfolio?.cash_balance || 0);
    }
    const holding = getHolding(selectedStock?.id || '');
    return (holding?.quantity || 0) >= parseInt(quantity || '0');
  };

  const handleTrade = async () => {
    if (!selectedStock || !quantity || !portfolio) return;

    setIsSubmitting(true);

    try {
      const qty = parseInt(quantity);
      const total = calculateTotal();

      if (tradeType === 'buy') {
        // Update cash balance
        const newBalance = Number(portfolio.cash_balance) - total;
        await supabase
          .from('portfolios')
          .update({ cash_balance: newBalance })
          .eq('id', portfolio.id);

        // Update or create holding
        const existingHolding = getHolding(selectedStock.id);
        if (existingHolding) {
          const newQty = existingHolding.quantity + qty;
          const newAvgCost = ((existingHolding.quantity * Number(existingHolding.average_cost)) + total) / newQty;
          await supabase
            .from('stock_holdings')
            .update({ quantity: newQty, average_cost: newAvgCost })
            .eq('id', existingHolding.id);
        } else {
          await supabase
            .from('stock_holdings')
            .insert({
              portfolio_id: portfolio.id,
              stock_id: selectedStock.id,
              quantity: qty,
              average_cost: selectedStock.current_price
            });
        }

        // Record transaction
        await supabase.from('transactions').insert({
          portfolio_id: portfolio.id,
          stock_id: selectedStock.id,
          transaction_type: 'buy',
          quantity: qty,
          price_per_share: selectedStock.current_price,
          total_amount: total
        });

        setPortfolio({ ...portfolio, cash_balance: newBalance });
        
      } else {
        // Sell logic
        const existingHolding = getHolding(selectedStock.id);
        if (!existingHolding) return;

        const newQty = existingHolding.quantity - qty;
        const newBalance = Number(portfolio.cash_balance) + total;

        await supabase
          .from('portfolios')
          .update({ cash_balance: newBalance })
          .eq('id', portfolio.id);

        if (newQty <= 0) {
          await supabase
            .from('stock_holdings')
            .delete()
            .eq('id', existingHolding.id);
          setHoldings(holdings.filter(h => h.id !== existingHolding.id));
        } else {
          await supabase
            .from('stock_holdings')
            .update({ quantity: newQty })
            .eq('id', existingHolding.id);
          setHoldings(holdings.map(h => 
            h.id === existingHolding.id ? { ...h, quantity: newQty } : h
          ));
        }

        await supabase.from('transactions').insert({
          portfolio_id: portfolio.id,
          stock_id: selectedStock.id,
          transaction_type: 'sell',
          quantity: qty,
          price_per_share: selectedStock.current_price,
          total_amount: total
        });

        setPortfolio({ ...portfolio, cash_balance: newBalance });
      }

      toast({
        title: 'Trade Successful!',
        description: `${tradeType === 'buy' ? 'Bought' : 'Sold'} ${qty} shares of ${selectedStock.symbol} for $${total.toFixed(2)}`,
      });

      setIsDialogOpen(false);
      setQuantity('');
      setSelectedStock(null);

      // Refresh holdings
      const { data: holdingsData } = await supabase
        .from('stock_holdings')
        .select('*')
        .eq('portfolio_id', portfolio.id);
      if (holdingsData) setHoldings(holdingsData as StockHolding[]);

    } catch (error) {
      toast({
        title: 'Trade Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTradeDialog = (stock: MockStock, type: 'buy' | 'sell') => {
    setSelectedStock(stock);
    setTradeType(type);
    setQuantity('');
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-full max-w-md" />
            <div className="grid gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/simulator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display">Trade Stocks</h1>
            <p className="text-muted-foreground">
               Cash Available: <span className="font-semibold text-cflp-green tabular-nums">
                 ${Number(portfolio?.cash_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </span>
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks by symbol or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stocks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStocks.map((stock) => {
            const change = Number(stock.current_price) - Number(stock.previous_close || stock.current_price);
            const changePercent = (change / Number(stock.previous_close || stock.current_price)) * 100;
            const holding = getHolding(stock.id);

            return (
              <Card key={stock.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                        <CardDescription className="text-xs">{stock.name}</CardDescription>
                      </div>
                    </div>
                    {holding && (
                      <Badge variant="secondary">
                        {holding.quantity} shares
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold tabular-nums">${Number(stock.current_price).toFixed(2)}</p>
                       <p className={`text-sm flex items-center gap-1 tabular-nums ${change >= 0 ? 'text-gain' : 'text-loss'}`}>
                         {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                         {change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                      </p>
                    </div>
                    <Badge variant="outline">{stock.sector}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => openTradeDialog(stock, 'buy')}
                    >
                      Buy
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => openTradeDialog(stock, 'sell')}
                      disabled={!holding}
                    >
                      Sell
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trade Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedStock?.symbol}
              </DialogTitle>
              <DialogDescription>
                {selectedStock?.name} @ ${Number(selectedStock?.current_price || 0).toFixed(2)} per share
              </DialogDescription>
            </DialogHeader>

            <Tabs value={tradeType} onValueChange={(v) => setTradeType(v as 'buy' | 'sell')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell" disabled={!getHolding(selectedStock?.id || '')}>
                  Sell
                </TabsTrigger>
              </TabsList>

              <TabsContent value={tradeType} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Number of Shares</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                {quantity && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per share</span>
                      <span>${Number(selectedStock?.current_price || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {tradeType === 'buy' && (
                  <p className="text-sm text-muted-foreground">
                    Available cash: ${Number(portfolio?.cash_balance || 0).toFixed(2)}
                  </p>
                )}

                {tradeType === 'sell' && selectedStock && (
                  <p className="text-sm text-muted-foreground">
                    You own: {getHolding(selectedStock.id)?.quantity || 0} shares
                  </p>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleTrade}
                disabled={!quantity || parseInt(quantity) <= 0 || !canAfford() || isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
