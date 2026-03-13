import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type Position } from '@/hooks/useSimulatorWallet';
import { format } from 'date-fns';

interface PositionsSectionProps {
  positions: Position[];
  title?: string;
  emptyMessage?: string;
  showMaturity?: boolean;
  onSell?: (position: Position) => void;
  sellLabel?: string;
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function PositionsSection({
  positions,
  title = 'Your Positions',
  emptyMessage = 'No positions yet.',
  showMaturity = false,
  onSell,
  sellLabel = 'Sell',
}: PositionsSectionProps) {
  if (positions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Entry Price</TableHead>
              <TableHead className="text-right">Invested</TableHead>
              {showMaturity && <TableHead className="text-right">Maturity</TableHead>}
              {onSell && <TableHead className="text-right">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos) => (
              <TableRow key={pos.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{pos.asset_name}</p>
                    <p className="text-xs text-muted-foreground">{pos.asset_symbol}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{pos.quantity}</TableCell>
                <TableCell className="text-right tabular-nums">{formatCurrency(pos.entry_price)}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">{formatCurrency(pos.total_invested)}</TableCell>
                {showMaturity && (
                  <TableCell className="text-right text-sm">
                    {pos.maturity_date ? (
                      <div>
                        <p className="tabular-nums">{format(new Date(pos.maturity_date), 'MMM d, yyyy')}</p>
                        {pos.is_matured && <Badge variant="secondary" className="text-xs">Matured</Badge>}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                {onSell && (
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="text-loss" onClick={() => onSell(pos)}>
                      {sellLabel}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
