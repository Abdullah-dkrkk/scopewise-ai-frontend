export const PROJECT_STATUSES = {
  ACTIVE: 'active',
  REVIEW: 'review',
  DRAFT: 'draft',
};

export const STATUS_VARIANT_MAP = {
  active: 'success',
  review: 'warning',
  draft: 'outline',
};

export const CLASSIFICATION_TYPES = {
  FUNCTIONAL: 'functional',
  TECHNICAL: 'technical',
  NON_FUNCTIONAL: 'non-functional',
};

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const API_ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  PROJECTS: '/projects',
  REQUIREMENTS: '/requirements',
  ANALYSIS: '/analysis',
  DASHBOARD: '/dashboard',
  HISTORY: '/history',
};

export const TOAST_DURATION = 5000;

export const DEMO_CREDENTIALS = {
  EMAIL: 'test@scopewise.ai',
  PASSWORD: 'password123',
};
