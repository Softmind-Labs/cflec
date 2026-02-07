import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  TrendingUp, 
  CandlestickChart, 
  Landmark,
  ArrowRight,
  Trophy,
  Wallet
} from 'lucide-react';

const marketCategories = [
  {
    id: 'banking',
    title: 'Banking',
    description: 'Treasury Bills, Fixed Deposits, Savings Accounts',
    icon: Building2,
    color: 'primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
    features: ['91, 182, 364-day T-Bills', 'Fixed Deposits up to 22% p.a.', 'High-yield Savings'],
    route: '/simulator/banking',
  },
  {
    id: 'investment',
    title: 'Investment',
    description: 'Ghana Stock Exchange & World Stock Markets',
    icon: TrendingUp,
    color: 'cflp-green',
    bgColor: 'bg-[hsl(var(--cflp-green)/0.1)]',
    borderColor: 'border-[hsl(var(--cflp-green)/0.2)]',
    textColor: 'text-[hsl(var(--cflp-green))]',
    features: ['GSE Listed Stocks', 'NYSE & NASDAQ', 'Portfolio Tracking'],
    route: '/simulator/investment',
  },
  {
    id: 'trading',
    title: 'Trading',
    description: 'Forex, Commodities, and Crypto Demo',
    icon: CandlestickChart,
    color: 'cflp-gold',
    bgColor: 'bg-[hsl(var(--cflp-gold)/0.1)]',
    borderColor: 'border-[hsl(var(--cflp-gold)/0.2)]',
    textColor: 'text-[hsl(var(--cflp-gold))]',
    features: ['GHS/USD, EUR/GHS Pairs', 'Gold, Cocoa, Oil', 'Bitcoin & Ethereum Demo'],
    route: '/simulator/trading',
  },
  {
    id: 'capital_markets',
    title: 'Capital Markets',
    description: 'Bonds, Mutual Funds, and ETFs',
    icon: Landmark,
    color: 'cflp-blue',
    bgColor: 'bg-[hsl(var(--cflp-blue)/0.1)]',
    borderColor: 'border-[hsl(var(--cflp-blue)/0.2)]',
    textColor: 'text-[hsl(var(--cflp-blue))]',
    features: ['Government Bonds', 'Databank, Fidelity Funds', 'Gold & Equity ETFs'],
    route: '/simulator/capital-markets',
  },
];

export default function Simulator() {
  return (
    <MainLayout>
      <div className="min-h-full bg-gradient-to-br from-primary/5 via-transparent to-cflp-gold/5">
        <div className="container py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Practice Trading</Badge>
            <h1 className="text-4xl font-bold mb-4">Market Simulator</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn to invest with virtual money. Choose a market category to start practicing your trading skills risk-free.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Starting Balance
                </CardDescription>
                <CardTitle className="text-3xl text-cflp-green">$500.00</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Virtual funds to practice with</p>
              </CardContent>
            </Card>

            <Card className="glass-card-gold">
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
              return (
                <Card 
                  key={category.id}
                  className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 border-2 ${category.borderColor} group`}
                >
                  <div className={`absolute inset-0 ${category.bgColor} opacity-50`} />
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div className={`h-14 w-14 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                        <Icon className={`h-7 w-7 ${category.textColor}`} />
                      </div>
                      <Badge variant="secondary">4 Markets</Badge>
                    </div>
                    <CardTitle className="text-2xl mt-4">{category.title}</CardTitle>
                    <CardDescription className="text-base">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-2 mb-6">
                      {category.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className={`h-1.5 w-1.5 rounded-full ${category.bgColor.replace('/0.1', '')}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to={category.route}>
                      <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                        Enter {category.title}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Info Banner */}
          <Card className="mt-12 glass-card-primary">
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
