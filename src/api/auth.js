import { api } from './client';
import { ROUTES } from './routes';
import { mapAuthResponse, mapUser } from './viewModels';
import {
  clearSession, setToken, setUser,
} from './session';

export async function login({ email, password }) {
  const payload = await api.post(ROUTES.auth.login, { email, password });
  const { user, token } = mapAuthResponse(payload);
  setToken(token);
  setUser(user);
  return { user, token };
}

export async function register({ name, email, password }) {
  const payload = await api.post(ROUTES.auth.register, {
    name,
    email,
    password,
    // Laravel validates `password` with the `confirmed` rule, so the
    // confirmation field the form already collects has to travel with it.
    password_confirmation: password,
  });
  const { user, token } = mapAuthResponse(payload);
  setToken(token);
  setUser(user);
  return { user, token };
}

/**
 * Always clears the local session, even if the network call fails — a user who
 * clicks logout must end up logged out.
 */
export async function logout() {
  try {
    await api.post(ROUTES.auth.logout);
  } finally {
    clearSession();
  }
}

export async function getMe() {
  const payload = await api.get(ROUTES.auth.me);
  const { user } = mapAuthResponse(payload);
  setUser(user);
  return user;
}

export async function updateProfile({ name, email }) {
  const payload = await api.put(ROUTES.auth.me, { name, email });
  const user = mapUser((payload && payload.user) || payload);
  setUser(user);
  return user;
}

/**
 * See BACKEND_REQUIREMENTS.md §6.6. The backend must require `current_password`
 * and revoke other sessions on success.
 */
export async function changePassword({ currentPassword, newPassword }) {
  const payload = await api.put(ROUTES.auth.password, {
    current_password: currentPassword,
    password: newPassword,
    password_confirmation: newPassword,
  });
  const user = mapUser((payload && payload.user) || payload);
  setUser(user);
  return user;
}

export async function forgotPassword(email) {
  return api.post(ROUTES.auth.forgotPassword, { email });
}

export async function resetPassword({ token, password, passwordConfirmation }) {
  return api.post(ROUTES.auth.reset, {
    token,
    password,
    password_confirmation: passwordConfirmation,
  });
}
