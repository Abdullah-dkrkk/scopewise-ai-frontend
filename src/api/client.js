import axios from 'axios';
import { API_URL, REQUEST_TIMEOUT_MS, USE_MOCKS } from '../config/env';
import { getToken, clearSession, getCsrfCookie } from './session';
import { ErrorKind, normalizeError } from './errors';

/**
 * Laravel returns paginated collections as `{ data: [...], meta, links }` and
 * single resources as `{ success, data }`. Unwrap both to the useful payload
 * while preserving pagination metadata, so callers never index `.data` by hand.
 */
function unwrapEnvelope(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return body;

  // Paginated collection — meta/links must survive.
  if (Array.isArray(body.data) && (body.meta || body.links)) return body;

  // Explicit success envelope: { success, data, message }
  if (body.success !== undefined && 'data' in body) return body.data;

  // Bare { data: x } from the mock layer
  if ('data' in body) return body.data;

  return body;
}

let unauthorizedHandler = null;

/**
 * Registered by AuthProvider so a 401 clears state and redirects through the
 * router instead of a hard `window.location` reload.
 */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

const http = axios.create({
  baseURL: API_URL || undefined,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  // Required for Sanctum's stateful (cookie) authentication.
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const headers = config.headers || {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const csrf = getCsrfCookie();
  if (csrf) {
    headers['X-XSRF-TOKEN'] = decodeURIComponent(csrf);
  }

  return { ...config, headers };
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error && error.response ? error.response.status : 0;
    if (status === 401) {
      clearSession();
      if (unauthorizedHandler) unauthorizedHandler();
    }
    return Promise.reject(normalizeError(error));
  },
);

async function mockRequest({
  method, url, data, params,
}) {
  const { handleMockRequest } = await import('./mock/router');
  const { delay } = await import('./mock/delay');

  await delay();

  try {
    const result = handleMockRequest({
      method, url, data, params, token: getToken(),
    });
    return unwrapEnvelope(result);
  } catch (err) {
    return Promise.reject(normalizeError({
      response: {
        status: err.status || 500,
        data: { message: err.message },
      },
    }));
  }
}

/**
 * Perform a request and return the unwrapped payload.
 *
 * @param {{
 *   method: string, url: string, data?: object, params?: object, signal?: AbortSignal,
 * }} config
 */
async function request({
  method, url, data, params, signal,
}) {
  if (USE_MOCKS) {
    return mockRequest({
      method, url, data, params,
    });
  }

  try {
    const response = await http.request({
      method, url, data, params, signal,
    });
    return unwrapEnvelope(response.data);
  } catch (error) {
    throw error instanceof Error && error.name === 'ApiError'
      ? error
      : normalizeError(error);
  }
}

export const api = {
  get: (url, params, options) => request({
    method: 'GET', url, params, ...options,
  }),
  post: (url, data, options) => request({
    method: 'POST', url, data, ...options,
  }),
  put: (url, data, options) => request({
    method: 'PUT', url, data, ...options,
  }),
  patch: (url, data, options) => request({
    method: 'PATCH', url, data, ...options,
  }),
  delete: (url, options) => request({
    method: 'DELETE', url, ...options,
  }),
};

export { ErrorKind, unwrapEnvelope };
