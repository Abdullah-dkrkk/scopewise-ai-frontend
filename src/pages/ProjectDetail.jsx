import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import {
  getProjectStatus, projectsApi, requirementsApi, toMessage,
} from '../api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import RequirementList from '../components/features/requirements/RequirementList';
import { formatDate } from '../utils/format';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');

    Promise.all([
      projectsApi.getProject(id),
      requirementsApi.listProjectRequirements(id, { perPage: 50 }),
    ]).then(([projectResult, requirementsResult]) => {
      if (!active) return;
      setProject(projectResult);
      setRequirements(requirementsResult.items);
    }).catch((err) => {
      if (active) setError(toMessage(err, 'Could not load this project.'));
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  const goAnalyze = useCallback(() => {
    navigate('/app/analyze', {
      state: { projectId: project.id, projectName: project.name },
    });
  }, [navigate, project]);

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>;
  }

  if (error || !project) {
    return (
      <div className="py-16 text-center">
        <Alert variant="error" title="Project unavailable">
          {error || 'This project does not exist.'}
        </Alert>
        <div className="mt-4 flex flex-col items-center gap-3">
          <Button variant="outline" size="sm" onClick={retry}>Try again</Button>
          <Link to="/app/projects" className="text-sm font-medium text-primary hover:underline">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const status = getProjectStatus(project.status);

  return (
    <div>
      <Link
        to="/app/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            <span className="text-xs text-muted-foreground">
              Created
              {formatDate(project.createdAt)}
            </span>
          </div>
          <h1 className="break-words font-heading text-2xl font-semibold tracking-tight">
            {project.name}
          </h1>
          {project.description && (
            <p className="mt-1 max-w-2xl break-words text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>
        <Button onClick={goAnalyze} className="shrink-0">
          <Plus />
          Analyze requirement
        </Button>
      </div>

      <h2 className="mb-3 flex flex-wrap items-baseline gap-2 font-heading text-lg font-semibold tracking-tight">
        Requirements
        <span className="text-sm font-normal text-muted-foreground">
          (
          {requirements.length}
          {requirements.length === 50 ? '+' : ''}
          )
        </span>
      </h2>

      <RequirementList requirements={requirements} onAnalyze={goAnalyze} />
    </div>
  );
}
