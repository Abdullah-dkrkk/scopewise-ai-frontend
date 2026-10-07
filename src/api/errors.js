/**
 * A single, predictable error type for every failed request.
 *
 * Services, hooks and components all branch on the `kind` flags rather than
 * reaching into axios internals, so swapping the HTTP client stays contained.
 */

export const ErrorKind = {
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  VALIDATION: 'validation',
  RATE_LIMITED: 'rate_limited',
  SERVER: 'server',
  UNKNOWN: 'unknown',
};

const DEFAULT_MESSAGES = {
  [ErrorKind.NETWORK]: 'Could not reach the server. Check your connection and try again.',
  [ErrorKind.TIMEOUT]: 'The server took too long to respond. Please try again.',
  [ErrorKind.UNAUTHORIZED]: 'Your session has expired. Please sign in again.',
  [ErrorKind.FORBIDDEN]: 'You do not have permission to do that.',
  [ErrorKind.NOT_FOUND]: 'We could not find what you were looking for.',
  [ErrorKind.VALIDATION]: 'Please check the highlighted fields and try again.',
  [ErrorKind.RATE_LIMITED]: 'Too many requests. Please wait a moment and try again.',
  [ErrorKind.SERVER]: 'Something went wrong on our end. Please try again shortly.',
  [ErrorKind.UNKNOWN]: 'Something went wrong. Please try again.',
};

const STATUS_TO_KIND = {
  400: ErrorKind.VALIDATION,
  401: ErrorKind.UNAUTHORIZED,
  403: ErrorKind.FORBIDDEN,
  404: ErrorKind.NOT_FOUND,
  409: ErrorKind.VALIDATION,
  422: ErrorKind.VALIDATION,
  429: ErrorKind.RATE_LIMITED,
};

export class ApiError extends Error {
  constructor({
    message, kind = ErrorKind.UNKNOWN, status = 0, errors = null, original = null,
  }) {
    super(message || DEFAULT_MESSAGES[kind] || DEFAULT_MESSAGES[ErrorKind.UNKNOWN]);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.errors = errors;
    this.original = original;

    if (Error.captureStackTrace) Error.captureStackTrace(this, ApiError);
  }

  /** @returns {boolean} */
  get isValidation() {
    return this.kind === ErrorKind.VALIDATION;
  }

  /** First validation message for a given field, if any. */
  fieldError(field) {
    const value = this.errors && this.errors[field];
    if (!value) return null;
    return Array.isArray(value) ? value[0] : value;
  }

  /** @returns {boolean} */
  get isRetriable() {
    return this.kind === ErrorKind.NETWORK
      || this.kind === ErrorKind.TIMEOUT
      || this.kind === ErrorKind.SERVER
      || this.kind === ErrorKind.RATE_LIMITED;
  }
}

function firstString(...candidates) {
  return candidates.find((c) => typeof c === 'string' && c.trim().length > 0) || null;
}

/**
 * Laravel validation bodies look like `{message, errors: {field: [msgs]}}`.
 * Flatten that into a single readable sentence when no field context exists.
 */
function summariseValidation(payload) {
  const fieldErrors = payload && payload.errors;
  if (fieldErrors && typeof fieldErrors === 'object') {
    const parts = Object.values(fieldErrors)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .filter((v) => typeof v === 'string');
    if (parts.length > 0) return parts.join(' ');
  }
  return null;
}

/**
 * Safe message extraction for UI display. Every thrown value ends up with a
 * human-readable string, so components never poke at transport internals.
 *
 * @param {unknown} error
 * @param {string} fallback
 * @returns {string}
 */
export function toMessage(error, fallback = DEFAULT_MESSAGES[ErrorKind.UNKNOWN]) {
  if (!error) return fallback;
  if (error instanceof ApiError) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  if (error && typeof error === 'object' && typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }
  return fallback;
}

/**
 * Convert anything thrown by axios / fetch / mocks into an ApiError.
 *
 * @param {unknown} error
 * @returns {ApiError}
 */
export function normalizeError(error) {
  if (error instanceof ApiError) return error;

  // Fastly / Laravel can return an HTML error page; guard the shape access.
  const response = error && typeof error === 'object' ? error.response : null;
  const status = response && Number.isFinite(response.status) ? response.status : 0;
  const payload = response && typeof response.data === 'object' && response.data !== null
    ? response.data
    : {};

  const serverMessage = firstString(payload.message, payload.error);
  const fieldErrors = payload.errors && typeof payload.errors === 'object' ? payload.errors : null;

  if (!response) {
    const isTimeout = error && (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT');
    const kind = isTimeout ? ErrorKind.TIMEOUT : ErrorKind.NETWORK;
    return new ApiError({
      message: DEFAULT_MESSAGES[kind],
      kind,
      original: error,
    });
  }

  const kind = STATUS_TO_KIND[status] || (status >= 500 ? ErrorKind.SERVER : ErrorKind.UNKNOWN);
  const message = firstString(serverMessage, summariseValidation(payload))
    || DEFAULT_MESSAGES[kind];

  return new ApiError({
    message,
    kind,
    status,
    errors: fieldErrors,
    original: error,
  });
}
