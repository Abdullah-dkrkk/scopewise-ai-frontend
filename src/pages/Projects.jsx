import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FolderKanban, Plus, Search } from 'lucide-react';
import { getProjectStatus, projectsApi, toMessage } from '../api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, {
  CardContent, CardDescription, CardTitle,
} from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';
import { formatDate } from '../utils/format';

function EmptyProjects({ search, onCreate }) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <CardTitle className="mb-1">No projects found</CardTitle>
        <CardDescription className="mx-auto max-w-sm break-words">
          {search
            ? 'Try a different search term.'
            : 'Create your first project to start capturing requirements.'}
        </CardDescription>
        {!search && (
          <Button className="mt-4" onClick={onCreate}>
            <Plus />
            New Project
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

EmptyProjects.propTypes = {
  search: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
};

function ProjectCard({
  project, onDelete, deleting = false,
}) {
  const status = getProjectStatus(project.status);

  return (
    <Link
      to={`/app/projects/${project.id}`}
      className="group block h-full rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <FolderKanban className="size-5" />
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <h3 className="break-words font-heading font-semibold tracking-tight group-hover:text-primary">
        {project.name}
      </h3>
      <p className="mt-1 line-clamp-2 break-words text-sm text-muted-foreground">
        {project.description || 'No description'}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="min-w-0 truncate">
          {project.requirementsCount > 0
            ? `${project.requirementsCount} requirement${project.requirementsCount === 1 ? '' : 's'}`
            : formatDate(project.createdAt)}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(project);
          }}
          disabled={deleting}
          className="shrink-0 rounded px-2 py-1 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Link>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    requirementsCount: PropTypes.number,
    createdAt: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  deleting: PropTypes.bool,
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [formError, setFormError] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  const fetchProjects = useCallback(async (term = '', pageNum = 1) => {
    setLoading(true);
    try {
      const result = await projectsApi.listProjects({
        search: term || undefined,
        page: pageNum,
        perPage: 20,
      });
      setProjects(result.items);
      setMeta(result.meta);
      setError('');
    } catch (err) {
      setError(toMessage(err, 'Could not load projects.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProjects(search, 1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchProjects]);

  async function handleCreate(event) {
    event.preventDefault();
    setFormError('');

    if (!form.name.trim()) {
      setFormError('Project name is required.');
      return;
    }
    if (form.name.trim().length > 120) {
      setFormError('Project name must be 120 characters or fewer.');
      return;
    }

    setCreating(true);
    try {
      await projectsApi.createProject({
        name: form.name.trim(),
        description: form.description.trim(),
      });
      setModalOpen(false);
      setForm({ name: '', description: '' });
      setPage(1);
      await fetchProjects(search, 1);
    } catch (err) {
      setFormError(toMessage(err, 'Could not create project.'));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(project) {
    // eslint-disable-next-line no-alert -- native confirm keeps this dependency-free
    const confirmed = window.confirm(
      `Delete "${project.name}"? Its requirements and analyses will be removed too. This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(project.id);
    try {
      await projectsApi.deleteProject(project.id);
      if (projects.length === 1 && page > 1) {
        const next = page - 1;
        setPage(next);
        await fetchProjects(search, next);
      } else {
        await fetchProjects(search, page);
      }
    } catch (err) {
      setError(toMessage(err, 'Could not delete the project.'));
    } finally {
      setDeletingId('');
    }
  }

  const totalPages = meta?.last_page || 1;
  const total = meta?.total || 0;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize requirements by project scope.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="shrink-0">
          <Plus />
          New Project
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search projects"
        />
      </div>

      {error && <Alert variant="error" title="Load failed">{error}</Alert>}

      {loading && (
        <div className="flex justify-center py-16"><Spinner /></div>
      )}

      {!loading && projects.length === 0 && (
        <EmptyProjects search={search} onCreate={() => setModalOpen(true)} />
      )}

      {!loading && projects.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                deleting={deletingId === project.id}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-xs text-muted-foreground">
                Page
                {' '}
                {meta?.currentPage || page}
                {' of '}
                {totalPages}
                {' · '}
                {total}
                {' total'}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => {
                    const next = page - 1;
                    setPage(next);
                    fetchProjects(search, next);
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => {
                    const next = page + 1;
                    setPage(next);
                    fetchProjects(search, next);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => !creating && setModalOpen(false)}
        title="Create a project"
        description="Projects group related requirements for scoping."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && <Alert variant="error">{formError}</Alert>}
          <div>
            <label htmlFor="project-name" className="mb-1.5 block text-sm font-medium">Name</label>
            <Input
              id="project-name"
              placeholder="e.g. Customer Portal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={120}
              disabled={creating}
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="project-desc" className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="project-desc"
              rows={3}
              placeholder="Short summary of this project's scope"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              maxLength={2000}
              disabled={creating}
              className="w-full resize-y rounded-lg border border-input bg-background p-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
