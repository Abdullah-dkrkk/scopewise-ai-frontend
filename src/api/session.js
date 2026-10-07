/**
 * Session storage.
 *
 * Token is held in localStorage so it survives a hard reload; this is a
 * deliberate trade-off. If the backend moves to Sanctum's stateful cookie flow
 * (which `bootstrap/app.php` already enables via `statefulApi()`), `setToken`
 * becomes a no-op and the token never touches JS-readable storage at all.
 */

const TOKEN_KEY = 'sw_token';
const USER_KEY = 'sw_user';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage unavailable — session stays in-memory only
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    // storage unavailable
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // storage unavailable
  }
}

/** Laravel's CSRF cookie is used for stateful (cookie) API auth. */
export function getCsrfCookie() {
  try {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
