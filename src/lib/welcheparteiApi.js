const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export async function fetchQuizData() {
  const res = await fetch(`${BASE}/welchepartei/data/`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load quiz data');
  return res.json();
}

export async function saveQuizSession(payload) {
  const res = await fetch(`${BASE}/welchepartei/session/save/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to save session');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${BASE}/welchepartei/analytics/`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to load analytics');
  return res.json();
}

export async function loadQuizSession() {
  const res = await fetch(`${BASE}/welchepartei/session/`, { credentials: 'include' });
  if (!res.ok) return { answers: {}, weights: {}, values_answers: {} };
  return res.json();
}
