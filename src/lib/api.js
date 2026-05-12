const API_BASE = (process.env.REACT_APP_API_URL || '/api').replace(/\/$/, '');

export function countryApiUrl(country, path = '') {
  const suffix = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${API_BASE}/countries/${country}${suffix}`;
}

export function normalizeSessionStats(data = {}) {
  return {
    score: data.score ?? 0,
    streak: data.streak ?? 0,
    best: data.best ?? 0,
    spectrumAccuracy: data.spectrum_accuracy ?? null,
    totalAnswers: data.total_answers ?? 0,
  };
}
