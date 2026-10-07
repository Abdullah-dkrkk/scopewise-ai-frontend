import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { authApi, setUnauthorizedHandler } from '../api';
import { getUser } from '../api/session';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Only validate a session when one exists — otherwise an anonymous visitor
    // triggers a guaranteed 401 and gets bounced off the public landing page.
    if (!getUser()) {
      setLoading(false);
      return () => {};
    }

    authApi
      .getMe()
      .then((me) => {
        if (active) setUser(me);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // A 401 from any request clears state and lets the router redirect in-SPA
  // rather than forcing a full page reload.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login({ email, password });
    setUser(result.user);
    return result;
  }, []);

  const register = useCallback(async (payload) => {
    const result = await authApi.register(payload);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user, loading, login, register, logout,
    }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
