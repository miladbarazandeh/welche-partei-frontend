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
    name: data.name ?? '',
  };
}

export async function patchPlayerName(name) {
  const res = await fetch(`${API_BASE}/session/name/`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('name update failed');
}
