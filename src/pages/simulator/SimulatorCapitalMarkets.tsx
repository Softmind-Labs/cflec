import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Landmark,
  PieChart,
  BarChart3,
  TrendingUp,
  Wallet,
  Calendar,
  Percent,
  Shield
} from 'lucide-react';

// Mock Bonds
const bonds = [
  { name: 'Ghana 5-Year Bond', yield: 29.5, maturity: '2029', rating: 'B-', minInvestment: 1000 },
  { name: 'Ghana 10-Year Bond', yield: 31.0, maturity: '2034', rating: 'B-', minInvestment: 1000 },
  { name: 'Corporate Bond - MTN', yield: 22.5, maturity: '2027', rating: 'BB', minInvestment: 5000 },
  { name: 'Corporate Bond - Ecobank', yield: 24.0, maturity: '2028', rating: 'BB-', minInvestment: 5000 },
];

// Mock Mutual Funds
const mutualFunds = [
  { name: 'Databank Epack', type: 'Equity Fund', nav: 2.85, ytdReturn: 18.5, minInvestment: 100 },
  { name: 'Fidelity Equity Fund', type: 'Equity Fund', nav: 1.92, ytdReturn: 15.2, minInvestment: 100 },
  { name: 'SAS Fortune Fund', type: 'Balanced Fund', nav: 3.45, ytdReturn: 12.8, minInvestment: 200 },
  { name: 'EDC Ghana Fixed Income', type: 'Fixed Income', nav: 1.15, ytdReturn: 22.0, minInvestment: 500 },
];

// Mock ETFs
const etfs = [
  { name: 'NewGold ETF', ticker: 'GLD', price: 285.50, change: 1.2, expense: 0.4 },
  { name: 'Ghana Equity ETF', ticker: 'GSE', price: 12.85, change: -0.5, expense: 0.5 },
  { name: 'Africa Growth ETF', ticker: 'AFR', price: 45.20, change: 2.1, expense: 0.65 },
];

export default function SimulatorCapitalMarkets() {
  const [capitalBalance] = useState(15000);

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
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Landmark className="h-8 w-8" />
              Capital Markets Simulator
            </h1>
            <p className="text-muted-foreground">
              Invest in Bonds, Mutual Funds, and ETFs
            </p>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card-primary">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                Capital Markets Portfolio
              </CardDescription>
              <CardTitle className="text-3xl">${capitalBalance.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Total invested value</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Annual Yield</CardDescription>
              <CardTitle className="text-3xl text-cflp-green">18.5%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Weighted average</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Active Investments</CardDescription>
              <CardTitle className="text-3xl">5</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Tabs */}
        <Tabs defaultValue="bonds" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bonds" className="gap-2">
              <Shield className="h-4 w-4" />
              Bonds
            </TabsTrigger>
            <TabsTrigger value="mutual-funds" className="gap-2">
              <PieChart className="h-4 w-4" />
              Mutual Funds
            </TabsTrigger>
            <TabsTrigger value="etfs" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              ETFs
            </TabsTrigger>
          </TabsList>

          {/* Bonds */}
          <TabsContent value="bonds">
            <Card>
              <CardHeader>
                <CardTitle>Government & Corporate Bonds</CardTitle>
                <CardDescription>Fixed income securities with regular interest payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bonds.map((bond, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold">{bond.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">Rating: {bond.rating}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Matures: {bond.maturity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-cflp-green">{bond.yield}%</p>
                          <p className="text-sm text-muted-foreground">Yield p.a.</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Min. Investment: GHS {bond.minInvestment.toLocaleString()}
                        </span>
                        <Button size="sm">Invest</Button>
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
                <CardTitle>Mutual Funds</CardTitle>
                <CardDescription>Professionally managed investment portfolios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mutualFunds.map((fund, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{fund.name}</p>
                          <Badge variant="secondary" className="mt-1">{fund.type}</Badge>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <PieChart className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 my-4">
                        <div>
                          <p className="text-sm text-muted-foreground">NAV</p>
                          <p className="font-semibold">GHS {fund.nav.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">YTD Return</p>
                          <p className="font-semibold text-cflp-green">+{fund.ytdReturn}%</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Min: GHS {fund.minInvestment}
                        </span>
                        <Button size="sm">Invest</Button>
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
                <CardTitle>Exchange Traded Funds (ETFs)</CardTitle>
                <CardDescription>Trade diversified funds like stocks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {etfs.map((etf, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-cflp-blue/10 flex items-center justify-center font-bold text-cflp-blue">
                          {etf.ticker}
                        </div>
                        <div>
                          <p className="font-semibold">{etf.name}</p>
                          <p className="text-sm text-muted-foreground">Expense Ratio: {etf.expense}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${etf.price.toFixed(2)}</p>
                        <p className={`text-sm ${etf.change >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                          {etf.change >= 0 ? '+' : ''}{etf.change}%
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Buy</Button>
                        <Button size="sm" variant="outline">Sell</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}