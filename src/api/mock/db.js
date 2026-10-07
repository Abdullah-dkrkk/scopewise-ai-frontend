const STORAGE_KEY = 'sw_mock_db_v1';

function classificationFor(text) {
  const t = text.toLowerCase();
  if (/(performance|security|scalab|responsiv|uptime|latency|accessib|reliab|confidential|complian)/.test(t)) {
    return 'non-functional';
  }
  if (/(api|integration|database|migration|cache|queue|oauth|sso|webhook|service|third-party)/.test(t)) {
    return 'technical';
  }
  return 'functional';
}

function questionsFor(classification) {
  const generic = [
    'Who are the primary end users of this feature?',
    'What are the acceptance criteria that define success?',
    'Are there any budget or timeline constraints?',
  ];
  const byType = {
    functional: [
      'What should happen when an input is invalid or missing?',
      'Which user roles should have access to this action?',
      'Should this behavior be auditable or logged?',
    ],
    technical: [
      'Which existing systems or third-party services need to integrate?',
      'Is there a preferred tech stack or platform constraint?',
      'What are the data migration and rollout requirements?',
    ],
    'non-functional': [
      'What are the target response times and supported concurrency?',
      'Which security and compliance standards must be met?',
      'What uptime and availability guarantees are expected?',
    ],
  };
  return [...new Set([...generic, ...byType[classification]])].slice(0, 4).map((question, i) => ({
    id: `q-${Date.now()}-${i}`,
    question,
    intent: 'clarification',
    status: 'pending',
  }));
}

function estimateFrom(text, complexity) {
  const wordCount = text.split(/\s+/).length;
  const effortDays = Math.max(3, Math.round(complexity * 0.7 + wordCount * 0.02));
  const cost = effortDays * 540;
  const timelineWeeks = Math.max(1, Math.ceil(effortDays / 5));
  return { effort: `${effortDays} PD`, cost: `$${cost.toLocaleString()}`, timeline: `${timelineWeeks} weeks` };
}

function riskLevelFor(risk) {
  if (risk < 40) return 'low';
  if (risk < 70) return 'medium';
  return 'high';
}

function analyzeText(text) {
  const classification = classificationFor(text);
  const wordCount = text.split(/\s+/).length;
  const complexity = Math.min(98, 25 + wordCount * 1.4 + (classification === 'technical' ? 12 : 0));
  const risk = Math.min(95, 15 + wordCount * 1.1 + (classification === 'non-functional' ? 10 : 0));
  const confidence = Math.round(78 + Math.random() * 18);
  return {
    classification,
    confidence,
    complexity: Math.round(complexity),
    risk: Math.round(risk),
    riskLevel: riskLevelFor(risk),
    keywords: text.match(/\b[a-z]{5,}\b/gi)?.slice(0, 6) || [],
    missingInfo: [
      'Performance requirements are not specified',
      'No acceptance criteria defined',
      'Target user base is unclear',
    ].slice(0, Math.round(1 + Math.random() * 2)),
    estimation: estimateFrom(text, complexity),
    questions: questionsFor(classification),
  };
}

function seed() {
  const now = Date.now();
  return {
    users: [
      {
        id: 'u1',
        name: 'Demo User',
        email: 'test@scopewise.ai',
        password: 'password123',
        role: 'admin',
        createdAt: now - 86400000 * 30,
      },
    ],
    projects: [
      {
        id: 'p1',
        userId: 'u1',
        name: 'Customer Portal',
        description: 'Self-service portal for customers to view invoices and submit support tickets.',
        status: 'active',
        createdAt: now - 86400000 * 12,
      },
      {
        id: 'p2',
        userId: 'u1',
        name: 'Mobile App MVP',
        description: 'Cross-platform mobile app with push notifications and offline mode.',
        status: 'review',
        createdAt: now - 86400000 * 5,
      },
      {
        id: 'p3',
        userId: 'u1',
        name: 'Legacy Migration',
        description: 'Migrate legacy CRM data into the new platform with minimal downtime.',
        status: 'draft',
        createdAt: now - 86400000 * 2,
      },
    ],
    requirements: [],
    analyses: [],
    sessions: {},
    activity: [
      {
        id: 'a1', text: 'New requirement analyzed', project: 'Customer Portal', at: now - 3600000 * 2,
      },
      {
        id: 'a2', text: 'Project "Mobile App MVP" created', project: 'Mobile App MVP', at: now - 86400000,
      },
      {
        id: 'a3', text: 'Estimation updated after Q&A', project: 'Customer Portal', at: now - 86400000 * 2,
      },
    ],
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    return seed();
  }
  return seed();
}

const db = load();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    // storage unavailable; keep in-memory state
  }
}

export function resetDb() {
  const fresh = seed();
  Object.keys(fresh).forEach((key) => {
    db[key] = fresh[key];
  });
  save();
}

export function findUserByEmail(email) {
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserByToken(token) {
  const userId = db.sessions[token];
  if (!userId) return null;
  return db.users.find((u) => u.id === userId) || null;
}

export function createSession(user) {
  const token = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  db.sessions[token] = user.id;
  save();
  return token;
}

export function destroySession(token) {
  delete db.sessions[token];
  save();
}

export function updateUser(userId, patch) {
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;
  if (patch.name) user.name = patch.name;
  if (patch.email) user.email = patch.email;
  if (patch.password) user.password = patch.password;
  save();
  return user;
}

export function resetPassword(email) {
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return false;
  user.password = 'reset123';
  save();
  return true;
}

export function addUser({ name, email, password }) {
  const user = {
    id: `u-${Date.now()}`,
    name,
    email,
    password,
    role: 'user',
    createdAt: Date.now(),
  };
  db.users.push(user);
  save();
  return user;
}

export function listProjects(search, status) {
  const q = (search || '').toLowerCase();
  let { projects } = db;
  if (q) {
    projects = projects.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q),
    );
  }
  if (status) {
    projects = projects.filter((p) => p.status === status);
  }
  return [...projects].sort((a, b) => b.createdAt - a.createdAt);
}

export function getProject(id) {
  return db.projects.find((p) => p.id === id) || null;
}

export function createProject({
  name, description, status, userId = 'u1',
}) {
  const project = {
    id: `p-${Date.now()}`,
    userId,
    name,
    description,
    status: status || 'draft',
    createdAt: Date.now(),
  };
  db.projects.unshift(project);
  save();
  return project;
}

export function updateProject(id, patch) {
  const project = getProject(id);
  if (!project) return null;
  Object.assign(project, patch);
  save();
  return project;
}

export function deleteProject(id) {
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return false;
  db.projects.splice(index, 1);
  save();
  return true;
}

export function analyzeRequirement(projectId, text) {
  const results = analyzeText(text);
  const requirementId = `r-${Date.now()}`;
  const analysisId = `an-${Date.now()}`;
  const createdAt = Date.now();

  db.requirements.push({
    id: requirementId,
    projectId,
    text,
    createdAt,
  });
  db.analyses.push({
    id: analysisId,
    requirementId,
    projectId,
    status: 'completed',
    ...results,
    createdAt,
  });

  const project = projectId ? db.projects.find((p) => p.id === projectId) : null;
  db.activity.unshift({
    id: `act-${Date.now()}`,
    text: 'New requirement analyzed',
    project: project ? project.name : '',
    at: createdAt,
  });
  save();

  return {
    requirement: {
      id: requirementId, projectId, text, createdAt,
    },
    analysis: {
      id: analysisId,
      requirementId,
      projectId,
      status: 'completed',
      ...results,
      createdAt,
    },
  };
}

export function getRequirement(id) {
  const requirement = db.requirements.find((r) => r.id === id);
  if (!requirement) return null;
  const analysis = db.analyses.find((a) => a.requirementId === id) || null;
  return { ...requirement, analysis };
}

export function updateRequirement(id, patch) {
  const requirement = db.requirements.find((r) => r.id === id);
  if (!requirement) return null;
  if (patch.content) requirement.text = patch.content;
  save();
  return getRequirement(id);
}

export function deleteRequirement(id) {
  const index = db.requirements.findIndex((r) => r.id === id);
  if (index === -1) return false;
  db.requirements.splice(index, 1);
  db.analyses = db.analyses.filter((a) => a.requirementId !== id);
  save();
  return true;
}

export function listRequirements(projectId) {
  return db.requirements
    .filter((r) => r.projectId === projectId)
    .map((req) => {
      const analysis = db.analyses.find((a) => a.requirementId === req.id) || null;
      return {
        ...req,
        analysis,
        classification: analysis ? analysis.classification : null,
        complexity: analysis ? analysis.complexity : null,
        confidence: analysis ? analysis.confidence : null,
      };
    });
}

export function getAnalysis(id) {
  return db.analyses.find((a) => a.id === id) || null;
}

export function answerQuestion(analysisId, questionId, answer) {
  const analysis = getAnalysis(analysisId);
  if (!analysis) return null;
  const question = analysis.questions.find((q) => q.id === questionId);
  if (!question) return null;
  question.status = 'answered';
  question.answer = answer;
  const answered = analysis.questions.filter((q) => q.status === 'answered').length;
  const lift = Math.round((answered / analysis.questions.length) * 8);
  analysis.confidence = Math.min(99, analysis.confidence + lift);
  save();
  return analysis;
}

export function listHistory() {
  return [...db.analyses]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((a) => {
      const project = a.projectId ? db.projects.find((p) => p.id === a.projectId) : null;
      return {
        id: a.id,
        requirementId: a.requirementId,
        projectId: a.projectId,
        projectName: project ? project.name : null,
        classification: a.classification,
        confidence: a.confidence,
        complexity: a.complexity,
        risk: a.risk,
        riskLevel: a.riskLevel,
        estimation: a.estimation,
        createdAt: a.createdAt,
      };
    });
}

export function listActivity() {
  return db.activity;
}

export function getDashboardStats() {
  const now = Date.now();
  const recentThreshold = now - 86400000 * 7;
  const recentAnalyses = db.analyses.filter((a) => a.createdAt >= recentThreshold);
  const avgConfidence = db.analyses.length
    ? Math.round(db.analyses.reduce((sum, a) => sum + a.confidence, 0) / db.analyses.length)
    : 0;
  const highRiskCount = db.analyses.filter((a) => a.risk >= 70).length;
  const projectStatuses = db.projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  return {
    projects: db.projects.length,
    requirements: db.requirements.length,
    analyses: db.analyses.length,
    analysesThisWeek: recentAnalyses.length,
    avgConfidence,
    highRiskCount,
    projectStatuses,
  };
}
