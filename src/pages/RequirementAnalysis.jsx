import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Sparkles } from 'lucide-react';
import { projectsApi, requirementsApi } from '../api';
import Card, {
  CardContent, CardDescription, CardHeader, CardTitle,
} from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import RequirementInput from '../components/features/requirements/RequirementInput';

const EXAMPLES = [
  'Users should be able to reset their password via email within 5 minutes and the reset link must expire after 30 minutes.',
  'The system must support up to 10,000 concurrent users with a 99.9% uptime and encrypt all stored data at rest.',
  'A reporting module that integrates with the accounting API, generates monthly invoices, and queues email notifications.',
];

function ExampleButton({
  text, onPick, disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      className="rounded-lg border border-dashed p-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-foreground disabled:opacity-50"
    >
      {text}
    </button>
  );
}

ExampleButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default function RequirementAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state && typeof location.state === 'object') ? location.state : {};
  const initialProjectId = state.projectId || '';
  const initialText = state.requirementText || '';

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let active = true;

    projectsApi
      .listProjects({ perPage: 100, sort: 'created_at', direction: 'desc' })
      .then((result) => {
        if (active) setProjects(result.items);
      })
      .catch(() => {
        // The project picker is optional — analysis still works without it.
        if (active) setProjects([]);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleAnalyze(projectId, text) {
    const result = await requirementsApi.analyzeRequirement({ projectId, text });

    if (!result.analysisId) {
      throw new Error(
        'The analysis finished but returned no analysis id, so there is nothing to show. '
        + 'Try re-running it from the project page.',
      );
    }

    navigate(`/app/analysis/${result.analysisId}`, {
      state: { requirementText: text },
    });
  }

  function handleExample(text) {
    const textarea = document.getElementById('requirement-text');
    if (!textarea) return;

    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value',
    ).set;
    nativeSetter.call(textarea, text);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">New Analysis</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe a requirement in plain language and ScopeWise will classify it,
          assess risk, and estimate effort.
        </p>
      </div>

      {projects.length === 0 && (
        <Alert variant="info" className="mb-4">
          No projects yet. Create one first — every analysis is filed under a
          project so history and dashboards stay organised.
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Requirement description</CardTitle>
          <CardDescription>Be specific about behavior, constraints, and users.</CardDescription>
        </CardHeader>
        <CardContent>
          <RequirementInput
            projects={projects}
            onSubmit={handleAnalyze}
            initialProjectId={initialProjectId}
            initialText={initialText}
          />
        </CardContent>
      </Card>

      <div className="mt-6">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Sparkles className="size-3.5" />
          Try an example
        </p>
        <div className="grid gap-3">
          {EXAMPLES.map((example) => (
            <ExampleButton
              key={example}
              text={example}
              onPick={() => handleExample(example)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
