import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataBadge } from '@/components/simulator/DataBadge';
import { useMarketData } from '@/hooks/useMarketData';
import {
  ArrowLeft,
  Landmark,
  Calculator,
  PiggyBank,
} from 'lucide-react';

export default function SimulatorBanking() {
  const { data: tbills, isLoading: tbillsLoading } = useMarketData('tbills');

  // Fixed Deposit Calculator state
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('22');
  const [tenure, setTenure] = useState('12');
  const [institution, setInstitution] = useState('');
  const [fdResult, setFdResult] = useState<{ maturity: number; interest: number; monthlyRate: number } | null>(null);

  const calculateFD = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const t = parseInt(tenure) || 0;
    const interest = p * (r / 100) * (t / 12);
    const maturity = p + interest;
    const monthlyRate = r / 12;
    setFdResult({ maturity, interest, monthlyRate });
  };

  const savingsRates = [
    { bank: 'GCB Bank', rate: '8.5%', min: 'GHS 50' },
    { bank: 'Ecobank', rate: '9.0%', min: 'GHS 100' },
    { bank: 'Absa Bank', rate: '8.0%', min: 'GHS 200' },
    { bank: 'Fidelity Bank', rate: '10.5%', min: 'GHS 50' },
    { bank: 'Stanbic Bank', rate: '9.5%', min: 'GHS 100' },
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/simulator">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
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

        {/* Section 1: T-Bills */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Treasury Bills (Bank of Ghana)</h2>
          {tbillsLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i}><CardContent className="pt-6 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </CardContent></Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {(tbills ?? []).map((bill) => (
                <Card key={bill.tenor}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{bill.tenor.replace('-', '-Day ').replace('day', '')} T-Bill</CardTitle>
                      <DataBadge meta={bill._meta} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-4xl font-bold">{bill.rate}%</p>
                    <p className="text-sm text-muted-foreground">Annual Yield</p>
                    <p className="text-xs text-muted-foreground">{bill.source}</p>
                    <p className="text-xs text-muted-foreground">Updated: {bill.updated}</p>
                    <Button className="w-full mt-2" variant="outline">Simulated Investment</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Fixed Deposit Calculator */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Fixed Deposit Calculator
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="principal">Principal Amount (GHS)</Label>
                    <Input id="principal" type="number" placeholder="e.g. 10000" value={principal} onChange={e => setPrincipal(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
                    <Input id="rate" type="number" value={rate} onChange={e => setRate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tenure (months)</Label>
                    <Select value={tenure} onValueChange={setTenure}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['3', '6', '9', '12', '24'].map(m => (
                          <SelectItem key={m} value={m}>{m} months</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Select value={institution} onValueChange={setInstitution}>
                      <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                      <SelectContent>
                        {['GCB Bank', 'Ecobank', 'Absa Bank', 'Fidelity Bank', 'Stanbic Bank'].map(b => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={calculateFD} className="w-full">Calculate</Button>
                </div>

                {fdResult && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground">Maturity Amount</p>
                      <p className="text-3xl font-bold">GHS {fdResult.maturity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground">Interest Earned</p>
                      <p className="text-2xl font-bold text-green-600">GHS {fdResult.interest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground">Effective Monthly Rate</p>
                      <p className="text-xl font-bold">{fdResult.monthlyRate.toFixed(2)}%</p>
                    </div>
                    {/* Visual bar */}
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Principal vs Interest</p>
                      <div className="flex h-4 rounded-full overflow-hidden">
                        <div
                          className="bg-primary"
                          style={{ width: `${(parseFloat(principal) / fdResult.maturity) * 100}%` }}
                        />
                        <div
                          className="bg-green-500"
                          style={{ width: `${(fdResult.interest / fdResult.maturity) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Principal</span>
                        <span>Interest</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Savings Account Rates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Savings Account Rates
            </h2>
            <DataBadge meta={{ source: 'fallback', cached: false, simulated: true }} />
          </div>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bank</TableHead>
                    <TableHead>Rate (p.a.)</TableHead>
                    <TableHead>Min. Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savingsRates.map(row => (
                    <TableRow key={row.bank}>
                      <TableCell className="font-medium">{row.bank}</TableCell>
                      <TableCell>{row.rate}</TableCell>
                      <TableCell>{row.min}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground mt-4">
                Rates are indicative. Contact your bank for current offers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
