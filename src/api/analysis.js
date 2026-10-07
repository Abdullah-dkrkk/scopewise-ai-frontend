import { api } from './client';
import { ROUTES } from './routes';
import { buildParams } from './params';
import {
  mapAnalysis, mapPaginated, mapQuestion, unwrapList,
} from './viewModels';

export async function getAnalysis(id) {
  const payload = await api.get(ROUTES.analysis.show(id));
  return mapAnalysis(payload);
}

export async function getQuestions(analysisId) {
  const payload = await api.get(ROUTES.analysis.questions(analysisId));
  return unwrapList(payload).map((q, i) => mapQuestion(q, i));
}

/**
 * Submit an answer. The backend is expected to return the recalculated
 * analysis so confidence can rise without a second round-trip.
 */
export async function answerQuestion(analysisId, questionId, answer) {
  const payload = await api.post(ROUTES.analysis.answer(analysisId, questionId), { answer });
  return mapAnalysis(payload);
}

export async function getHistory(options = {}) {
  const {
    page, perPage, classification, riskLevel, projectId, dateFrom, dateTo, sort,
  } = options;
  const params = buildParams({
    page,
    per_page: perPage,
    classification,
    risk_level: riskLevel,
    project_id: projectId,
    date_from: dateFrom,
    date_to: dateTo,
    sort,
  });
  const payload = await api.get(ROUTES.history.index, params);
  return mapPaginated(payload, mapAnalysis);
}
