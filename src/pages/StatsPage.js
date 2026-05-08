import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';

const API = process.env.REACT_APP_API_URL || '/api';

const PARTY_CLASS = {
  'SPD': 'spd',
  'CDU/CSU': 'cducsu',
  'Grüne': 'gruene',
  'AfD': 'afd',
  'Die Linke': 'linke',
  'FDP': 'fdp',
};

function InsightCard({ value, label }) {
  return (
    <div className="insight-card">
      <span className="insight-card__value">{value}</span>
      <span className="insight-card__label">{label}</span>
    </div>
  );
}

function PartyBar({ party, total, correct, accuracy }) {
  const cls = PARTY_CLASS[party] || '';
  return (
    <div className="party-bar">
      <div className="party-bar__meta">
        <span className={`party-bar__name party-bar__name--${cls}`}>{party}</span>
        <div className="party-bar__right">
          <span className="party-bar__count">{correct.toLocaleString()}/{total.toLocaleString()}</span>
          <span className="party-bar__pct">{accuracy}%</span>
        </div>
      </div>
      <div className="party-bar__track">
        <div
          className={`party-bar__fill party-bar__fill--${cls}`}
          style={{ width: `${accuracy}%` }}
        />
      </div>
    </div>
  );
}

function ConfusionRow({ actual, guessed, count }) {
  return (
    <div className="confusion-row">
      <span className={`party-tag party-tag--${PARTY_CLASS[actual]}`}>{actual}</span>
      <span className="confusion-row__arrow">→</span>
      <span className={`party-tag party-tag--${PARTY_CLASS[guessed]}`}>{guessed}</span>
      <span className="confusion-row__count">{count.toLocaleString()}×</span>
    </div>
  );
}

function PoliticianRow({ rank, name, party, image, accuracy, variant }) {
  const cls = PARTY_CLASS[party] || '';
  return (
    <div className={`politician-row politician-row--${cls}`}>
      <span className="politician-row__rank">{rank}</span>
      <div className="politician-row__avatar">
        {image
          ? <img src={image} alt={name} className="politician-row__img" />
          : <span className="politician-row__img-placeholder" />
        }
      </div>
      <div className="politician-row__info">
        <span className="politician-row__name">{name}</span>
        <span className={`party-tag party-tag--${cls}`}>{party}</span>
      </div>
      <span className={`politician-row__count politician-row__count--${variant}`}>
        {accuracy}%
      </span>
    </div>
  );
}

export default function StatsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/global-stats/`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <main className="stats-page">
      <header className="stats-header">
        <div className="header__brand">
          <div className="header__flag" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="header__titles">
            <h1 className="header__title">Welche Partei?</h1>
            <p className="header__subtitle">Statistiken</p>
          </div>
        </div>
        <Link to="/" className="stats-back-btn">← Spielen</Link>
      </header>

      {loading && (
        <div className="stats-loading">
          <span>Lade Statistiken…</span>
        </div>
      )}

      {error && (
        <div className="error-state">
          <span className="error-state__icon">⚠️</span>
          <p>Statistiken konnten nicht geladen werden.</p>
          <Link to="/" className="btn-retry">Zurück zum Spiel</Link>
        </div>
      )}

      {data && (
        <>
          <div className="insights-grid">
            <InsightCard value={data.total_answers.toLocaleString()} label="Antworten" />
            <InsightCard value={`${data.overall_accuracy}%`} label="Genauigkeit" />
            <InsightCard value={data.unique_players.toLocaleString()} label="Spieler" />
            <InsightCard value={data.global_best_streak} label="Rekord-Serie" />
          </div>

          {data.spectrum_accuracy != null && (
            <section className="leaning-section">
              <p className="stats-section-heading">Links / Rechts Genauigkeit</p>
              <div className="leaning-summary">
                <div className="leaning-summary__global">
                  <span className="leaning-summary__value">{data.spectrum_accuracy}%</span>
                  <span className="leaning-summary__label">Global Spektrum</span>
                </div>
              </div>
              {data.leaning_stats && data.leaning_stats.length > 0 && (
                <div className="leaning-bars">
                  {data.leaning_stats.map(ls => (
                    <div key={ls.leaning} className={`leaning-bar leaning-bar--${ls.leaning}`}>
                      <div className="leaning-bar__header">
                        <span className="leaning-bar__name">
                          {ls.leaning === 'left' ? '← Links' : 'Rechts →'}
                        </span>
                        <div className="leaning-bar__stats">
                          <span className="leaning-bar__exact">{ls.accuracy}% exakt</span>
                          <span className="leaning-bar__spectrum">{ls.spectrum_accuracy}% Seite</span>
                        </div>
                      </div>
                      <div className="party-bar__track">
                        <div
                          className={`party-bar__fill leaning-bar__fill--${ls.leaning}`}
                          style={{ width: `${ls.spectrum_accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="party-accuracy">
            <p className="stats-section-heading">Genauigkeit pro Partei</p>
            {[...data.party_stats]
              .sort((a, b) => b.accuracy - a.accuracy)
              .map(p => <PartyBar key={p.party} {...p} />)
            }
          </section>

          <AdBanner />

          {data.top_correct.length > 0 && (
            <section className="politician-section">
              <p className="stats-section-heading">Oft richtig geraten</p>
              <div className="politician-list">
                {data.top_correct.map((p, i) => (
                  <PoliticianRow key={i} rank={i + 1} {...p} variant="correct" />
                ))}
              </div>
            </section>
          )}

          {data.top_wrong.length > 0 && (
            <section className="politician-section">
              <p className="stats-section-heading">Oft falsch geraten</p>
              <div className="politician-list">
                {data.top_wrong.map((p, i) => (
                  <PoliticianRow key={i} rank={i + 1} {...p} variant="wrong" />
                ))}
              </div>
            </section>
          )}

          {data.confusion.length > 0 && (
            <section className="confusion-section">
              <p className="stats-section-heading">Häufigste Verwechslungen</p>
              <div className="confusion-list">
                {data.confusion.map((c, i) => <ConfusionRow key={i} {...c} />)}
              </div>
            </section>
          )}
        </>
      )}

      <AdBanner />

      <footer className="page-footer">
        <Link to="/datenschutz" className="page-footer__link">Datenschutz</Link>
      </footer>
    </main>
  );
}
