import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  BrainCircuit, FileText, FolderKanban, ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi, projectsApi, toMessage } from '../api';
import StatsCard from '../components/dashboard/StatsCard';
import RecentProjects from '../components/dashboard/RecentProjects';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const EMPTY_STATS = {
  projects: 0,
  requirements: 0,
  analysesThisWeek: 0,
  highRiskCount: 0,
  avgConfidence: 0,
};

function PageHeader() {
  const { user } = useAuth();
  const firstName = (user?.name || '').trim().split(/\s+/)[0];

  return (
    <div className="mb-8">
      <p className="text-sm font-medium text-primary">Welcome back</p>
      <h1 className="break-words font-heading text-2xl font-semibold tracking-tight md:text-3xl">
        {firstName ? `${firstName}, here's your scope at a glance` : "Here's your scope at a glance"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Track projects, requirements, and confidence levels across your analysis.
      </p>
    </div>
  );
}

function StatCards({ loading, stats }) {
  if (loading) {
    return (
      <div className="col-span-full flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const highRiskLabel = stats.highRiskCount === 0 ? 'clear' : 'review';

  return (
    <>
      <StatsCard
        icon={<FolderKanban className="size-5" />}
        label="Projects"
        value={String(stats.projects)}
      />
      <StatsCard
        icon={<FileText className="size-5" />}
        label="Requirements analyzed"
        value={String(stats.requirements)}
        change={`+${stats.analysesThisWeek} this week`}
      />
      <StatsCard
        icon={<ShieldCheck className="size-5" />}
        label="High-risk scopes flagged"
        value={String(stats.highRiskCount)}
        positive={stats.highRiskCount === 0}
        change={highRiskLabel}
      />
      <StatsCard
        icon={<BrainCircuit className="size-5" />}
        label="Avg. confidence"
        value={stats.avgConfidence > 0 ? `${stats.avgConfidence}%` : 'N/A'}
      />
    </>
  );
}

StatCards.propTypes = {
  loading: PropTypes.bool.isRequired,
  stats: PropTypes.shape({
    projects: PropTypes.number,
    requirements: PropTypes.number,
    analysesThisWeek: PropTypes.number,
    highRiskCount: PropTypes.number,
    avgConfidence: PropTypes.number,
  }).isRequired,
};

export default function Dashboard() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [projects, setProjects] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    setLoading(true);
    setError('');

    // Each panel degrades independently — one failing endpoint must not blank
    // the whole dashboard.
    Promise.allSettled([
      dashboardApi.getDashboardStats(),
      projectsApi.listProjects({ perPage: 4 }),
      dashboardApi.getActivity(),
    ]).then(([statsResult, projectsResult, activityResult]) => {
      if (!active) return;

      if (statsResult.status === 'fulfilled') setStats(statsResult.value);
      if (projectsResult.status === 'fulfilled') setProjects(projectsResult.value.items);
      if (activityResult.status === 'fulfilled') setActivity(activityResult.value);

      const failures = [statsResult, projectsResult, activityResult]
        .filter((r) => r.status === 'rejected');
      if (failures.length === 3) {
        setError(toMessage(failures[0].reason, 'Could not load your dashboard.'));
      }
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return (
    <div>
      <PageHeader />

      {error && (
        <div className="mb-6">
          <Alert variant="error" title="Something went wrong">{error}</Alert>
          <Button variant="outline" size="sm" className="mt-3" onClick={retry}>
            Try again
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCards loading={loading} stats={stats} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentProjects projects={projects} loading={loading} />
        <ActivityFeed activity={activity} loading={loading} />
      </div>
    </div>
  );
}
