import {
  createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';

const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

let notificationId = 0;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(({
    type = 'info', title, message, duration = 5000,
  }) => {
    notificationId += 1;
    const id = `n-${notificationId}`;
    setNotifications((prev) => [...prev, {
      id, type, title, message,
    }]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const value = useMemo(
    () => ({ notifications, addNotification, removeNotification }),
    [notifications, addNotification, removeNotification],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
