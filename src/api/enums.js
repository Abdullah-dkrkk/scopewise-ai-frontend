/**
 * Canonical vocabulary shared by the whole UI.
 *
 * The backend and the ML service both emit free-form enum values that do not
 * line up with each other (`e-commerce` vs `e_commerce`, `dashboard` vs
 * `reporting`, `critical` risk that nothing handled). Every one of those is
 * aliased here to a single canonical key, and unknown keys degrade to a neutral
 * presentation instead of silently mislabelling or crashing.
 */

const TONE_CLASSES = {
  blue: 'bg-brand-blue text-white',
  violet: 'bg-violet-500 text-white',
  purple: 'bg-purple-500 text-white',
  teal: 'bg-teal-500 text-white',
  pink: 'bg-pink-500 text-white',
  orange: 'bg-brand-orange text-white',
  amber: 'bg-amber-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  red: 'bg-destructive text-white',
  slate: 'bg-slate-500 text-white',
};

/**
 * `bucket` collapses the long tail into the three coarse categories used for
 * grouping and for the legacy three-way taxonomy.
 */
const CLASSIFICATION_DEFS = {
  functional: { label: 'Functional', bucket: 'functional', tone: 'blue' },
  authentication: { label: 'Authentication', bucket: 'technical', tone: 'violet' },
  api: { label: 'API', bucket: 'technical', tone: 'violet' },
  integration: { label: 'Integration', bucket: 'technical', tone: 'violet' },
  data_model: { label: 'Data Model', bucket: 'technical', tone: 'violet' },
  security: { label: 'Security', bucket: 'technical', tone: 'red' },
  technical: { label: 'Technical', bucket: 'technical', tone: 'violet' },
  performance: { label: 'Performance', bucket: 'non-functional', tone: 'amber' },
  non_functional: { label: 'Non-Functional', bucket: 'non-functional', tone: 'purple' },
  ui_design: { label: 'UI/UX Design', bucket: 'functional', tone: 'pink' },
  reporting: { label: 'Reporting', bucket: 'functional', tone: 'teal' },
  dashboard: { label: 'Dashboard', bucket: 'functional', tone: 'teal' },
  marketing: { label: 'Marketing', bucket: 'functional', tone: 'teal' },
  e_commerce: { label: 'E-Commerce', bucket: 'functional', tone: 'orange' },
  content_management: { label: 'Content Management', bucket: 'functional', tone: 'orange' },
  general: { label: 'General', bucket: 'functional', tone: 'slate' },
};

export const CLASSIFICATION_FALLBACK = 'general';

/** Irregular spellings that survive normalisation but still need redirecting. */
const CLASSIFICATION_ALIASES = {
  nonfunctional: 'non_functional',
  non_functional_requirement: 'non_functional',
  ecommerce: 'e_commerce',
  ecom: 'e_commerce',
  ui: 'ui_design',
  ux: 'ui_design',
  uiux: 'ui_design',
  cms: 'content_management',
  content: 'content_management',
  reporting_analytics: 'reporting',
  analytics: 'reporting',
  perf: 'performance',
  scalability: 'performance',
  database: 'data_model',
  schema: 'data_model',
  rest: 'api',
  rest_api: 'api',
  third_party: 'integration',
  auth: 'authentication',
  authn: 'authentication',
  misc: 'general',
  other: 'general',
  default: 'general',
};

/** `risk_level` — `critical` was being silently rendered as "Low Risk". */
const RISK_DEFS = {
  low: {
    label: 'Low Risk', tone: 'emerald', bar: 'bg-emerald-500', text: 'text-emerald-600', score: 15,
  },
  medium: {
    label: 'Medium Risk', tone: 'amber', bar: 'bg-amber-500', text: 'text-amber-600', score: 45,
  },
  high: {
    label: 'High Risk', tone: 'orange', bar: 'bg-brand-orange', text: 'text-brand-orange', score: 75,
  },
  critical: {
    label: 'Critical Risk', tone: 'red', bar: 'bg-destructive', text: 'text-destructive', score: 95,
  },
};

export const RISK_FALLBACK = 'medium';

const PRIORITY_DEFS = {
  high: { label: 'High', variant: 'destructive' },
  medium: { label: 'Medium', variant: 'warning' },
  low: { label: 'Low', variant: 'secondary' },
  none: { label: 'None', variant: 'outline' },
};

export const PRIORITY_FALLBACK = 'medium';

const PROJECT_STATUS_DEFS = {
  active: { label: 'Active', variant: 'success' },
  review: { label: 'In review', variant: 'warning' },
  draft: { label: 'Draft', variant: 'outline' },
  on_hold: { label: 'On hold', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'secondary' },
  archived: { label: 'Archived', variant: 'outline' },
};

export const PROJECT_STATUS_FALLBACK = 'draft';

const REQUIREMENT_STATUS_DEFS = {
  draft: { label: 'Draft', variant: 'outline' },
  pending: { label: 'Pending', variant: 'secondary' },
  analyzed: { label: 'Analyzed', variant: 'brand' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

export const REQUIREMENT_STATUS_FALLBACK = 'draft';

const QUESTION_STATUS_DEFS = {
  pending: { label: 'Pending', variant: 'outline' },
  answered: { label: 'Answered', variant: 'success' },
  skipped: { label: 'Skipped', variant: 'secondary' },
};

export const QUESTION_STATUS_FALLBACK = 'pending';

/**
 * Lowercase and collapse separators so `non-functional`, `Non Functional` and
 * `non_functional` all resolve to the same key.
 */
function normalizeKey(value) {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().replace(/[\s\-/.]+/g, '_').replace(/_+/g, '_');
}

function resolve(rawValue, defs, fallback, aliases = {}) {
  const key = normalizeKey(rawValue);
  if (!key) return fallback;
  if (defs[key]) return key;
  if (aliases[key] && defs[aliases[key]]) return aliases[key];
  return fallback;
}

export function normalizeClassification(value) {
  return resolve(value, CLASSIFICATION_DEFS, CLASSIFICATION_FALLBACK, CLASSIFICATION_ALIASES);
}

export function getClassification(value) {
  const key = normalizeClassification(value);
  const def = CLASSIFICATION_DEFS[key];
  return { ...def, key };
}

export function classificationClassName(value) {
  return TONE_CLASSES[getClassification(value).tone] || TONE_CLASSES.slate;
}

export function normalizeRiskLevel(value) {
  return resolve(value, RISK_DEFS, RISK_FALLBACK);
}

export function getRiskLevel(value) {
  const key = normalizeRiskLevel(value);
  return { ...RISK_DEFS[key], key };
}

export function riskClassName(value) {
  return getRiskLevel(value).text;
}

export function riskBarClassName(value) {
  return getRiskLevel(value).bar;
}

export function normalizePriority(value) {
  return resolve(value, PRIORITY_DEFS, PRIORITY_FALLBACK, { normal: 'medium', critical: 'high' });
}

export function getPriority(value) {
  const key = normalizePriority(value);
  return { ...PRIORITY_DEFS[key], key };
}

export function normalizeProjectStatus(value) {
  return resolve(value, PROJECT_STATUS_DEFS, PROJECT_STATUS_FALLBACK, {
    in_progress: 'active',
    'in progress': 'active',
    planning: 'draft',
  });
}

export function getProjectStatus(value) {
  const key = normalizeProjectStatus(value);
  return { ...PROJECT_STATUS_DEFS[key], key };
}

export function normalizeRequirementStatus(value) {
  return resolve(value, REQUIREMENT_STATUS_DEFS, REQUIREMENT_STATUS_FALLBACK, {
    analyzed_: 'analyzed',
    complete: 'analyzed',
  });
}

export function getRequirementStatus(value) {
  const key = normalizeRequirementStatus(value);
  return { ...REQUIREMENT_STATUS_DEFS[key], key };
}

export function normalizeQuestionStatus(value) {
  return resolve(value, QUESTION_STATUS_DEFS, QUESTION_STATUS_FALLBACK, {
    complete: 'answered',
    done: 'answered',
    open: 'pending',
  });
}

export function getQuestionStatus(value) {
  const key = normalizeQuestionStatus(value);
  return { ...QUESTION_STATUS_DEFS[key], key };
}

export const ALL_CLASSIFICATIONS = Object.keys(CLASSIFICATION_DEFS);
export const ALL_RISK_LEVELS = Object.keys(RISK_DEFS);
export const ALL_PROJECT_STATUSES = Object.keys(PROJECT_STATUS_DEFS);
export const ALL_PRIORITIES = Object.keys(PRIORITY_DEFS);
