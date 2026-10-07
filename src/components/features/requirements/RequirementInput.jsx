import { useState } from 'react';
import PropTypes from 'prop-types';
import { Wand2 } from 'lucide-react';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import Alert from '../../ui/Alert';
import { toMessage } from '../../../api';

const MAX_CHARS = 20000;
const MIN_WORDS = 3;

export default function RequirementInput({
  projects, onSubmit, initialProjectId = '', initialText = '',
}) {
  const [text, setText] = useState(initialText);
  const [projectId, setProjectId] = useState(initialProjectId);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Please describe the requirement before analyzing.');
      return;
    }
    if (wordCount < MIN_WORDS) {
      setError(`Please add a bit more detail — at least ${MIN_WORDS} words helps the analysis.`);
      return;
    }

    setAnalyzing(true);
    try {
      await onSubmit(projectId || null, text.trim());
    } catch (err) {
      setError(toMessage(err, 'Analysis failed. Please try again.'));
      setAnalyzing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert variant="error" title="Analysis failed">{error}</Alert>}

      <div>
        <label htmlFor="requirement-text" className="mb-1.5 block text-sm font-medium">
          Requirement text
        </label>
        <textarea
          id="requirement-text"
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={analyzing}
          maxLength={MAX_CHARS}
          placeholder="e.g. Customers can download monthly invoices as PDFs and share them with their accountant..."
          className="w-full resize-y rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
        />
        <div className="mt-1.5 flex items-center justify-between gap-2 text-xs">
          <span className="text-muted-foreground">
            The more specific the behaviour, constraints and users, the better the estimate.
          </span>
          <span
            className={`shrink-0 tabular-nums ${
              text.length > MAX_CHARS * 0.9 ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            {wordCount}
            {' words · '}
            {text.length}
            /
            {MAX_CHARS}
          </span>
        </div>
      </div>

      {projects && projects.length > 0 && (
        <div>
          <label htmlFor="project-select" className="mb-1.5 block text-sm font-medium">
            Project
            {' '}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <select
            id="project-select"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={analyzing}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={analyzing || !text.trim()}>
        {analyzing ? (
          <>
            <Spinner size="sm" className="text-primary-foreground" />
            Analyzing...
          </>
        ) : (
          <>
            <Wand2 />
            Analyze requirement
          </>
        )}
      </Button>
    </form>
  );
}

RequirementInput.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  onSubmit: PropTypes.func.isRequired,
  initialProjectId: PropTypes.string,
  initialText: PropTypes.string,
};
