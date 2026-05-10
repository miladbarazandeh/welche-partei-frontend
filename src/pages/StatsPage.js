import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import AppPromoCards from '../components/AppPromoCards';

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

const SHORT_PARTY = {
  'SPD': 'SPD',
  'CDU/CSU': 'CDU',
  'Grüne': 'Grüne',
  'AfD': 'AfD',
  'Die Linke': 'Linke',
  'FDP': 'FDP',
};

function ConfusionMatrix({ matrix }) {
  const parties = matrix.map(r => r.actual);
  return (
    <section className="confusion-section">
      <p className="stats-section-heading">Verwechslungsmatrix</p>
      <div className="cm-wrap">
        <table className="cm-table">
          <thead>
            <tr>
              <th className="cm-th-corner">
                <div className="cm-th-corner-inner">
                  <span>Ist ↓</span>
                  <span>Geraten →</span>
                </div>
              </th>
              {parties.map(p => (
                <th key={p} className={`cm-th-col cm-th-col--${PARTY_CLASS[p] || ''}`}>
                  {SHORT_PARTY[p] ?? p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map(row => (
              <tr key={row.actual}>
                <td className={`cm-td-label cm-td-label--${PARTY_CLASS[row.actual] || ''}`}>
                  {row.actual}
                </td>
                {parties.map(guessed => {
                  const cell = row.guesses?.[guessed];
                  const pct = cell?.pct ?? 0;
                  const isCorrect = guessed === row.actual;
                  const cls = pct === 0
                    ? 'cm-td-cell cm-td-cell--zero'
                    : isCorrect
                      ? 'cm-td-cell cm-td-cell--correct'
                      : 'cm-td-cell cm-td-cell--wrong';
                  return (
                    <td
                      key={guessed}
                      className={cls}
                      style={{ '--i': pct / 100 }}
                      title={`${row.actual} → ${guessed}: ${pct}%`}
                    >
                      {pct > 0 ? `${pct}%` : '–'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
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

function PoliticianRow({ id, reference, rank, name, party, image, accuracy, variant }) {
  const cls = PARTY_CLASS[party] || '';
  const linkTarget = reference || id;
  const inner = (
    <>
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
      {linkTarget && <span className="politician-row__chevron">›</span>}
    </>
  );

  if (linkTarget) {
    return (
      <Link to={`/politicians/${linkTarget}`} className={`politician-row politician-row--${cls} politician-row--link`}>
        {inner}
      </Link>
    );
  }
  return (
    <div className={`politician-row politician-row--${cls}`}>
      {inner}
    </div>
  );
}

function PoliticianSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetch(`${API}/politicians/search/?q=${encodeURIComponent(query.trim())}`)
        .then(r => r.json())
        .then(d => { setResults(d); setLoading(false); })
        .catch(() => { setResults([]); setLoading(false); });
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const showResults = query.trim().length >= 2;

  return (
    <div className="pol-search">
      <div className="pol-search__input-wrap">
        <span className="pol-search__icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 9L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          className="pol-search__input"
          type="search"
          placeholder="Politiker suchen…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {loading && <span className="pol-search__spinner" aria-hidden="true" />}
      </div>

      {showResults && (
        <div className="pol-search__results" role="list">
          {results.length === 0 && !loading && (
            <p className="pol-search__empty">Keine Ergebnisse für „{query.trim()}"</p>
          )}
          {results.map(p => {
            const cls = PARTY_CLASS[p.party] || '';
            return (
              <Link
                key={p.reference}
                to={`/politicians/${p.reference}`}
                className="pol-search__result"
                role="listitem"
              >
                <div className="pol-search__avatar">
                  {p.image
                    ? <img src={p.image} alt={p.name} />
                    : <span className="pol-search__avatar-placeholder" />
                  }
                </div>
                <div className="pol-search__meta">
                  <span className="pol-search__name">{p.name}</span>
                  <span className="pol-search__parliament">{p.parliament}</span>
                </div>
                <span className={`party-tag party-tag--${cls}`}>{p.party}</span>
                <span className="pol-search__arrow" aria-hidden="true">›</span>
              </Link>
            );
          })}
        </div>
      )}
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

      <PoliticianSearch />

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

          {data.confusion_matrix?.length > 0 && (
            <ConfusionMatrix matrix={data.confusion_matrix} />
          )}

          {data.top_correct.length > 0 && (
            <section className="politician-section">
              <p className="stats-section-heading">Oft richtig geraten</p>
              <div className="politician-list">
                {data.top_correct.map((p, i) => (
                  <PoliticianRow key={p.id ?? i} rank={i + 1} {...p} variant="correct" />
                ))}
              </div>
            </section>
          )}

          {data.top_wrong.length > 0 && (
            <section className="politician-section">
              <p className="stats-section-heading">Oft falsch geraten</p>
              <div className="politician-list">
                {data.top_wrong.map((p, i) => (
                  <PoliticianRow key={p.id ?? i} rank={i + 1} {...p} variant="wrong" />
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
      <AppPromoCards />

      <footer className="page-footer">
        <Link to="/datenschutz" className="page-footer__link">Datenschutz</Link>
      </footer>
    </main>
  );
}
