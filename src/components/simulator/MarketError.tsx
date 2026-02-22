import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface MarketErrorProps {
  onRetry: () => void;
}

export function MarketError({ onRetry }: MarketErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
      <AlertCircle className="h-10 w-10 text-muted-foreground" />
      <p className="text-muted-foreground">Market data temporarily unavailable</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}
