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
 * Analysis runs on a queue, not inside the create request: `POST /requirements`
 * answers 201 with `analysis: null` and the worker fills it in afterwards
 * (BACKEND_REQUIREMENTS.md 9). The UI still wants to land on the results page
 * in one click, so we poll the requirement until the analysis row exists.
 */
const ANALYSIS_POLL_INTERVAL_MS = 1000;

const ANALYSIS_POLL_TIMEOUT_MS = 60000;

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

/**
 * Poll a freshly created requirement until its analysis is ready.
 *
 * Written recursively rather than as a loop so each attempt is a fresh read —
 * a `while` holding a stale snapshot could report "still pending" forever.
 *
 * @param {string} requirementId
 * @param {number} deadline epoch ms after which we stop waiting
 * @returns {Promise<object>} the requirement, with `analysis` populated
 */
async function pollForAnalysis(requirementId, deadline) {
  const requirement = await getRequirement(requirementId);

  if (requirement.analysis) return requirement;

  if (Date.now() >= deadline) {
    throw new Error(
      'The analysis is taking longer than expected. '
      + 'Check that the queue worker is running (`php artisan queue:work`) '
      + 'and try again.',
    );
  }

  await sleep(ANALYSIS_POLL_INTERVAL_MS);
  return pollForAnalysis(requirementId, deadline);
}

/**
 * Wait for a queued analysis to finish.
 *
 * @param {string} requirementId
 * @returns {Promise<object>} the requirement, with `analysis` populated
 */
export async function waitForAnalysis(requirementId) {
  return pollForAnalysis(requirementId, Date.now() + ANALYSIS_POLL_TIMEOUT_MS);
}

/**
 * Create a requirement and run analysis in one call.
 *
 * The backend queues the analysis, so this resolves once the result is
 * actually available rather than returning an empty shell the results page
 * cannot render. Older/alternate shapes that return a `{requirement, analysis}`
 * pair are also handled.
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
  const created = isPair ? data.requirement : data;

  const requirement = mapRequirement(created);
  const pairedAnalysis = isPair ? data.analysis : null;

  // A synchronous backend hands the analysis straight back; the queued one
  // needs a moment before the row exists.
  const settled = (requirement.analysis || pairedAnalysis)
    ? requirement
    : await waitForAnalysis(requirement.id);

  const analysis = settled.analysis || pairedAnalysis || null;

  return {
    requirement: settled,
    analysis,
    analysisId: (analysis && analysis.id) || null,
  };
}
