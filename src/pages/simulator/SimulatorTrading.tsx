import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

// Mock Forex pairs
const forexPairs = [
  { pair: 'USD/GHS', bid: 14.85, ask: 14.95, change: 0.15 },
  { pair: 'EUR/GHS', bid: 16.20, ask: 16.35, change: -0.08 },
  { pair: 'GBP/GHS', bid: 18.90, ask: 19.05, change: 0.22 },
  { pair: 'EUR/USD', bid: 1.085, ask: 1.087, change: -0.12 },
  { pair: 'GBP/USD', bid: 1.268, ask: 1.270, change: 0.05 },
];

// Mock Commodities
const commodities = [
  { name: 'Gold', symbol: 'XAU', price: 2045.50, unit: '/oz', change: 1.2 },
  { name: 'Cocoa', symbol: 'CC', price: 4250.00, unit: '/mt', change: 2.5 },
  { name: 'Crude Oil', symbol: 'CL', price: 78.45, unit: '/bbl', change: -0.8 },
  { name: 'Silver', symbol: 'XAG', price: 23.85, unit: '/oz', change: 0.6 },
];

// Mock Crypto (Demo)
const cryptos = [
  { name: 'Bitcoin', symbol: 'BTC', price: 43250.00, change: 2.8 },
  { name: 'Ethereum', symbol: 'ETH', price: 2580.00, change: 1.5 },
  { name: 'Solana', symbol: 'SOL', price: 98.50, change: -1.2 },
  { name: 'Cardano', symbol: 'ADA', price: 0.52, change: 3.1 },
];

export default function SimulatorTrading() {
  const [tradingBalance] = useState(10000);

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
              <TrendingUp className="h-8 w-8" />
              Trading Simulator
            </h1>
            <p className="text-muted-foreground">
              Trade Forex, Commodities, and Crypto (Demo)
            </p>
          </div>
        </div>

        {/* Trading Balance */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card-gold">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                Trading Balance
              </CardDescription>
              <CardTitle className="text-3xl">${tradingBalance.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Virtual funds for trading</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Open Positions</CardDescription>
              <CardTitle className="text-3xl">3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-cflp-green">+$125.50 unrealized P/L</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Today's P/L</CardDescription>
              <CardTitle className="text-3xl text-cflp-green">+$85.20</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">5 trades completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Tabs */}
        <Tabs defaultValue="forex" className="space-y-6">
          <TabsList>
            <TabsTrigger value="forex" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Forex
            </TabsTrigger>
            <TabsTrigger value="commodities" className="gap-2">
              <Coins className="h-4 w-4" />
              Commodities
            </TabsTrigger>
            <TabsTrigger value="crypto" className="gap-2">
              <Bitcoin className="h-4 w-4" />
              Crypto (Demo)
            </TabsTrigger>
          </TabsList>

          {/* Forex */}
          <TabsContent value="forex">
            <Card>
              <CardHeader>
                <CardTitle>Forex Trading</CardTitle>
                <CardDescription>Trade major and GHS currency pairs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {forexPairs.map((pair) => (
                    <div 
                      key={pair.pair}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-cflp-blue/10 flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-cflp-blue" />
                        </div>
                        <div>
                          <p className="font-semibold">{pair.pair}</p>
                          <p className={`text-sm flex items-center gap-1 ${pair.change >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                            {pair.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {pair.change >= 0 ? '+' : ''}{pair.change}%
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Bid</p>
                        <p className="font-semibold">{pair.bid.toFixed(pair.bid < 10 ? 3 : 2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Ask</p>
                        <p className="font-semibold">{pair.ask.toFixed(pair.ask < 10 ? 3 : 2)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-cflp-green border-cflp-green hover:bg-cflp-green hover:text-white">
                          Buy
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white">
                          Sell
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commodities */}
          <TabsContent value="commodities">
            <Card>
              <CardHeader>
                <CardTitle>Commodities Trading</CardTitle>
                <CardDescription>Trade Gold, Cocoa, Oil, and more</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {commodities.map((commodity) => (
                    <div 
                      key={commodity.symbol}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-cflp-gold/10 flex items-center justify-center">
                          <Coins className="h-6 w-6 text-cflp-gold" />
                        </div>
                        <div>
                          <p className="font-semibold">{commodity.name}</p>
                          <p className="text-sm text-muted-foreground">{commodity.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${commodity.price.toLocaleString()}{commodity.unit}</p>
                        <p className={`text-sm flex items-center justify-end gap-1 ${commodity.change >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                          {commodity.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {commodity.change >= 0 ? '+' : ''}{commodity.change}%
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-cflp-green border-cflp-green hover:bg-cflp-green hover:text-white">
                          Buy
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white">
                          Sell
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crypto Demo */}
          <TabsContent value="crypto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Crypto Trading (Demo)</CardTitle>
                    <CardDescription>Practice trading cryptocurrency</CardDescription>
                  </div>
                  <Badge variant="secondary">Demo Mode</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {cryptos.map((crypto) => (
                    <div 
                      key={crypto.symbol}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bitcoin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{crypto.name}</p>
                          <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${crypto.price.toLocaleString()}</p>
                        <p className={`text-sm flex items-center justify-end gap-1 ${crypto.change >= 0 ? 'text-cflp-green' : 'text-destructive'}`}>
                          {crypto.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-cflp-green border-cflp-green hover:bg-cflp-green hover:text-white">
                          Buy
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white">
                          Sell
                        </Button>
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