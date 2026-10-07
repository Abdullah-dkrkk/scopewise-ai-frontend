import { useCallback, useState } from 'react';
import { requirementsApi, toMessage } from '../api';

/**
 * Thin wrapper around the requirements endpoints.
 *
 * Returns `{items, meta}` rather than a raw response, and surfaces the error
 * message directly so callers do not have to unwrap `err.response.data`.
 */
export default function useRequirements() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRequirements = useCallback(async (projectId, options = {}) => {
    if (!projectId) {
      setItems([]);
      setMeta(null);
      return { items: [], meta: null };
    }

    setLoading(true);
    setError('');
    try {
      const result = await requirementsApi.listProjectRequirements(projectId, options);
      setItems(result.items);
      setMeta(result.meta);
      return result;
    } catch (err) {
      setItems([]);
      setMeta(null);
      setError(toMessage(err, 'Could not load requirements for this project.'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRequirement = useCallback(async (values) => {
    try {
      return await requirementsApi.createRequirement(values);
    } catch (err) {
      setError(toMessage(err, 'Could not create the requirement.'));
      throw err;
    }
  }, []);

  const deleteRequirement = useCallback(async (id) => {
    try {
      await requirementsApi.deleteRequirement(id);
      setItems((current) => current.filter((r) => r.id !== id));
    } catch (err) {
      setError(toMessage(err, 'Could not delete the requirement.'));
      throw err;
    }
  }, []);

  const analyzeRequirement = useCallback(async (projectId, text) => {
    try {
      return await requirementsApi.analyzeRequirement({ projectId, text });
    } catch (err) {
      setError(toMessage(err, 'Analysis failed. Please try again.'));
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return {
    requirements: items,
    items,
    meta,
    loading,
    error,
    fetchRequirements,
    createRequirement,
    deleteRequirement,
    analyzeRequirement,
    setRequirements: setItems,
    clearError,
  };
}
