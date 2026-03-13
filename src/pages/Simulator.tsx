import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsBar } from '@/components/ui/stats-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TradePanel, type TradeType } from '@/components/simulator/TradePanel';
import { AllocationChart } from '@/components/simulator/AllocationChart';
import { useSimulatorWallet, type Position } from '@/hooks/useSimulatorWallet';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Building2,
  TrendingUp,
  CandlestickChart,
  Landmark,
  ArrowRight,
  Trophy,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from 'lucide-react';

const accentColors = {
  banking: 'hsl(217, 91%, 60%)',
  investment: 'hsl(142, 76%, 36%)',
  trading: 'hsl(36, 77%, 49%)',
  capital_markets: 'hsl(239, 84%, 67%)',
};

const categoryLabels: Record<string, string> = {
  banking: 'Banking',
  investment: 'Investment',
  trading: 'Trading',
  capital_markets: 'Capital Markets',
};

const simulatorRoutes: Record<string, string> = {
  banking: '/simulator/banking',
  investment: '/simulator/investment',
  trading: '/simulator/trading',
  capital_markets: '/simulator/capital-markets',
};

const tradeTypeBadge: Record<string, { label: string; className: string }> = {
  buy: { label: 'Buy', className: 'bg-gain/15 text-gain border-gain/30' },
  invest: { label: 'Invest', className: 'bg-gain/15 text-gain border-gain/30' },
  sell: { label: 'Sell', className: 'bg-loss/15 text-loss border-loss/30' },
};

const marketCategories = [
  {
    id: 'banking' as const,
    title: 'Banking',
    description: 'Treasury Bills, Fixed Deposits, Savings Accounts',
    icon: Building2,
    features: ['91, 182, 364-day T-Bills', 'Fixed Deposits up to 22% p.a.', 'High-yield Savings'],
    route: '/simulator/banking',
    positionLabel: (n: number) => (n === 0 ? 'No positions' : `${n} active deposit${n > 1 ? 's' : ''}`),
  },
  {
    id: 'investment' as const,
    title: 'Investment',
    description: 'Ghana Stock Exchange & World Stock Markets',
    icon: TrendingUp,
    features: ['GSE Listed Stocks', 'NYSE & NASDAQ', 'Portfolio Tracking'],
    route: '/simulator/investment',
    positionLabel: (n: number) => (n === 0 ? 'No positions' : `${n} stock${n > 1 ? 's' : ''} held`),
  },
  {
    id: 'trading' as const,
    title: 'Trading',
    description: 'Forex, Commodities, and Crypto Demo',
    icon: CandlestickChart,
    features: ['GHS/USD, EUR/GHS Pairs', 'Gold, Cocoa, Oil', 'Bitcoin & Ethereum Demo'],
    route: '/simulator/trading',
    positionLabel: (n: number) => (n === 0 ? 'No positions' : `${n} position${n > 1 ? 's' : ''}`),
  },
  {
    id: 'capital_markets' as const,
    title: 'Capital Markets',
    description: 'Bonds, Mutual Funds, and ETFs',
    icon: Landmark,
    features: ['Government Bonds', 'Databank, Fidelity Funds', 'Gold & Equity ETFs'],
    route: '/simulator/capital-markets',
    positionLabel: (n: number) => (n === 0 ? 'No positions' : `${n} bond${n > 1 ? 's' : ''}/fund${n > 1 ? 's' : ''}`),
  },
];

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Simulator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    loading,
    cashBalance,
    totalPortfolio,
    totalReturn,
    totalInvested,
    positions,
    recentTrades,
    positionsByType,
    refetch,
  } = useSimulatorWallet();

  const isPositive = totalReturn >= 0;

  // Sell from hub
  const [sellOpen, setSellOpen] = useState(false);
  const [sellPosition, setSellPosition] = useState<Position | null>(null);

  const openSell = (pos: Position) => {
    setSellPosition(pos);
    setSellOpen(true);
  };

  return (
    <MainLayout>
      <div className="min-h-full bg-background">
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-sm text-muted-foreground mb-3">Practice Trading</p>
            <h1 className="font-display font-bold text-[2rem] mb-3">Market Simulator</h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Learn to invest with virtual money across multiple markets — all from one wallet.
            </p>
          </div>

          {/* Portfolio Stats */}
          {user && (
            <div className="mb-10">
              {loading ? (
                <div className="flex gap-4 justify-center">
                  <Skeleton className="h-20 w-56 rounded-xl" />
                  <Skeleton className="h-20 w-56 rounded-xl" />
                  <Skeleton className="h-20 w-56 rounded-xl" />
                </div>
              ) : (
                <StatsBar
                  className="max-w-3xl mx-auto justify-center"
                  items={[
                    {
                      label: 'Cash Available',
                      value: formatCurrency(cashBalance),
                      icon: <Wallet className="h-4 w-4" />,
                    },
                    {
                      label: 'Total Portfolio',
                      value: formatCurrency(totalPortfolio),
                      icon: <BarChart3 className="h-4 w-4" />,
                    },
                    {
                      label: 'Total Return',
                      value: `${isPositive ? '+' : ''}${totalReturn.toFixed(2)}%`,
                      icon: isPositive
                        ? <ArrowUpRight className="h-4 w-4 text-[hsl(var(--cflp-green))]" />
                        : <ArrowDownRight className="h-4 w-4 text-destructive" />,
                    },
                  ]}
                />
              )}
            </div>
          )}

          {/* Market Categories Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {marketCategories.map((category) => {
              const Icon = category.icon;
              const accent = accentColors[category.id];
              const summary = positionsByType[category.id];
              const count = summary?.count ?? 0;

              return (
                <Card
                  key={category.id}
                  className="min-h-[280px] flex flex-col overflow-hidden"
                >
                  <CardHeader className="flex-none">
                    <div className="flex items-center justify-between">
                      <div
                        className="h-[52px] w-[52px] rounded-[14px] flex items-center justify-center"
                        style={{ backgroundColor: `${accent}1a` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: accent }} />
                      </div>
                      {user && !loading && (
                        <Badge
                          variant={count > 0 ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {category.positionLabel(count)}
                        </Badge>
                      )}
                      {!user && (
                        <span className="text-sm text-muted-foreground">4 Markets</span>
                      )}
                    </div>
                    <CardTitle className="font-display font-semibold text-[1.25rem] mt-4">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-[0.875rem]">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-2 mb-5 flex-1">
                      {category.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-[0.875rem] text-muted-foreground"
                        >
                          <CheckCircle2
                            className="h-3.5 w-3.5 shrink-0"
                            style={{ color: `${accent}99` }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to={category.route} className="mt-auto self-start">
                      <Button
                        className="gap-2 rounded-lg h-10 px-5 text-[0.875rem] font-semibold text-primary-foreground"
                        style={{ backgroundColor: accent }}
                      >
                        Enter {category.title}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* My Positions */}
          {user && (
            <div className="mt-12">
              <h2 className="font-display font-semibold text-xl mb-4">My Positions</h2>
              {loading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : positions.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">
                      No positions yet — pick a market above to start investing.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Entry Price</TableHead>
                        <TableHead className="text-right">Invested</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {positions.slice(0, 10).map((pos) => (
                        <TableRow key={pos.id}>
                          <TableCell
                            className="cursor-pointer"
                            onClick={() => navigate(simulatorRoutes[pos.simulator_type] || '/simulator')}
                          >
                            <div>
                              <p className="font-medium text-sm">{pos.asset_name}</p>
                              <p className="text-xs text-muted-foreground">{pos.asset_symbol}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {categoryLabels[pos.simulator_type] || pos.simulator_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {pos.quantity}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCurrency(pos.entry_price)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums font-medium">
                            {formatCurrency(pos.total_invested)}
                          </TableCell>
                          <TableCell className="text-right">
                            {pos.position_type === 'market' && (
                              <Button size="sm" variant="outline" className="text-loss" onClick={() => openSell(pos)}>
                                Sell
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {positions.length > 10 && (
                    <div className="px-7 pb-5 pt-2 text-sm text-muted-foreground text-center">
                      Showing 10 of {positions.length} positions
                    </div>
                  )}
                </Card>
              )}
            </div>
          )}

          {/* Recent Activity */}
          {user && (
            <div className="mt-12">
              <h2 className="font-display font-semibold text-xl mb-4">Recent Activity</h2>
              {loading ? (
                <Skeleton className="h-32 w-full rounded-xl" />
              ) : recentTrades.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">
                      No trades yet — execute your first trade to see activity here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTrades.map((trade) => {
                        const badge = tradeTypeBadge[trade.trade_type] || tradeTypeBadge.buy;
                        return (
                          <TableRow key={trade.id}>
                            <TableCell className="text-sm tabular-nums text-muted-foreground">
                              {format(new Date(trade.created_at), 'MMM d, HH:mm')}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{trade.asset_name}</p>
                                <p className="text-xs text-muted-foreground">{trade.asset_symbol}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${badge.className}`}>
                                {badge.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{trade.quantity}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatCurrency(trade.price_at_execution)}</TableCell>
                            <TableCell className="text-right tabular-nums font-medium">{formatCurrency(trade.total_value)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          )}

          {/* Leaderboard Banner */}
          <Card className="mt-10">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Ready to compete?</h3>
                  <p className="text-muted-foreground">
                    Grow your virtual portfolio and climb the leaderboard in your region!
                  </p>
                </div>
                <Link to="/simulator/leaderboard">
                  <Button variant="secondary" className="gap-2">
                    <Trophy className="h-4 w-4" />
                    View Leaderboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sell Trade Panel */}
      {sellPosition && (
        <TradePanel
          open={sellOpen}
          onOpenChange={setSellOpen}
          assetName={sellPosition.asset_name}
          assetSymbol={sellPosition.asset_symbol}
          price={sellPosition.entry_price}
          simulatorType={sellPosition.simulator_type}
          category={sellPosition.category}
          positionType="market"
          tradeType="sell"
          cashBalance={cashBalance}
          onSuccess={refetch}
        />
      )}
    </MainLayout>
  );
}
