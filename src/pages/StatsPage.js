import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppBrand from '../components/AppBrand';
import AppPromoCards from '../components/AppPromoCards';
import LegalFooter from '../components/LegalFooter';
import SettingsMenu from '../components/SettingsMenu';
import { useCountry, useI18n, usePartyHelpers } from '../context/AppContext';
import { countryApiUrl } from '../lib/api';

function InsightCard({ value, label }) {
  return (
    <div className="insight-card">
      <span className="insight-card__value">{value}</span>
      <span className="insight-card__label">{label}</span>
    </div>
  );
}

function PartyBar({ party, total, correct, accuracy, partyLabel, partySlug }) {
  const cls = partySlug(party);

  return (
    <div className="party-bar">
      <div className="party-bar__meta">
        <span className={`party-bar__name party-bar__name--${cls}`}>{partyLabel(party)}</span>
        <div className="party-bar__right">
          <span className="party-bar__count">
            {correct.toLocaleString()}/{total.toLocaleString()}
          </span>
          <span className="party-bar__pct">{accuracy}%</span>
        </div>
      </div>
      <div className="party-bar__track">
        <div className={`party-bar__fill party-bar__fill--${cls}`} style={{ width: `${accuracy}%` }} />
      </div>
    </div>
  );
}

function ConfusionMatrix({ matrix, partyLabel, partyShortLabel, partySlug, t }) {
  const parties = matrix.map((row) => row.actual);

  return (
    <section className="confusion-section">
      <p className="stats-section-heading">{t('stats.matrix')}</p>
      <div className="cm-wrap">
        <table className="cm-table">
          <thead>
            <tr>
              <th className="cm-th-corner">
                <div className="cm-th-corner-inner">
                  <span>{t('stats.matrix.actual')}</span>
                  <span>{t('stats.matrix.guessed')}</span>
                </div>
              </th>
              {parties.map((party) => (
                <th
                  key={party}
                  className={`cm-th-col cm-th-col--${partySlug(party)}`}
                  title={partyLabel(party)}
                >
                  {partyShortLabel(party)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.actual}>
                <td className={`cm-td-label cm-td-label--${partySlug(row.actual)}`}>
                  {partyLabel(row.actual)}
                </td>
                {parties.map((guessed) => {
                  const cell = row.guesses?.[guessed];
                  const pct = cell?.pct ?? 0;
                  const isCorrect = guessed === row.actual;
                  const cls =
                    pct === 0
                      ? 'cm-td-cell cm-td-cell--zero'
                      : isCorrect
                        ? 'cm-td-cell cm-td-cell--correct'
                        : 'cm-td-cell cm-td-cell--wrong';

                  return (
                    <td
                      key={guessed}
                      className={cls}
                      style={{ '--i': pct / 100 }}
                      title={`${partyLabel(row.actual)} → ${partyLabel(guessed)}: ${pct}%`}
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

function ConfusionRow({ actual, guessed, count, partyLabel, partySlug }) {
  return (
    <div className="confusion-row">
      <span className={`party-tag party-tag--${partySlug(actual)}`}>{partyLabel(actual)}</span>
      <span className="confusion-row__arrow">→</span>
      <span className={`party-tag party-tag--${partySlug(guessed)}`}>{partyLabel(guessed)}</span>
      <span className="confusion-row__count">{count.toLocaleString()}×</span>
    </div>
  );
}

function PoliticianRow({
  countrySlug,
  reference,
  rank,
  name,
  party,
  image,
  accuracy,
  variant,
  partyLabel,
  partySlug,
}) {
  const cls = partySlug(party);
  const linkTarget = reference ? `/${countrySlug}/politicians/${reference}` : null;
  const inner = (
    <>
      <span className="politician-row__rank">{rank}</span>
      <div className="politician-row__avatar">
        {image ? <img src={image} alt={name} className="politician-row__img" /> : <span className="politician-row__img-placeholder" />}
      </div>
      <div className="politician-row__info">
        <span className="politician-row__name">{name}</span>
        <span className={`party-tag party-tag--${cls}`}>{partyLabel(party)}</span>
      </div>
      <span className={`politician-row__count politician-row__count--${variant}`}>{accuracy}%</span>
      {linkTarget && <span className="politician-row__chevron">›</span>}
    </>
  );

  if (linkTarget) {
    return (
      <Link to={linkTarget} className={`politician-row politician-row--${cls} politician-row--link`}>
        {inner}
      </Link>
    );
  }

  return <div className={`politician-row politician-row--${cls}`}>{inner}</div>;
}

function UserRow({ rank, name, correct, total, accuracy, isCurrentUser, t }) {
  return (
    <div className={`user-row${isCurrentUser ? ' user-row--current' : ''}`}>
      <span className="user-row__rank">{rank}</span>
      <div className="user-row__info">
        <span className="user-row__name">{isCurrentUser ? t('stats.you') : (name || '—')}</span>
      </div>
      <div className="user-row__scores">
        <span className="user-row__correct">{correct.toLocaleString()}<span className="user-row__secondary"> / {total.toLocaleString()}</span></span>
        <span className="user-row__secondary">{accuracy}%</span>
      </div>
    </div>
  );
}

function PoliticianSearch({ countrySlug, partyLabel, partySlug, t }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetch(countryApiUrl(countrySlug, `/politicians/search/?q=${encodeURIComponent(query.trim())}`))
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => {
          setResults([]);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [countrySlug, query]);

  const showResults = query.trim().length >= 2;

  return (
    <div className="pol-search">
      <div className="pol-search__input-wrap">
        <span className="pol-search__icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 9L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          className="pol-search__input"
          type="search"
          placeholder={t('stats.search')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {loading && <span className="pol-search__spinner" aria-hidden="true" />}
      </div>

      {showResults && (
        <div className="pol-search__results" role="list">
          {results.length === 0 && !loading && (
            <p className="pol-search__empty">{t('stats.noResults', { query: query.trim() })}</p>
          )}
          {results.map((politician) => (
            <Link
              key={politician.reference}
              to={`/${countrySlug}/politicians/${politician.reference}`}
              className="pol-search__result"
              role="listitem"
            >
              <div className="pol-search__avatar">
                {politician.image ? (
                  <img src={politician.image} alt={politician.name} />
                ) : (
                  <span className="pol-search__avatar-placeholder" />
                )}
              </div>
              <div className="pol-search__meta">
                <span className="pol-search__name">{politician.name}</span>
                <span className="pol-search__parliament">{politician.parliament}</span>
              </div>
              <span className={`party-tag party-tag--${partySlug(politician.party)}`}>
                {partyLabel(politician.party)}
              </span>
              <span className="pol-search__arrow" aria-hidden="true">›</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StatsPage() {
  const country = useCountry();
  const { t } = useI18n();
  const { partyLabel, partyShortLabel, partySlug } = usePartyHelpers();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(false);

    fetch(countryApiUrl(country.slug, '/global-stats/'), { credentials: 'include' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('global stats failed');
        }
        return response.json();
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [country.slug]);

  return (
    <main className="stats-page">
      <header className="stats-header">
        <div className="stats-header__top">
          <AppBrand subtitle={t('stats.subtitle')} />
          <SettingsMenu buildCountryHref={(slug) => `/${slug}/stats`} />
        </div>
        <div className="stats-header__actions">
          <Link to={`/${country.slug}`} className="stats-back-btn">
            ← {t('nav.backToGame')}
          </Link>
        </div>
      </header>

      <PoliticianSearch
        countrySlug={country.slug}
        partyLabel={partyLabel}
        partySlug={partySlug}
        t={t}
      />

      {loading && (
        <div className="stats-loading">
          <span>{t('stats.loading')}</span>
        </div>
      )}

      {error && (
        <div className="error-state">
          <span className="error-state__icon">⚠️</span>
          <p>{t('stats.error')}</p>
          <Link to={`/${country.slug}`} className="btn-retry">
            {t('nav.backToGame')}
          </Link>
        </div>
      )}

      {data && (
        <>
          <div className="insights-grid">
            <InsightCard value={data.total_answers.toLocaleString()} label={t('stats.answers')} />
            <InsightCard value={`${data.overall_accuracy}%`} label={t('stats.accuracy')} />
            <InsightCard value={data.unique_players.toLocaleString()} label={t('stats.players')} />
            <InsightCard value={data.global_best_streak} label={t('stats.bestStreak')} />
          </div>

          {data.spectrum_accuracy != null && (
            <section className="leaning-section">
              <p className="stats-section-heading">{t('stats.leftRight')}</p>
              <div className="leaning-summary">
                <div className="leaning-summary__global">
                  <span className="leaning-summary__value">{data.spectrum_accuracy}%</span>
                  <span className="leaning-summary__label">{t('stats.globalSpectrum')}</span>
                </div>
              </div>
              {data.leaning_stats && data.leaning_stats.length > 0 && (
                <div className="leaning-bars">
                  {data.leaning_stats.map((leaning) => (
                    <div key={leaning.leaning} className={`leaning-bar leaning-bar--${leaning.leaning}`}>
                      <div className="leaning-bar__header">
                        <span className="leaning-bar__name">
                          {leaning.leaning === 'left' ? t('stats.left') : t('stats.right')}
                        </span>
                        <div className="leaning-bar__stats">
                          <span className="leaning-bar__exact">
                            {t('stats.exact', { value: leaning.accuracy })}
                          </span>
                          <span className="leaning-bar__spectrum">
                            {t('stats.side', { value: leaning.spectrum_accuracy })}
                          </span>
                        </div>
                      </div>
                      <div className="party-bar__track">
                        <div
                          className={`party-bar__fill leaning-bar__fill--${leaning.leaning}`}
                          style={{ width: `${leaning.spectrum_accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="party-accuracy">
            <p className="stats-section-heading">{t('stats.byParty')}</p>
            {[...(data.party_stats || [])]
              .sort((left, right) => right.accuracy - left.accuracy)
              .map((party) => (
                <PartyBar
                  key={party.party}
                  {...party}
                  partyLabel={partyLabel}
                  partySlug={partySlug}
                />
              ))}
          </section>

          {data.confusion_matrix?.length > 0 && (
            <ConfusionMatrix
              matrix={data.confusion_matrix}
              partyLabel={partyLabel}
              partyShortLabel={partyShortLabel}
              partySlug={partySlug}
              t={t}
            />
          )}

          {data.top_correct?.length > 0 && (
            <section className="politician-section">
              <p className="stats-section-heading">{t('stats.topCorrect')}</p>
              <div className="politician-list">
                {data.top_correct.map((politician, index) => (
                  <PoliticianRow
                    key={politician.reference ?? index}
                    countrySlug={country.slug}
                    rank={index + 1}
                    variant="correct"
                    partyLabel={partyLabel}
                    partySlug={partySlug}
                    {...politician}
                  />
                ))}
              </div>
            </section>
          )}

          {data.top_wrong?.length > 0 && (
            <section className="politician-section">
              <p className="stats-section-heading">{t('stats.topWrong')}</p>
              <div className="politician-list">
                {data.top_wrong.map((politician, index) => (
                  <PoliticianRow
                    key={politician.reference ?? index}
                    countrySlug={country.slug}
                    rank={index + 1}
                    variant="wrong"
                    partyLabel={partyLabel}
                    partySlug={partySlug}
                    {...politician}
                  />
                ))}
              </div>
            </section>
          )}

          {data.top_users?.length > 0 && (
            <section className="politician-section">
              <p className="stats-section-heading">{t('stats.topUsers')}</p>
              <div className="politician-list">
                {data.top_users.map((user, index) => (
                  <UserRow
                    key={index}
                    rank={index + 1}
                    isCurrentUser={user.is_current_user}
                    t={t}
                    {...user}
                  />
                ))}
                {data.user_rank && !data.top_users.some((u) => u.is_current_user) && (
                  <UserRow
                    rank={data.user_rank.rank}
                    correct={data.user_rank.correct}
                    total={data.user_rank.total}
                    accuracy={data.user_rank.accuracy}
                    isCurrentUser
                    t={t}
                  />
                )}
              </div>
            </section>
          )}

          {data.confusion?.length > 0 && (
            <section className="confusion-section">
              <p className="stats-section-heading">{t('stats.confusions')}</p>
              <div className="confusion-list">
                {data.confusion.map((entry, index) => (
                  <ConfusionRow
                    key={index}
                    {...entry}
                    partyLabel={partyLabel}
                    partySlug={partySlug}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <AppPromoCards />
      <LegalFooter country={country.slug} />
    </main>
  );
}
