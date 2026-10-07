import * as db from './db';

/**
 * Mock API mirroring the real Laravel contract (see BACKEND_REQUIREMENTS.md).
 *
 * Envelopes are `{ success, data }` for single resources and
 * `{ data, meta, links }` for collections, exactly like the backend, so that
 * switching VITE_USE_MOCKS off does not change any unwrapping behaviour.
 */

function HttpError(status, message, errors = null) {
  const error = new Error(message);
  error.status = status;
  error.errors = errors;
  return error;
}

function normalize(url) {
  return (url || '')
    .split('?')[0]
    .split('/')
    .filter(Boolean)
    .map((part) => part.toLowerCase());
}

function assertAuth(token) {
  const user = db.findUserByToken(token);
  if (!user) throw HttpError(401, 'Unauthenticated. Please sign in again.');
  return user;
}

function safeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function paginate(list, params = {}) {
  const perPage = Math.min(Number(params.per_page) || 20, 100);
  const currentPage = Math.max(Number(params.page) || 1, 1);
  const total = list.length;
  const lastPage = Math.max(Math.ceil(total / perPage), 1);
  const start = (currentPage - 1) * perPage;

  return {
    data: list.slice(start, start + perPage),
    meta: {
      current_page: currentPage,
      per_page: perPage,
      total,
      last_page: lastPage,
      from: total === 0 ? null : start + 1,
      to: total === 0 ? null : Math.min(start + perPage, total),
    },
    links: {
      first: currentPage > 1 ? '?page=1' : null,
      last: currentPage < lastPage ? `?page=${lastPage}` : null,
      prev: currentPage > 1 ? `?page=${currentPage - 1}` : null,
      next: currentPage < lastPage ? `?page=${currentPage + 1}` : null,
    },
  };
}

function handleAuth(method, parts, data, token) {
  const action = parts[0];

  if (method === 'POST' && action === 'register') {
    if (!data || !data.name || !data.email || !data.password) {
      throw HttpError(422, 'Please correct the highlighted fields.', {
        name: ['Name is required.'],
        email: ['Email is required.'],
        password: ['Password is required.'],
      });
    }
    if (db.findUserByEmail(data.email)) {
      throw HttpError(422, 'Please correct the highlighted fields.', {
        email: ['An account with this email already exists.'],
      });
    }
    const user = db.addUser(data);
    return { success: true, data: { token: db.createSession(user), user: safeUser(user) } };
  }

  if (method === 'POST' && action === 'login') {
    if (!data || !data.email || !data.password) {
      throw HttpError(422, 'Email and password are required.', {
        email: ['Email is required.'],
        password: ['Password is required.'],
      });
    }
    const user = db.findUserByEmail(data.email);
    if (!user || user.password !== data.password) {
      throw HttpError(401, 'Invalid email or password.');
    }
    return { success: true, data: { token: db.createSession(user), user: safeUser(user) } };
  }

  if (method === 'POST' && action === 'logout') {
    if (token) db.destroySession(token);
    return { success: true, message: 'Logged out successfully' };
  }

  if (method === 'GET' && action === 'me') {
    return { success: true, data: { user: safeUser(assertAuth(token)) } };
  }

  if (method === 'PUT' && action === 'me') {
    const user = assertAuth(token);
    const updated = db.updateUser(user.id, data || {});
    if (!updated) throw HttpError(404, 'User not found.');
    return { success: true, message: 'Profile updated', data: { user: safeUser(updated) } };
  }

  if (method === 'PUT' && action === 'password') {
    const user = assertAuth(token);
    if (!data || !data.password) {
      throw HttpError(422, 'A new password is required.', {
        password: ['Password is required.'],
      });
    }
    if (data.current_password && user.password !== data.current_password) {
      throw HttpError(422, 'Your current password is incorrect.', {
        current_password: ['Current password does not match.'],
      });
    }
    const updated = db.updateUser(user.id, { password: data.password });
    return { success: true, message: 'Password updated', data: { user: safeUser(updated) } };
  }

  if (method === 'POST' && action === 'forgot-password') {
    if (!data || !data.email) {
      throw HttpError(422, 'Email is required.', { email: ['Email is required.'] });
    }
    db.resetPassword(data.email);
    // Always the same response — never reveal whether the account exists.
    return {
      success: true,
      message: 'If an account exists for that email, a reset link has been sent.',
    };
  }

  throw HttpError(404, 'Auth route not found');
}

function handleProjects(method, parts, data, params, token) {
  const user = assertAuth(token);

  if (method === 'GET' && parts.length === 0) {
    return paginate(db.listProjects(params && params.search, params && params.status), params);
  }

  if (method === 'POST' && parts.length === 0) {
    if (!data || !data.name || !data.name.trim()) {
      throw HttpError(422, 'Please correct the highlighted fields.', {
        name: ['Project name is required.'],
      });
    }
    const project = db.createProject(data);
    return { success: true, message: 'Project created successfully', data: project };
  }

  if (parts.length === 1) {
    const project = db.getProject(parts[0]);
    if (!project || project.userId !== user.id) throw HttpError(404, 'Project not found.');

    if (method === 'GET') return { success: true, data: project };
    if (method === 'PUT') {
      const updated = db.updateProject(parts[0], data || {});
      return { success: true, message: 'Project updated', data: updated };
    }
    if (method === 'DELETE') {
      db.deleteProject(parts[0]);
      return { success: true, message: 'Project deleted successfully' };
    }
  }

  if (method === 'GET' && parts.length === 2 && parts[1] === 'requirements') {
    const project = db.getProject(parts[0]);
    if (!project || project.userId !== user.id) throw HttpError(404, 'Project not found.');
    return paginate(db.listRequirements(parts[0]), params);
  }

  throw HttpError(404, 'Projects route not found');
}

function handleRequirements(method, parts, data, params, token) {
  assertAuth(token);

  if (method === 'POST' && parts.length === 0) {
    if (!data || !data.content || !data.content.trim()) {
      throw HttpError(422, 'Please correct the highlighted fields.', {
        content: ['Requirement description is required.'],
      });
    }
    if (data.project_id && !db.getProject(data.project_id)) {
      throw HttpError(422, 'Please correct the highlighted fields.', {
        project_id: ['The selected project no longer exists.'],
      });
    }
    const result = db.analyzeRequirement(data.project_id || null, data.content.trim());
    return {
      success: true,
      message: 'Requirement analyzed successfully',
      data: {
        id: result.requirement.id,
        project_id: result.requirement.projectId,
        content: result.requirement.text,
        category: null,
        priority: data.priority || 'medium',
        status: 'analyzed',
        created_at: new Date(result.requirement.createdAt).toISOString(),
        updated_at: new Date(result.requirement.createdAt).toISOString(),
        analysis: result.analysis,
      },
    };
  }

  if (parts.length === 1) {
    const requirement = db.getRequirement(parts[0]);
    if (!requirement) throw HttpError(404, 'Requirement not found.');

    if (method === 'GET') return { success: true, data: requirement };
    if (method === 'PUT') {
      const updated = db.updateRequirement(parts[0], data || {});
      return { success: true, message: 'Requirement updated', data: updated };
    }
    if (method === 'DELETE') {
      db.deleteRequirement(parts[0]);
      return { success: true, message: 'Requirement deleted' };
    }
  }

  throw HttpError(404, 'Requirements route not found');
}

function handleAnalysis(method, parts, data, params, token) {
  assertAuth(token);

  if (parts.length === 0) throw HttpError(404, 'Analysis route not found');

  const analysis = db.getAnalysis(parts[0]);
  if (!analysis) throw HttpError(404, 'Analysis not found.');

  if (method === 'GET' && parts.length === 1) {
    return { success: true, data: analysis };
  }

  if (method === 'GET' && parts.length === 2 && parts[1] === 'questions') {
    return { success: true, data: analysis.questions };
  }

  if (method === 'POST' && parts.length === 3 && parts[1] === 'questions') {
    if (!data || !data.answer || !data.answer.trim()) {
      throw HttpError(422, 'Please correct the highlighted fields.', {
        answer: ['An answer is required.'],
      });
    }
    const updated = db.answerQuestion(parts[0], parts[2], data.answer.trim());
    if (!updated) throw HttpError(404, 'Question not found.');
    return { success: true, message: 'Answer recorded', data: updated };
  }

  throw HttpError(404, 'Analysis route not found');
}

function handleOverview(method, parts, params, token) {
  assertAuth(token);
  const action = parts[0];

  if (method === 'GET' && (action === 'stats' || parts.length === 0)) {
    return { success: true, data: db.getDashboardStats() };
  }
  if (method === 'GET' && action === 'activity') {
    return { success: true, data: db.listActivity() };
  }
  if (method === 'GET' && action === 'history') {
    return paginate(db.listHistory(), params);
  }

  throw HttpError(404, 'Overview route not found');
}

export function handleMockRequest({
  method, url, data, params = {}, token,
}) {
  const parts = normalize(url);

  if (parts[0] === 'auth') return handleAuth(method, parts.slice(1), data, token);
  if (parts[0] === 'projects') return handleProjects(method, parts.slice(1), data, params, token);
  if (parts[0] === 'requirements') return handleRequirements(method, parts.slice(1), data, params, token);
  if (parts[0] === 'analysis') return handleAnalysis(method, parts.slice(1), data, params, token);
  if (parts[0] === 'dashboard') return handleOverview(method, parts.slice(1), params, token);
  if (parts[0] === 'history' || parts[0] === 'activity') return handleOverview(method, parts, params, token);

  throw HttpError(404, 'Route not found in mock API');
}

export default handleMockRequest;
