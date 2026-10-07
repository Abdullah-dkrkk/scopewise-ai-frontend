import PropTypes from 'prop-types';
import {
  AlertTriangle, CircleCheck, ShieldAlert, Siren,
} from 'lucide-react';
import cn from '../../../utils/cn';
import { getRiskLevel } from '../../../api';

const ICONS = {
  low: CircleCheck,
  medium: AlertTriangle,
  high: ShieldAlert,
  critical: Siren,
};

/**
 * `critical` was previously unhandled and fell through to "Low Risk" with a
 * green bar — the most dangerous possible rendering bug in this app.
 */
export default function RiskAssessment({
  level = 'medium', score = 0, details,
}) {
  const config = getRiskLevel(level);
  const Icon = ICONS[config.key] || AlertTriangle;
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className={cn('size-4 shrink-0', config.text)} />
          <p className="min-w-0 truncate text-sm font-medium">{config.label}</p>
        </div>
        <p className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
          {safeScore}
          /100
        </p>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={safeScore}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Risk score"
      >
        <div
          className={cn('h-full rounded-full transition-all', config.bar)}
          style={{ width: `${safeScore}%` }}
        />
      </div>

      {details && (
        <p className="mt-3 break-words text-xs text-muted-foreground">{details}</p>
      )}
    </div>
  );
}

RiskAssessment.propTypes = {
  level: PropTypes.oneOf(['low', 'medium', 'high', 'critical']),
  score: PropTypes.number,
  details: PropTypes.string,
};
