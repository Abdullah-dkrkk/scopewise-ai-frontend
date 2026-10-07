import { useState, useCallback } from 'react';

export default function useApi(apiFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFn(...args);
      setData(res.data);
      return res.data;
    } catch (err) {
      const message = (err.response && err.response.data && err.response.data.message)
        || 'Something went wrong.';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  const reset = useCallback(() => {
    setData(null);
    setError('');
    setLoading(false);
  }, []);

  return {
    data, loading, error, execute, setData, reset,
  };
}
