import PropTypes from 'prop-types';
import { TrendingDown, TrendingUp } from 'lucide-react';
import cn from '../../utils/cn';

export default function StatsCard({
  icon, label, value, change, positive = true,
}) {
  const TrendIcon = positive ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        {change !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              positive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive',
            )}
          >
            <TrendIcon className="size-3" />
            {change}
          </span>
        )}
      </div>
      <p className="font-heading text-3xl font-semibold tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

StatsCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string,
  positive: PropTypes.bool,
};
