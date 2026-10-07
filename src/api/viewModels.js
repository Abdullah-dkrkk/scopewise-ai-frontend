/**
 * Normalise backend payloads into the canonical view models the UI expects.
 *
 * The backend can return snake_case or camelCase, paginated or not, and its
 * enums drift from the ones the components were built for. This layer absorbs
 * that variance once, rather than scattering defensive checks across every
 * component.
 */

import {
  getRiskLevel,
  normalizeClassification,
  normalizePriority,
  normalizeProjectStatus,
  normalizeQuestionStatus,
  normalizeRequirementStatus,
  normalizeRiskLevel,
} from './enums';

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toInt(value, fallback = 0) {
  return Math.round(toNumber(value, fallback));
}

function toPercent(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  const n = toNumber(value);
  if (n > 1 && n <= 100) return Math.round(n);
  if (n >= 0 && n <= 1) return Math.round(n * 100);
  return Math.min(100, Math.max(0, Math.round(n) || fallback));
}

function clampScore5(value, fallback = 1.0) {
  const n = toNumber(value, fallback);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1.0, Math.min(5.0, n));
}

function clampRisk10(value, fallback = 0) {
  const n = toNumber(value, fallback);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(10.0, n));
}

function ensureString(value, fallback = '') {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.data)) return value.data;
  return [];
}

function unixOrDate(value) {
  if (value === null || value === undefined || value === '') return Date.now();
  if (typeof value === 'number' && Number.isFinite(value)) {
    const ms = value < 10 ** 12 ? value * 1000 : value;
    return ms;
  }
  const ts = Date.parse(value);
  return Number.isFinite(ts) ? ts : Date.now();
}

function snakeToCamel(obj) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {});
}

function pickFirst(obj, keys, fallback = null) {
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== null && obj[k] !== undefined) {
      return obj[k];
    }
  }
  return fallback;
}

export function mapProject(raw) {
  const p = snakeToCamel(raw);
  const id = ensureString(pickFirst(p, ['id', 'uuid']), '');
  const name = ensureString(pickFirst(p, ['name', 'title']), 'Untitled project');
  const description = ensureString(pickFirst(p, ['description', 'desc']), '');
  const status = normalizeProjectStatus(pickFirst(p, ['status'], 'draft'));
  const userId = ensureString(pickFirst(p, ['userId', 'user_id']), '');
  const requirementsCount = toInt(
    pickFirst(p, ['requirementsCount', 'requirements_count', 'requirementCount']),
    0,
  );
  const createdAt = unixOrDate(pickFirst(p, ['createdAt', 'created_at']));
  const updatedAt = unixOrDate(pickFirst(p, ['updatedAt', 'updated_at'], createdAt));

  return {
    id,
    name,
    description,
    status,
    userId,
    requirementsCount,
    createdAt,
    updatedAt,
  };
}

function mapRiskFactor(raw) {
  const f = snakeToCamel(raw);
  const id = ensureString(pickFirst(f, ['id'], ''));
  const factor = ensureString(pickFirst(f, ['factor', 'name', 'title']), '');
  const level = normalizeRiskLevel(pickFirst(f, ['level'], 'medium'));
  const description = ensureString(pickFirst(f, ['description'], ''));
  const mitigation = ensureString(pickFirst(f, ['mitigation', 'recommendation'], ''));

  return {
    id,
    factor,
    level,
    description,
    mitigation,
  };
}

function mapModule(raw) {
  const m = snakeToCamel(raw);
  const id = ensureString(pickFirst(m, ['id'], ''));
  const name = ensureString(pickFirst(m, ['name', 'featureType', 'feature_type']), 'Module');
  const description = ensureString(pickFirst(m, ['description'], ''));
  const complexity = clampScore5(pickFirst(m, ['complexity', 'complexityScore'], 1.0));
  const estimatedHours = toNumber(pickFirst(m, ['estimatedHours', 'estimated_hours']), 0);

  return {
    id,
    name,
    description,
    complexity,
    estimatedHours,
  };
}

function mapFeature(raw) {
  const fe = snakeToCamel(raw);
  const featureType = ensureString(
    pickFirst(fe, ['featureType', 'feature_type', 'name']),
    '',
  );
  const matchCount = toInt(pickFirst(fe, ['matchCount', 'match_count']), 0);
  const estimatedHours = toNumber(pickFirst(fe, ['estimatedHours', 'estimated_hours']), 0);
  const matches = ensureArray(pickFirst(fe, ['matches']));

  return {
    featureType,
    matchCount,
    estimatedHours,
    matches,
  };
}

export function mapQuestion(raw, index = 0) {
  const q = snakeToCamel(raw);
  const questionText = ensureString(pickFirst(q, ['question', 'text'], ''));
  const id = ensureString(
    pickFirst(q, ['id', 'questionId'], questionText ? `q-${index}-${questionText.slice(0, 8)}` : `q-${index}`),
    `q-${index}`,
  );
  const category = ensureString(pickFirst(q, ['category']), 'general');
  const priority = ensureString(pickFirst(q, ['priority'], 'medium'));
  const status = normalizeQuestionStatus(pickFirst(q, ['status'], 'pending'));
  const answer = pickFirst(q, ['answer']) || null;

  return {
    id,
    question: questionText,
    category,
    priority,
    status,
    answer,
  };
}

function buildEstimationFromAnalysis(p) {
  // The canonical contract nests these under `estimation`, but the current
  // backend flattens them onto the analysis, and the ML service returns
  // `timeline`/`modules` with no hours at all. Accept all three shapes.
  const nested = (p.estimation && typeof p.estimation === 'object') ? p.estimation : {};

  const hours = toNumber(
    pickFirst(nested, ['hours', 'estimatedHours', 'estimated_hours'])
      ?? pickFirst(p, ['estimatedHours', 'estimated_hours', 'estimationHours']),
    0,
  );

  const estimationMethod = ensureString(
    pickFirst(nested, ['method'])
      ?? pickFirst(p, ['estimationMethod', 'estimation_method']),
    'ai_analysis',
  );

  const effortExplicit = ensureString(
    pickFirst(nested, ['effort']) ?? pickFirst(p, ['estimationEffort', 'effort']),
  );
  const costExplicit = ensureString(
    pickFirst(nested, ['cost']) ?? pickFirst(p, ['estimationCost', 'cost']),
  );
  const timelineExplicit = ensureString(
    pickFirst(nested, ['timeline']) ?? pickFirst(p, ['estimationTimeline', 'timeline']),
  );

  const workingDays = toInt(
    pickFirst(nested, ['workingDays', 'working_days']),
    hours > 0 ? Math.max(1, Math.round(hours / 6)) : 0,
  );
  const calendarDays = toInt(
    pickFirst(nested, ['calendarDays', 'calendar_days']),
    workingDays > 0 ? Math.max(1, Math.round(workingDays * 1.4)) : 0,
  );

  const effort = effortExplicit || (workingDays > 0 ? `${workingDays} PD` : '');
  const timeline = timelineExplicit
    || (workingDays > 0 ? `${Math.max(1, Math.ceil(workingDays / 5))} weeks` : '');

  let cost = costExplicit;
  if (!cost && workingDays > 0) {
    const dollars = Math.round(workingDays * 540);
    cost = `$${dollars.toLocaleString('en-US')}`;
  }

  return {
    effort,
    cost: cost || '',
    timeline,
    hours,
    workingDays,
    calendarDays,
    recommendedTeamSize: toInt(
      pickFirst(nested, ['recommendedTeamSize', 'recommended_team_size']),
      0,
    ),
    method: estimationMethod,
  };
}

/**
 * The Flask `/analyze` service nests its results
 * (`classification: {category, confidence}`, `complexity: {score, level}`,
 * `risk: {overall_level, score, factors}`) while Laravel's resource returns the
 * same values flattened. Flatten both into one shape so the field extraction
 * below has a single job.
 */
function flattenMlShape(p) {
  const out = { ...p };

  const classification = p.classification ?? p.category;
  if (classification && typeof classification === 'object') {
    out.classification = pickFirst(classification, ['category', 'type', 'label']);
    const conf = pickFirst(classification, ['confidence', 'score']);
    if (conf !== null) out.confidence = conf;
  }

  const { complexity } = p;
  if (complexity && typeof complexity === 'object') {
    const score = pickFirst(complexity, ['score', 'value', 'complexityScore']);
    if (score !== null) out.complexityScore = score;
    const level = pickFirst(complexity, ['level', 'complexityLevel']);
    if (level !== null) out.complexityLevel = level;
  }

  const { risk } = p;
  if (risk && typeof risk === 'object') {
    const level = pickFirst(risk, ['overallLevel', 'level', 'riskLevel']);
    if (level !== null) out.riskLevel = level;
    const score = pickFirst(risk, ['score', 'riskScore']);
    if (score !== null) out.riskScore = score;
    const factors = pickFirst(risk, ['factors']);
    if (Array.isArray(factors)) out.riskFactors = factors;
  }

  return out;
}

export /** 0-100 complexity -> canonical level, used when the backend omits one. */
function complexityLevelFor(score) {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function mapAnalysis(raw) {
  const p = flattenMlShape(snakeToCamel(raw));

  const id = ensureString(pickFirst(p, ['id']), '');
  const requirementId = ensureString(pickFirst(p, ['requirementId']), '');
  const projectId = ensureString(pickFirst(p, ['projectId']), '');
  const projectName = ensureString(pickFirst(p, ['projectName']), '');

  const classificationKey = normalizeClassification(
    pickFirst(p, ['classification', 'category'], 'general'),
  );
  const confidence = toPercent(pickFirst(p, ['confidence']), 0);

  const complexityScoreRaw = pickFirst(p, ['complexityScore'], null);
  const complexityRaw = pickFirst(p, ['complexity'], null);

  let complexityScore5;
  if (complexityScoreRaw !== null) {
    complexityScore5 = clampScore5(complexityScoreRaw);
  } else if (complexityRaw === null) {
    complexityScore5 = 1.0;
  } else if (complexityRaw <= 5) {
    // Unlabelled `complexity` on the ML 1.0-5.0 scale.
    complexityScore5 = clampScore5(complexityRaw);
  } else {
    // Unlabelled `complexity` already on the 0-100 scale.
    complexityScore5 = clampScore5(complexityRaw / 20);
  }

  const complexity = toPercent(complexityScore5 * 20);

  // Laravel returns a level only sometimes; derive it rather than defaulting a
  // 95% complexity score to "low".
  const complexityLevelRaw = pickFirst(p, ['complexityLevel'], null);
  const complexityLevel = complexityLevelRaw
    ? normalizeRiskLevel(complexityLevelRaw)
    : complexityLevelFor(complexity);

  // No level at all must resolve to the neutral fallback rather than "low":
  // asserting low risk for an analysis that never reported one is a lie.
  const riskLevelKey = normalizeRiskLevel(pickFirst(p, ['riskLevel']));
  const riskScoreRaw = pickFirst(p, ['riskScore'], null);
  const riskRaw = pickFirst(p, ['risk'], null);

  let riskScore10;
  if (riskScoreRaw !== null) {
    riskScore10 = clampRisk10(riskScoreRaw);
  } else if (riskRaw !== null) {
    // Unlabelled `risk`: <=10 means the ML 0.0-10.0 scale, above means 0-100.
    riskScore10 = clampRisk10(riskRaw <= 10 ? riskRaw : riskRaw / 10);
  } else {
    // Neither a score nor a numeric risk: fall back to the level's midpoint so
    // a "high risk" analysis does not render a 0/100 bar.
    riskScore10 = getRiskLevel(riskLevelKey).score / 10;
  }

  const risk = toPercent(riskScore10 * 10);

  const riskFactors = ensureArray(
    pickFirst(p, ['riskFactors']),
  ).map(mapRiskFactor);

  const modules = ensureArray(
    pickFirst(p, ['modules']),
  ).map(mapModule);

  const features = ensureArray(
    pickFirst(p, ['features', 'featureList']),
  ).map(mapFeature);

  const keywords = ensureArray(pickFirst(p, ['keywords', 'featureSummary'])).map((k) => ensureString(k));
  features.forEach((f) => {
    if (f.featureType && !keywords.includes(f.featureType)) keywords.push(f.featureType);
  });

  const missingInfo = ensureArray(pickFirst(p, ['missingInfo'])).map((m) => ensureString(m));

  const questionsRaw = ensureArray(pickFirst(p, ['questions']));
  const questions = questionsRaw.map((q, i) => mapQuestion(q, i));

  const summary = ensureString(pickFirst(p, ['summary']), '');

  const createdAt = unixOrDate(pickFirst(p, ['createdAt', 'created_at']));
  const updatedAt = unixOrDate(pickFirst(p, ['updatedAt', 'updated_at'], createdAt));

  const estimation = buildEstimationFromAnalysis(p);

  return {
    id,
    requirementId,
    projectId,
    projectName,
    classification: classificationKey,
    confidence,
    complexity,
    complexityScore5,
    complexityLevel,
    risk,
    riskScore10,
    riskLevel: riskLevelKey,
    riskFactors,
    modules,
    features,
    keywords,
    missingInfo,
    questions,
    summary,
    estimation,
    milestones: ensureArray(pickFirst(p, ['milestones'])).map((m) => ({
      phase: ensureString(m.phase || m.name),
      estimatedDays: toInt(m.estimatedDays || m.estimated_days),
      description: ensureString(m.description),
    })),
    createdAt,
    updatedAt,
  };
}

export function mapRequirement(raw) {
  const r = snakeToCamel(raw);
  const id = ensureString(pickFirst(r, ['id']), '');
  const projectId = ensureString(pickFirst(r, ['projectId']), '');
  const text = ensureString(pickFirst(r, ['content', 'text', 'body']), '');
  const category = ensureString(pickFirst(r, ['category']), '');
  const priority = normalizePriority(pickFirst(r, ['priority']));
  const status = normalizeRequirementStatus(pickFirst(r, ['status']));
  const createdAt = unixOrDate(pickFirst(r, ['createdAt']));
  const updatedAt = unixOrDate(pickFirst(r, ['updatedAt']), createdAt);

  const rawAnalysis = pickFirst(r, ['analysis']);
  const hasAnalysis = rawAnalysis && typeof rawAnalysis === 'object';

  // Derive the list-view summary from the mapped analysis so the requirement
  // card and the full analysis page can never disagree about a score.
  let classification = null;
  let complexity = null;
  let confidence = null;
  let riskLevel = null;

  if (hasAnalysis) {
    const analysis = mapAnalysis(rawAnalysis);
    classification = analysis.classification;
    complexity = analysis.complexity;
    confidence = analysis.confidence;
    riskLevel = analysis.riskLevel;
  }

  return {
    id,
    projectId,
    text,
    category,
    priority,
    status,
    classification,
    complexity,
    confidence,
    riskLevel,
    analysis: hasAnalysis ? mapAnalysis(rawAnalysis) : null,
    createdAt,
    updatedAt,
  };
}

export function mapUser(raw) {
  const u = snakeToCamel(raw) || {};
  return {
    id: ensureString(pickFirst(u, ['id']), ''),
    name: ensureString(pickFirst(u, ['name']), ''),
    email: ensureString(pickFirst(u, ['email']), ''),
    role: ensureString(pickFirst(u, ['role']), 'user'),
    createdAt: unixOrDate(pickFirst(u, ['createdAt', 'created_at'])),
    updatedAt: unixOrDate(pickFirst(u, ['updatedAt', 'updated_at'])),
  };
}

export function mapAuthResponse(payload) {
  const data = snakeToCamel(payload.data || payload);
  const user = data.user ? mapUser(data.user) : null;
  const token = ensureString(pickFirst(data, ['token', 'accessToken', 'access_token']), '');
  return { user, token };
}

export function mapStats(raw) {
  const s = snakeToCamel(raw);
  return {
    projects: toInt(pickFirst(s, ['projects']), 0),
    requirements: toInt(pickFirst(s, ['requirements']), 0),
    analyses: toInt(pickFirst(s, ['analyses']), 0),
    analysesThisWeek: toInt(pickFirst(s, ['analysesThisWeek', 'analyses_this_week']), 0),
    avgConfidence: toInt(pickFirst(s, ['avgConfidence', 'avg_confidence']), 0),
    highRiskCount: toInt(
      pickFirst(s, ['highRiskCount', 'high_risk_count']),
      0,
    ),
    projectStatuses: pickFirst(s, ['projectStatuses', 'project_statuses']) || {},
  };
}

export function mapActivity(raw) {
  const a = snakeToCamel(raw);
  return {
    id: ensureString(pickFirst(a, ['id']), ''),
    text: ensureString(pickFirst(a, ['text', 'message', 'description']), ''),
    project: ensureString(pickFirst(a, ['project', 'projectName']), ''),
    type: ensureString(pickFirst(a, ['type']), 'general'),
    at: unixOrDate(pickFirst(a, ['at', 'createdAt', 'created_at'])),
  };
}

/**
 * Laravel resource envelopes look like `{success, data, message?}` and paginated
 * ones add `meta`/`links`.
 *
 * A bare object that merely *has* a `data` field is NOT unwrapped — a settings
 * endpoint returning `{data: 'x'}` or a stats endpoint with a literal `data`
 * field would otherwise silently collapse to the wrong value.
 */
function looksLikeEnvelope(payload) {
  if (!Object.prototype.hasOwnProperty.call(payload, 'data')) return false;
  if (Object.prototype.hasOwnProperty.call(payload, 'success')) return true;
  if (Object.prototype.hasOwnProperty.call(payload, 'meta')) return true;
  if (Object.prototype.hasOwnProperty.call(payload, 'links')) return true;
  // `{data: [...]}` from a controller returning a collection is always an envelope.
  return Array.isArray(payload.data);
}

export function unwrapData(payload) {
  if (payload === null || typeof payload !== 'object') return payload;
  if (looksLikeEnvelope(payload)) return payload.data;
  return payload;
}

export function unwrapList(payload) {
  if (payload === null || typeof payload !== 'object') return [];
  // Paginated: `{data: [...], meta}` -> items are inside the envelope.
  if (looksLikeEnvelope(payload)) {
    return Array.isArray(payload.data) ? payload.data : ensureArray(payload.data);
  }
  return ensureArray(payload);
}

export function extractMeta(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const p = snakeToCamel(payload);
  return p.meta || p.pagination || null;
}

/** Canonical pagination block, with Laravel field names normalised. */
export function normalizeMeta(meta) {
  if (!meta || typeof meta !== 'object') return null;
  const m = snakeToCamel(meta);

  const current = toInt(pickFirst(m, ['currentPage', 'current', 'page']), 1);
  const lastPage = toInt(pickFirst(m, ['lastPage', 'totalPages']), 1);
  const perPage = toInt(pickFirst(m, ['perPage', 'pageSize']), 15);
  const total = toInt(pickFirst(m, ['total']), 0);

  return {
    currentPage: current,
    lastPage: lastPage || 1,
    perPage,
    total,
    from: pickFirst(m, ['from'], null),
    to: pickFirst(m, ['to'], null),
    totalPages: lastPage || Math.max(1, Math.ceil(total / (perPage || 1))),
  };
}

export function mapPaginated(payload, mapper) {
  const itemsRaw = unwrapList(payload);
  const items = itemsRaw.map(mapper);
  const meta = normalizeMeta(extractMeta(payload));
  const links = (payload && typeof payload === 'object' && payload.links)
    ? snakeToCamel(payload.links)
    : null;

  return { items, meta, links };
}
