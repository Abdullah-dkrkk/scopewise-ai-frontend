/**
 * Contract smoke test.
 *
 * Loads the real modules through Vite (so extensionless imports resolve the
 * same way they do in the app) and asserts the shapes BACKEND_REQUIREMENTS.md
 * promises survive the round trip — especially the cases that used to render
 * wrong: `critical` risk, nested Flask payloads, nested `estimation`, a missing
 * risk score, and pagination metadata.
 *
 * Run with: npm run test:contract
 */

import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});

let passed = 0;
const failures = [];

async function check(name, fn) {
  try {
    await fn();
    passed += 1;
  } catch (err) {
    failures.push({ name, message: err.message });
  }
}

const {
  mapAnalysis,
  mapPaginated,
  mapProject,
  mapRequirement,
  mapUser,
  mapStats,
} = await server.ssrLoadModule('/src/api/viewModels.js');
const {
  getClassification,
  getRiskLevel,
  normalizeClassification,
  normalizeRiskLevel,
  normalizeRequirementStatus,
} = await server.ssrLoadModule('/src/api/enums.js');
const { handleMockRequest } = await server.ssrLoadModule('/src/api/mock/router.js');

const it = (name, fn) => check(name, fn);

await it('normalizes risk levels, including critical', () => {
  assert.equal(normalizeRiskLevel('CRITICAL'), 'critical');
  assert.equal(getRiskLevel('critical').label, 'Critical Risk');
  assert.equal(getRiskLevel('nonsense').key, 'medium', 'unknown degrades safely');
});

await it('aliases classification spellings', () => {
  assert.equal(getClassification('e-commerce').key, 'e_commerce');
  assert.equal(getClassification('Non Functional').key, 'non_functional');
  assert.equal(normalizeClassification('ui-design'), 'ui_design');
  assert.equal(normalizeClassification('unheard-of'), 'general');
  assert.equal(normalizeRequirementStatus('analyzed'), 'analyzed');
});

await it('maps the nested Flask /analyze payload', () => {
  const a = mapAnalysis({
    classification: { category: 'e-commerce', confidence: 0.93 },
    complexity: { score: 4.2, level: 'high' },
    risk: {
      overall_level: 'critical',
      score: 9.1,
      factors: [{ factor: 'Third-party dependency', level: 'critical' }],
    },
    keywords: ['cart', 'checkout'],
    missing_info: ['payment gateway unspecified'],
    questions: [{ question: 'Which gateway?', priority: 'high', status: 'pending' }],
  });

  assert.equal(a.classification, 'e_commerce');
  assert.equal(a.confidence, 93, '0.93 -> 93%');
  assert.equal(a.complexityScore5, 4.2);
  assert.equal(a.complexity, 84, '4.2/5 -> 84/100');
  assert.equal(a.riskLevel, 'critical');
  assert.equal(a.risk, 91, '9.1/10 -> 91/100');
  assert.equal(a.riskFactors.length, 1);
  assert.equal(a.questions.length, 1);
  assert.deepEqual(a.missingInfo, ['payment gateway unspecified']);
});

await it('maps the flattened Laravel payload, including nested estimation', () => {
  const a = mapAnalysis({
    id: 7,
    requirement_id: 3,
    project_id: 2,
    classification: 'authentication',
    confidence: 88,
    complexity_score: 3.5,
    risk_level: 'high',
    estimation: {
      hours: 96,
      working_days: 16,
      calendar_days: 22,
      recommended_team_size: 3,
      method: 'ai_analysis',
      effort: '16 PD',
      cost: '$8,640',
      timeline: '4 weeks',
    },
    questions: [],
    created_at: '2026-01-15T10:00:00Z',
  });

  assert.equal(a.requirementId, '3', 'snake_case id is read');
  assert.equal(a.classification, 'authentication');
  assert.equal(a.complexity, 70);
  assert.equal(a.riskLevel, 'high');
  assert.equal(a.risk, 75, 'no numeric risk -> level midpoint, never 0');
  assert.equal(a.estimation.effort, '16 PD');
  assert.equal(a.estimation.cost, '$8,640');
  assert.equal(a.estimation.timeline, '4 weeks');
  assert.equal(a.estimation.recommendedTeamSize, 3);
  assert.equal(a.complexityLevel, 'high', 'level derived from score');
});

await it('survives an empty payload without inventing data', () => {
  const a = mapAnalysis({});
  assert.equal(a.classification, 'general');
  assert.equal(a.riskLevel, 'medium', 'unknown risk defaults to medium, not low');
  assert.equal(a.confidence, 0);
  assert.deepEqual(a.questions, []);
  assert.deepEqual(a.riskFactors, []);
  assert.equal(a.estimation.effort, '', 'no hours -> no fabricated estimate');
  assert.equal(a.estimation.cost, '');
  assert.equal(Number.isFinite(a.createdAt), true);
});

await it('does not unwrap a plain object that merely has a data field', () => {
  const result = mapPaginated({ data: 'just a value' }, mapProject);
  assert.deepEqual(result.items, []);
  assert.equal(result.meta, null);
});

await it('normalizes Laravel pagination metadata', () => {
  const result = mapPaginated({
    data: [{ id: 1, name: 'Alpha', created_at: '2026-01-01T00:00:00Z' }],
    meta: {
      current_page: 2, last_page: 5, per_page: 1, total: 5,
    },
  }, mapProject);

  assert.equal(result.items.length, 1);
  assert.equal(result.meta.currentPage, 2);
  assert.equal(result.meta.lastPage, 5);
  assert.equal(result.meta.total, 5);
});

await it('projects analysis summary fields onto requirement list items', () => {
  const r = mapRequirement({
    id: 9,
    content: 'test',
    status: 'analyzed',
    priority: 'HIGH',
    analysis: {
      classification: 'ui-design', complexity_score: 2.0, confidence: 70, risk_level: 'low',
    },
  });

  assert.equal(r.priority, 'high');
  assert.equal(r.status, 'analyzed');
  assert.equal(r.classification, 'ui_design');
  assert.equal(r.complexity, 40);
  assert.equal(r.riskLevel, 'low');
});

await it('maps user and stats defensively', () => {
  assert.equal(mapUser({ name: 'Ada', email: 'ada@example.com' }).role, 'user');
  assert.equal(mapUser(null).id, '');
  assert.equal(mapStats({}).projects, 0);
  assert.equal(mapStats({ analyses_this_week: '4' }).analysesThisWeek, 4);
});

await it('mock backend authenticates and paginates', () => {
  const auth = handleMockRequest({
    method: 'POST',
    url: '/auth/login',
    data: { email: 'test@scopewise.ai', password: 'password123' },
  });
  assert.ok(auth.data.user, 'login returns a user');
  assert.ok(auth.data.token, 'login returns a token');

  const projects = handleMockRequest({
    method: 'GET', url: '/projects', params: { per_page: 2, page: 1 }, token: auth.data.token,
  });
  assert.equal(projects.data.length, 2, 'per_page respected');
  assert.equal(projects.meta.current_page, 1);

  const created = handleMockRequest({
    method: 'POST',
    url: '/requirements',
    data: { content: 'Users can reset passwords by email within 5 minutes.' },
    token: auth.data.token,
  });
  assert.ok(created.data.id, 'requirement created');
  assert.equal(created.data.status, 'analyzed');

  const history = handleMockRequest({
    method: 'GET', url: '/history', params: { per_page: 10 }, token: auth.data.token,
  });
  assert.ok(history.data.length >= 1, 'history includes the new analysis');
  assert.ok(history.meta, 'history is paginated');
});

await it('mock backend rejects unauthenticated and invalid requests', () => {
  let threw = false;
  try {
    handleMockRequest({ method: 'GET', url: '/projects' });
  } catch (err) {
    threw = err.status === 401;
  }
  assert.ok(threw, 'missing token -> 401');

  threw = false;
  try {
    handleMockRequest({
      method: 'POST', url: '/requirements', data: { content: '  ' },
    });
  } catch (err) {
    threw = err.status === 401 || err.status === 422;
  }
  assert.ok(threw, 'empty content rejected');
});

await server.close();

if (failures.length > 0) {
  console.error(`\n${failures.length} failing:\n`);
  failures.forEach((f) => console.error(`  x ${f.name}\n    ${f.message}\n`));
  process.exit(1);
}

console.log(`\ncontract: ${passed} checks passed`);