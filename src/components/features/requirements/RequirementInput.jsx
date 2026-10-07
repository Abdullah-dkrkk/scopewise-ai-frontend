import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Wand2 } from 'lucide-react';
import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import Alert from '../../ui/Alert';
import { toMessage } from '../../../api';

const MAX_CHARS = 20000;
const MIN_WORDS = 3;

export default function RequirementInput({
  projects = [], onSubmit, initialProjectId = '', initialText = '',
}) {
  const [text, setText] = useState(initialText);
  // A requirement always belongs to a project, so fall back to the first one
  // rather than offering a "no project" option the API would reject.
  const [projectId, setProjectId] = useState(
    initialProjectId || (projects[0] ? projects[0].id : ''),
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  // The project list arrives after first render, so adopt a valid selection
  // once it is there instead of holding an id the select cannot render.
  useEffect(() => {
    if (projects.length === 0) return;
    const stillValid = projects.some((project) => project.id === projectId);
    if (!stillValid) setProjectId(projects[0].id);
  }, [projects, projectId]);

  const hasProject = Boolean(projectId);
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
    if (!hasProject) {
      setError('Create a project first — every analysis is tracked inside one.');
      return;
    }

    setAnalyzing(true);
    try {
      await onSubmit(projectId, text.trim());
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

      {projects.length > 0 ? (
        <div>
          <label htmlFor="project-select" className="mb-1.5 block text-sm font-medium">
            Project
          </label>
          <select
            id="project-select"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={analyzing}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
      ) : (
        <Alert variant="info">
          Every analysis belongs to a project. Create one first, then come back
          to analyse this requirement.
        </Alert>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={analyzing || !text.trim() || !hasProject}
      >
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
