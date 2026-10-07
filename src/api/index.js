/**
 * The application's entire backend surface.
 *
 * Components and hooks must not import `axios`, build URLs, or index into
 * response envelopes themselves — everything goes through here so the contract
 * in BACKEND_REQUIREMENTS.md has exactly one implementation.
 */

export { api, setUnauthorizedHandler } from './client';
export {
  ApiError, ErrorKind, normalizeError, toMessage,
} from './errors';

export * as authApi from './auth';
export * as projectsApi from './projects';
export * as requirementsApi from './requirements';
export * as analysisApi from './analysis';
export * as dashboardApi from './dashboard';

export {
  classificationClassName,
  getClassification,
  getPriority,
  getProjectStatus,
  getQuestionStatus,
  getRequirementStatus,
  getRiskLevel,
  normalizeClassification,
  normalizePriority,
  normalizeProjectStatus,
  normalizeQuestionStatus,
  normalizeRequirementStatus,
  normalizeRiskLevel,
  riskBarClassName,
  riskClassName,
  ALL_CLASSIFICATIONS,
  ALL_RISK_LEVELS,
  ALL_PROJECT_STATUSES,
  ALL_PRIORITIES,
} from './enums';

export {
  mapActivity,
  mapAnalysis,
  mapProject,
  mapQuestion,
  mapRequirement,
  mapStats,
  mapUser,
  unwrapData,
  unwrapList,
} from './viewModels';

export { ROUTES } from './routes';
