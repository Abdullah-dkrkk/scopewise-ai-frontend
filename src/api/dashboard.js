import { api } from './client';
import { ROUTES } from './routes';
import { mapActivity, mapStats, unwrapList } from './viewModels';

export async function getDashboardStats() {
  const payload = await api.get(ROUTES.dashboard.stats);
  return mapStats(payload);
}

export async function getActivity() {
  const payload = await api.get(ROUTES.dashboard.activity);
  return unwrapList(payload).map(mapActivity);
}
