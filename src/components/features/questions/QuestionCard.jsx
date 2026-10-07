import PropTypes from 'prop-types';
import { useState } from 'react';
import { HelpCircle, Send } from 'lucide-react';
import {
  analysisApi, getPriority, getQuestionStatus, toMessage,
} from '../../../api';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Alert from '../../ui/Alert';

const MAX_ANSWER = 2000;

export default function QuestionCard({ question, analysisId, onAnswered }) {
  const [answer, setAnswer] = useState(question.answer || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const answered = question.status === 'answered';
  const priority = getPriority(question.priority);
  const status = getQuestionStatus(question.status);

  async function handleSubmit() {
    const trimmed = answer.trim();
    if (!trimmed) {
      setError('Please enter an answer first.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      // The backend returns the recalculated analysis so confidence updates live.
      const updated = await analysisApi.answerQuestion(analysisId, question.id, trimmed);
      onAnswered(updated);
    } catch (err) {
      setError(toMessage(err, 'Could not save your answer. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <li className="rounded-lg border p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="flex min-w-0 flex-1 items-start gap-2 text-sm font-medium">
          <HelpCircle className="mt-0.5 size-4 shrink-0 text-primary" />
          <span className="min-w-0 break-words">{question.question}</span>
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          {priority.key !== 'none' && (
            <Badge variant={priority.variant} className="text-[10px]">
              {priority.label}
            </Badge>
          )}
          {answered && <Badge variant={status.variant}>{status.label}</Badge>}
        </div>
      </div>

      {answered ? (
        <p className="whitespace-pre-wrap break-words pl-6 text-sm text-muted-foreground">
          {question.answer}
        </p>
      ) : (
        <div className="pl-6">
          {error && <Alert variant="error" className="mb-2">{error}</Alert>}
          <div className="flex flex-col gap-2 sm:flex-row">
            <textarea
              rows={2}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
              }}
              maxLength={MAX_ANSWER}
              disabled={submitting}
              placeholder="Type your answer..."
              aria-label="Your answer"
              className="flex-1 resize-y rounded-lg border border-input bg-background p-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
            />
            <Button
              variant="secondary"
              size="sm"
              disabled={submitting || !answer.trim()}
              onClick={handleSubmit}
              className="shrink-0 self-start"
            >
              <Send className="size-3.5" />
              {submitting ? 'Saving...' : 'Submit'}
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}

QuestionCard.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    category: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string.isRequired,
    answer: PropTypes.string,
  }).isRequired,
  analysisId: PropTypes.string.isRequired,
  onAnswered: PropTypes.func.isRequired,
};
