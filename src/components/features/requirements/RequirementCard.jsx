import PropTypes from 'prop-types';
import ClassificationBadge from '../analysis/ClassificationBadge';
import { getQuestionStatus } from '../../../api';
import { formatDate } from '../../../utils/format';

/**
 * Requirement text is arbitrary user input and can be extremely long, so it is
 * clamped to four lines with an expand-on-demand scroll area rather than being
 * allowed to grow the card without bound.
 */
export default function RequirementCard({ requirement }) {
  const status = getQuestionStatus(requirement.status === 'analyzed' ? 'answered' : 'pending');

  return (
    <li className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {requirement.classification
          ? <ClassificationBadge type={requirement.classification} />
          : (
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Not analysed
            </span>
          )}
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDate(requirement.createdAt)}
        </span>
        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
          {status.label}
        </span>
      </div>

      <p className="line-clamp-3 whitespace-pre-wrap break-words text-sm leading-relaxed">
        {requirement.text}
      </p>

      <details className="mt-2">
        <summary className="cursor-pointer text-xs font-medium text-primary hover:underline">
          Show full text
        </summary>
        <p className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
          {requirement.text}
        </p>
      </details>
    </li>
  );
}

RequirementCard.propTypes = {
  requirement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    classification: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.number.isRequired,
  }).isRequired,
};
