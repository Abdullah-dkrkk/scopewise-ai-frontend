import PropTypes from 'prop-types';
import { Gauge } from 'lucide-react';
import cn from '../../../utils/cn';
import { getRiskLevel } from '../../../api';

function scoreHint(score) {
  if (score >= 85) return 'Highly complex, plan carefully';
  if (score >= 65) return 'Moderate complexity';
  if (score >= 40) return 'Somewhat involved';
  return 'Simple, low implementation effort';
}

/** Reuse the risk colour scale so complexity and risk read consistently. */
function complexityLevelFor(score) {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export default function ComplexityScore({ score = 0, label = 'Complexity' }) {
  // Guard against undefined/NaN — an invalid width silently collapses the bar.
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const config = getRiskLevel(complexityLevelFor(safeScore));

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Gauge className={cn('size-4 shrink-0', config.text)} />
          <p className="min-w-0 truncate text-sm font-medium">{label}</p>
        </div>
        <p className="shrink-0 font-heading text-2xl font-semibold tabular-nums">{safeScore}</p>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={safeScore}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn('h-full rounded-full transition-all', config.bar)}
          style={{ width: `${safeScore}%` }}
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{scoreHint(safeScore)}</p>
    </div>
  );
}

ComplexityScore.propTypes = {
  score: PropTypes.number,
  label: PropTypes.string,
};
