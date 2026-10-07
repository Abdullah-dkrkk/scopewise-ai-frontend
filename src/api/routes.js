/**
 * Single source of truth for every backend path the app talks to.
 *
 * Paths are written relative to `VITE_API_URL` (which already includes `/api`).
 * Keeping them here means a backend route change is a one-line change here
 * instead of a search across components.
 */

export const ROUTES = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    password: '/auth/password',
    forgotPassword: '/auth/forgot-password',
    reset: '/auth/reset-password',
  },
  projects: {
    index: '/projects',
    store: '/projects',
    show: (id) => `/projects/${id}`,
    update: (id) => `/projects/${id}`,
    destroy: (id) => `/projects/${id}`,
    requirements: (id) => `/projects/${id}/requirements`,
  },
  requirements: {
    store: '/requirements',
    show: (id) => `/requirements/${id}`,
    update: (id) => `/requirements/${id}`,
    destroy: (id) => `/requirements/${id}`,
  },
  analysis: {
    show: (id) => `/analysis/${id}`,
    questions: (id) => `/analysis/${id}/questions`,
    answer: (analysisId, questionId) => `/analysis/${analysisId}/questions/${questionId}`,
  },
  dashboard: {
    stats: '/dashboard/stats',
    activity: '/dashboard/activity',
  },
  history: {
    index: '/history',
  },
};
