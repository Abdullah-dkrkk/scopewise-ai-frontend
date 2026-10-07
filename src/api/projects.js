import { api } from './client';
import { ROUTES } from './routes';
import { buildParams } from './params';
import { mapPaginated, mapProject } from './viewModels';

/**
 * @returns {Promise<{items: object[], meta: object|null, links: object|null}>}
 */
export async function listProjects(options = {}) {
  const {
    search, status, page, perPage, sort, direction,
  } = options;
  const params = buildParams({
    search,
    status,
    page,
    per_page: perPage,
    sort,
    direction,
  });
  const payload = await api.get(ROUTES.projects.index, params);
  return mapPaginated(payload, mapProject);
}

export async function getProject(id) {
  const payload = await api.get(ROUTES.projects.show(id));
  return mapProject(payload);
}

export async function createProject({ name, description, status }) {
  const payload = await api.post(ROUTES.projects.store, {
    name,
    description: description || null,
    status,
  });
  return mapProject(payload);
}

export async function updateProject(id, { name, description, status }) {
  const payload = await api.put(ROUTES.projects.update(id), {
    name, description, status,
  });
  return mapProject(payload);
}

export async function deleteProject(id) {
  await api.delete(ROUTES.projects.destroy(id));
}
