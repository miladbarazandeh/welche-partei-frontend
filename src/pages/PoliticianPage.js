import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || '/api';

const PARTY_CLASS = {
  'SPD': 'spd',
  'CDU/CSU': 'cducsu',
  'Grüne': 'gruene',
  'AfD': 'afd',
  'Die Linke': 'linke',
  'FDP': 'fdp',
};

function AccuracyRing({ accuracy }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const filled = animated ? (accuracy / 100) * circumference : 0;

  return (
    <div className="accuracy-ring">
      <svg viewBox="0 0 100 100" className="accuracy-ring__svg" aria-hidden="true">
        <circle cx="50" cy="50" r={r} className="accuracy-ring__track" />
        <circle
          cx="50" cy="50" r={r}
          className="accuracy-ring__fill"
          strokeDasharray={`${filled} ${circumference}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="accuracy-ring__label">
        <span className="accuracy-ring__value">{accuracy}%</span>
        <span className="accuracy-ring__sub">Genauigkeit</span>
      </div>
    </div>
  );
}

function ConfusionBar({ party, count, percentage, isCorrect }) {
  const cls = PARTY_CLASS[party] || '';
  return (
    <div className={`confusion-bar${isCorrect ? ' confusion-bar--correct' : ''}`}>
      <div className="confusion-bar__meta">
        <div className="confusion-bar__left">
          <span className={`party-tag party-tag--${cls}`}>{party}</span>
          {isCorrect && <span className="confusion-bar__correct-badge">Richtig</span>}
        </div>
        <div className="confusion-bar__right">
          <span className="confusion-bar__count">{count.toLocaleString()}×</span>
          <span className="confusion-bar__pct">{percentage}%</span>
        </div>
      </div>
      <div className="party-bar__track">
        <div
          className={`party-bar__fill ${isCorrect ? 'confusion-bar__fill--correct' : `party-bar__fill--${cls}`}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function PoliticianPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setData(null);
    fetch(`${API}/politicians/${id}/stats/`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(d => { if (d) { setData(d); setLoading(false); } })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  const cls = data ? (PARTY_CLASS[data.party] || '') : '';

  return (
    <main className="politician-page">
      <header className="stats-header">
        <div className="header__brand">
          <div className="header__flag" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="header__titles">
            <h1 className="header__title">Welche Partei?</h1>
            <p className="header__subtitle">Politiker</p>
          </div>
        </div>
        <Link to="/stats" className="stats-back-btn">← Statistiken</Link>
      </header>

      {loading && (
        <div className="stats-loading"><span>Lade…</span></div>
      )}

      {notFound && (
        <div className="error-state">
          <span className="error-state__icon">⚠️</span>
          <p>Dieser Politiker wurde nicht gefunden.</p>
          <Link to="/stats" className="btn-retry">Zurück zu Statistiken</Link>
        </div>
      )}

      {data && (
        <>
          <div className={`pol-hero pol-hero--${cls}`}>
            <div className="pol-hero__photo-wrap">
              {data.image ? (
                <>
                  <img src={data.image} alt="" className="politician-card__photo-bg" aria-hidden="true" />
                  <img ref={imgRef} src={data.image} alt={data.name} className="politician-card__photo" />
                </>
              ) : (
                <div className="politician-card__photo-placeholder">👤</div>
              )}
              <div className="politician-card__gradient" />
              <div className="pol-hero__party-badge">
                <span className={`party-tag party-tag--${cls}`}>{data.party}</span>
              </div>
            </div>
            <div className="pol-hero__info">
              <h2 className="pol-hero__name">{data.name}</h2>
              <p className="pol-hero__parliament">{data.parliament}</p>
            </div>
          </div>

          <div className="pol-stats-row">
            <AccuracyRing accuracy={data.accuracy} />
            <div className="pol-stat-card">
              <span className="pol-stat-card__value">{data.total_answers.toLocaleString()}</span>
              <span className="pol-stat-card__label">Antworten gesamt</span>
            </div>
          </div>

          <section className="pol-confusion">
            <p className="stats-section-heading">Wie wurde geraten</p>
            <div className="pol-confusion__list">
              {[...data.confusion]
                .sort((a, b) => b.percentage - a.percentage)
                .map(entry => (
                  <ConfusionBar
                    key={entry.party}
                    {...entry}
                    isCorrect={entry.party === data.party}
                  />
                ))}
            </div>
          </section>
        </>
      )}

      <footer className="page-footer">
        <Link to="/datenschutz" className="page-footer__link">Datenschutz</Link>
        <span className="page-footer__separator"> | </span>
        <Link to="/impressum" className="page-footer__link">Impressum</Link>
      </footer>
    </main>
  );
}
