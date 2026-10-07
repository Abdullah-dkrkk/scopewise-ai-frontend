import { api } from './client';
import { ROUTES } from './routes';
import { buildParams } from './params';
import { mapPaginated, mapRequirement, unwrapData } from './viewModels';

/**
 * @returns {Promise<{items: object[], meta: object|null, links: object|null}>}
 */
export async function listProjectRequirements(projectId, options = {}) {
  const {
    page, perPage, status, search,
  } = options;
  const params = buildParams({
    page, per_page: perPage, status, search,
  });
  const payload = await api.get(ROUTES.projects.requirements(projectId), params);
  return mapPaginated(payload, mapRequirement);
}

export async function getRequirement(id) {
  const payload = await api.get(ROUTES.requirements.show(id));
  return mapRequirement(payload);
}

export async function createRequirement({
  projectId, content, category, priority,
}) {
  const payload = await api.post(ROUTES.requirements.store, {
    project_id: projectId || null,
    content,
    category: category || null,
    priority: priority || 'medium',
  });
  return mapRequirement(payload);
}

export async function updateRequirement(id, { content, category, priority }) {
  const payload = await api.put(ROUTES.requirements.update(id), {
    content, category, priority,
  });
  return mapRequirement(payload);
}

export async function deleteRequirement(id) {
  await api.delete(ROUTES.requirements.destroy(id));
}

/**
 * Create a requirement and run analysis in one call.
 *
 * The backend is expected to return the requirement with its analysis nested
 * (BACKEND_REQUIREMENTS.md §6.1). Older/alternate shapes that return a
 * `{requirement, analysis}` pair are also handled.
 *
 * @returns {Promise<{requirement: object, analysis: object|null, analysisId: string|null}>}
 */
export async function analyzeRequirement({ projectId, text, priority }) {
  const payload = await api.post(ROUTES.requirements.store, {
    project_id: projectId || null,
    content: text,
    priority: priority || 'medium',
  });

  const data = unwrapData(payload);
  const isPair = data && typeof data === 'object' && data.requirement;
  const requirement = mapRequirement(isPair ? data.requirement : data);
  const analysis = isPair ? data.analysis : requirement.analysis;

  return {
    requirement,
    analysis: analysis || null,
    analysisId: (analysis && analysis.id) || null,
  };
}
