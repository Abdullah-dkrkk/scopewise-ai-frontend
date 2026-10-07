import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ArrowUpRight } from 'lucide-react';
import Card, {
  CardContent, CardDescription, CardHeader, CardTitle,
} from '../ui/Card';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import { truncate } from '../../utils/format';

function ProjectsBody({ projects, loading }) {
  if (loading) {
    return <div className="flex justify-center py-8"><Spinner /></div>;
  }
  if (projects.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">No projects yet.</p>
        <Link
          to="/app/projects"
          className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
        >
          Create your first project
        </Link>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {projects.slice(0, 4).map((project) => (
        <li key={project.id}>
          <Link
            to={`/app/projects/${project.id}`}
            className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{project.name}</p>
              <p className="truncate text-xs text-muted-foreground">{truncate(project.description, 60)}</p>
            </div>
            <Badge variant="outline">{project.status}</Badge>
          </Link>
        </li>
      ))}
    </ul>
  );
}

ProjectsBody.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default function RecentProjects({ projects, loading }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Projects</CardTitle>
          <Link
            to="/app/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <CardDescription>Your active scopes.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectsBody projects={projects} loading={loading} />
      </CardContent>
    </Card>
  );
}

RecentProjects.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
};
