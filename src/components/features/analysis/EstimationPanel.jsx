import PropTypes from 'prop-types';
import { CalendarDays, CircleDollarSign, Clock3 } from 'lucide-react';

const PLACEHOLDER = '—';

function EstimationItem({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold tabular-nums" title={value}>
          {value || PLACEHOLDER}
        </p>
      </div>
    </div>
  );
}

EstimationItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default function EstimationPanel({
  effort, cost, timeline, confidence,
}) {
  const hasConfidence = Number.isFinite(confidence) && confidence > 0;

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Estimation</p>
        <span className="shrink-0 rounded-full bg-brand-blue-light px-2.5 py-0.5 text-xs font-medium text-brand-blue-dark">
          Confidence
          {' '}
          {hasConfidence ? `${confidence}%` : 'N/A'}
        </span>
      </div>

      {/* Fixed 3 columns squeeze on narrow phones — stack instead. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <EstimationItem icon={<Clock3 className="size-4" />} label="Effort" value={effort} />
        <EstimationItem
          icon={<CircleDollarSign className="size-4" />}
          label="Cost"
          value={cost}
        />
        <EstimationItem
          icon={<CalendarDays className="size-4" />}
          label="Timeline"
          value={timeline}
        />
      </div>
    </div>
  );
}

EstimationPanel.propTypes = {
  effort: PropTypes.string,
  cost: PropTypes.string,
  timeline: PropTypes.string,
  confidence: PropTypes.number,
};
