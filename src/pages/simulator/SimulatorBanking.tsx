import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Landmark, 
  PiggyBank, 
  Clock, 
  Percent, 
  Calculator,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { GHANAIAN_BANKS } from '@/lib/constants';

// Mock data for banking products
const treasuryBills = [
  { term: 91, rate: 25.5, minAmount: 100 },
  { term: 182, rate: 27.0, minAmount: 100 },
  { term: 364, rate: 28.5, minAmount: 100 },
];

const fixedDeposits = [
  { bank: 'gcb', term: 3, rate: 18.0, minAmount: 500 },
  { bank: 'ecobank', term: 6, rate: 20.5, minAmount: 1000 },
  { bank: 'absa', term: 12, rate: 22.0, minAmount: 2000 },
  { bank: 'fidelity', term: 12, rate: 21.5, minAmount: 1500 },
];

export default function SimulatorBanking() {
  const [selectedTBill, setSelectedTBill] = useState(treasuryBills[0]);
  const [tbillAmount, setTbillAmount] = useState('1000');
  const [savingsBalance] = useState(500);

  const calculateTBillReturn = () => {
    const amount = parseFloat(tbillAmount) || 0;
    const interest = (amount * selectedTBill.rate / 100) * (selectedTBill.term / 365);
    return { interest, total: amount + interest };
  };

  const tbillReturn = calculateTBillReturn();

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
              Banking Simulator
            </h1>
            <p className="text-muted-foreground">
              Learn about Treasury Bills, Fixed Deposits, and Savings
            </p>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />
                Total Banking Portfolio
              </CardDescription>
              <CardTitle className="text-3xl text-cflp-green">GHS 2,500.00</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Across all banking products</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Total Interest Earned
              </CardDescription>
              <CardTitle className="text-3xl text-cflp-gold">GHS 125.50</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <PiggyBank className="h-4 w-4" />
                Savings Balance
              </CardDescription>
              <CardTitle className="text-3xl">GHS {savingsBalance.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Available to invest</p>
            </CardContent>
          </Card>
        </div>

        {/* Product Tabs */}
        <Tabs defaultValue="tbills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tbills">Treasury Bills</TabsTrigger>
            <TabsTrigger value="fixed">Fixed Deposits</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>

          {/* Treasury Bills */}
          <TabsContent value="tbills">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Treasury Bills
                  </CardTitle>
                  <CardDescription>
                    Government-backed securities with guaranteed returns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Term</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {treasuryBills.map((bill) => (
                        <div
                          key={bill.term}
                          onClick={() => setSelectedTBill(bill)}
                          className={`p-4 rounded-lg border text-center cursor-pointer transition-colors ${
                            selectedTBill.term === bill.term
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <p className="font-bold text-lg">{bill.term}</p>
                          <p className="text-sm text-muted-foreground">Days</p>
                          <Badge variant="secondary" className="mt-2">{bill.rate}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Investment Amount (GHS)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={tbillAmount}
                      onChange={(e) => setTbillAmount(e.target.value)}
                      min={selectedTBill.minAmount}
                    />
                    <p className="text-sm text-muted-foreground">
                      Minimum: GHS {selectedTBill.minAmount}
                    </p>
                  </div>

                  <Button className="w-full">Invest in T-Bill</Button>
                </CardContent>
              </Card>

              <Card className="glass-card-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Investment Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Term</p>
                      <p className="text-2xl font-bold">{selectedTBill.term} Days</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="text-2xl font-bold">{selectedTBill.rate}%</p>
                    </div>
                  </div>

                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Principal Amount</p>
                    <p className="text-2xl font-bold">GHS {parseFloat(tbillAmount || '0').toFixed(2)}</p>
                  </div>

                  <div className="p-4 bg-cflp-green/10 rounded-lg border border-cflp-green/20">
                    <p className="text-sm text-muted-foreground">Interest Earned</p>
                    <p className="text-2xl font-bold text-cflp-green">
                      GHS {tbillReturn.interest.toFixed(2)}
                    </p>
                  </div>

                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground">Maturity Value</p>
                    <p className="text-3xl font-bold text-primary">
                      GHS {tbillReturn.total.toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fixed Deposits */}
          <TabsContent value="fixed">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {fixedDeposits.map((deposit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {GHANAIAN_BANKS[deposit.bank as keyof typeof GHANAIAN_BANKS]}
                    </CardTitle>
                    <CardDescription>{deposit.term} Months Fixed Deposit</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Percent className="h-4 w-4" />
                        Interest Rate
                      </span>
                      <span className="font-bold text-cflp-green">{deposit.rate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Term
                      </span>
                      <span className="font-medium">{deposit.term} months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Min. Amount</span>
                      <span className="font-medium">GHS {deposit.minAmount}</span>
                    </div>
                    <Button className="w-full" variant="outline">Open FD</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Savings */}
          <TabsContent value="savings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Savings Account
                </CardTitle>
                <CardDescription>
                  Your virtual savings account for the simulator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-cflp-green/10 to-transparent rounded-xl border border-cflp-green/20">
                    <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
                    <p className="text-4xl font-bold text-cflp-green">GHS {savingsBalance.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-2">Interest Rate: 5.0% p.a.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Quick Deposit</Label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="Enter amount" />
                        <Button>Deposit</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Quick Withdrawal</Label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="Enter amount" />
                        <Button variant="outline">Withdraw</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}