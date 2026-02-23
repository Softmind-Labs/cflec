import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  TrendingUp, 
  CandlestickChart, 
  Landmark,
  ArrowRight,
  Trophy,
  Wallet,
  CheckCircle2
} from 'lucide-react';

const accentColors = {
  banking: '#3b82f6',
  investment: '#16a34a',
  trading: '#d97706',
  capital_markets: '#6366f1',
};

const marketCategories = [
  {
    id: 'banking' as const,
    title: 'Banking',
    description: 'Treasury Bills, Fixed Deposits, Savings Accounts',
    icon: Building2,
    features: ['91, 182, 364-day T-Bills', 'Fixed Deposits up to 22% p.a.', 'High-yield Savings'],
    route: '/simulator/banking',
  },
  {
    id: 'investment' as const,
    title: 'Investment',
    description: 'Ghana Stock Exchange & World Stock Markets',
    icon: TrendingUp,
    features: ['GSE Listed Stocks', 'NYSE & NASDAQ', 'Portfolio Tracking'],
    route: '/simulator/investment',
  },
  {
    id: 'trading' as const,
    title: 'Trading',
    description: 'Forex, Commodities, and Crypto Demo',
    icon: CandlestickChart,
    features: ['GHS/USD, EUR/GHS Pairs', 'Gold, Cocoa, Oil', 'Bitcoin & Ethereum Demo'],
    route: '/simulator/trading',
  },
  {
    id: 'capital_markets' as const,
    title: 'Capital Markets',
    description: 'Bonds, Mutual Funds, and ETFs',
    icon: Landmark,
    features: ['Government Bonds', 'Databank, Fidelity Funds', 'Gold & Equity ETFs'],
    route: '/simulator/capital-markets',
  },
];

export default function Simulator() {
  return (
    <MainLayout>
      <div className="min-h-full bg-background">
        <div className="max-w-[1280px] mx-auto px-5 py-6 md:px-12 md:py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground mb-4">Practice Trading</p>
            <h1 className="font-display font-bold text-[2rem] mb-4">Market Simulator</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn to invest with virtual money. Choose a market category to start practicing your trading skills risk-free.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Starting Balance
                </CardDescription>
                <CardTitle className="text-3xl tabular-nums" style={{ color: '#16a34a' }}>$500.00</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Virtual funds to practice with</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </CardDescription>
                <CardTitle className="text-2xl">Compete & Win</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to="/simulator/leaderboard">
                  <Button variant="outline" size="sm" className="gap-2">
                    View Rankings
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Market Categories Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {marketCategories.map((category) => {
              const Icon = category.icon;
              const accent = accentColors[category.id];
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
                      <span className="text-sm text-muted-foreground">4 Markets</span>
                    </div>
                    <CardTitle className="font-display font-semibold text-[1.25rem] mt-4">{category.title}</CardTitle>
                    <CardDescription className="text-[0.875rem]">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-2 mb-5 flex-1">
                      {category.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-[0.875rem] text-[hsl(240_4%_36%)]">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: `${accent}99` }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to={category.route} className="mt-auto self-start">
                      <Button
                        className="gap-2 rounded-lg h-10 px-5 text-[0.875rem] font-semibold"
                        style={{ backgroundColor: accent, color: '#ffffff' }}
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

          {/* Info Banner */}
          <Card className="mt-12">
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
    </MainLayout>
  );
}
