import { Badge } from '@/components/ui/badge';

interface DataBadgeProps {
  meta?: { source: string; cached: boolean; simulated: boolean };
}

export function DataBadge({ meta }: DataBadgeProps) {
  if (!meta) return null;

  if (meta.simulated) {
    return (
      <Badge variant="outline" className="gap-1.5 text-xs">
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        Simulated
      </Badge>
    );
  }

  if (meta.cached) {
    return (
      <Badge variant="outline" className="gap-1.5 text-xs">
        <span className="h-2 w-2 rounded-full bg-blue-500" />
        Cached
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1.5 text-xs">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      Live
    </Badge>
  );
}
