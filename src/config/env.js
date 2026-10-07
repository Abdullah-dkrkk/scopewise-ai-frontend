/**
 * Centralised, validated runtime configuration.
 *
 * Every environment variable is read exactly once, here. Anything that is
 * required in production is validated eagerly so that a misconfigured deploy
 * fails with a readable message instead of firing doomed requests at `undefined`.
 */

const RAW = import.meta.env || {};

function readString(key, fallback = '') {
  const value = RAW[key];
  return typeof value === 'string' ? value.trim() : fallback;
}

function readBoolean(key, fallback = false) {
  const value = RAW[key];
  if (value === undefined || value === null || value === '') return fallback;
  return String(value).toLowerCase() === 'true' || value === true;
}

function readNumber(key, fallback) {
  const value = Number(RAW[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function stripTrailingSlash(value) {
  return typeof value === 'string' ? value.replace(/\/+$/, '') : '';
}

export const APP_ENV = readString('VITE_APP_ENV', RAW.MODE || 'development');
export const IS_PROD = APP_ENV === 'production' || RAW.PROD === true;

/**
 * Mocks are opt-in. A deploy that forgets to set this must never silently
 * serve fabricated data to real users.
 */
export const USE_MOCKS = readBoolean('VITE_USE_MOCKS', false);

export const API_URL = stripTrailingSlash(
  readString('VITE_API_URL', IS_PROD ? '' : 'http://localhost:8000/api'),
);

export const REQUEST_TIMEOUT_MS = readNumber('VITE_REQUEST_TIMEOUT_MS', 20000);

export const ENABLE_DESIGN_PREVIEW = readBoolean('VITE_ENABLE_DESIGN_PREVIEW', !IS_PROD);

/**
 * Fallback estimation rates, used only when the backend does not return
 * cost/timeline directly. Keep in sync with the backend's documented defaults.
 */
export const ESTIMATION = {
  hoursPerPersonDay: 8,
  hoursPerWorkingDay: 6,
  workingDaysPerWeek: 5,
  defaultTeamSize: 2,
  blendedDailyRate: 540,
};

/**
 * @returns {string[]} human-readable configuration problems. Empty when valid.
 */
export function validateConfig() {
  const problems = [];

  if (USE_MOCKS) {
    if (IS_PROD) {
      problems.push(
        'VITE_USE_MOCKS is enabled in a production build. '
        + 'This serves fabricated data and must be turned off.',
      );
    }
    return problems;
  }

  if (!API_URL) {
    problems.push(
      'VITE_API_URL is not set. The app cannot reach the API without it. '
      + 'Add it to your .env file (see .env.example).',
    );
  } else if (!/^https?:\/\//i.test(API_URL)) {
    problems.push(
      `VITE_API_URL must be an absolute http(s) URL. Received: "${API_URL}".`,
    );
  } else if (IS_PROD && !/^https:\/\//i.test(API_URL)) {
    problems.push(
      `VITE_API_URL must use HTTPS in production. Received: "${API_URL}".`,
    );
  }

  return problems;
}

export const CONFIG_ERRORS = validateConfig();
export const CONFIG_IS_VALID = CONFIG_ERRORS.length === 0;

export default {
  APP_ENV,
  IS_PROD,
  USE_MOCKS,
  API_URL,
  REQUEST_TIMEOUT_MS,
  ENABLE_DESIGN_PREVIEW,
  ESTIMATION,
  CONFIG_ERRORS,
  CONFIG_IS_VALID,
};
