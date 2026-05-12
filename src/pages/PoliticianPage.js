import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppBrand from '../components/AppBrand';
import LegalFooter from '../components/LegalFooter';
import SettingsMenu from '../components/SettingsMenu';
import { useCountry, useI18n, usePartyHelpers } from '../context/AppContext';
import { countryApiUrl } from '../lib/api';

function AccuracyRing({ accuracy, subtitle }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const filled = (accuracy / 100) * circumference;

  return (
    <div className="accuracy-ring">
      <svg viewBox="0 0 100 100" className="accuracy-ring__svg" aria-hidden="true">
        <circle cx="50" cy="50" r={r} className="accuracy-ring__track" />
        <circle
          cx="50"
          cy="50"
          r={r}
          className="accuracy-ring__fill"
          strokeDasharray={`${filled} ${circumference}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="accuracy-ring__label">
        <span className="accuracy-ring__value">{accuracy}%</span>
        <span className="accuracy-ring__sub">{subtitle}</span>
      </div>
    </div>
  );
}

function ConfusionBar({ party, count, percentage, isCorrect, partyLabel, partySlug, t }) {
  const cls = partySlug(party);

  return (
    <div className={`confusion-bar${isCorrect ? ' confusion-bar--correct' : ''}`}>
      <div className="confusion-bar__meta">
        <div className="confusion-bar__left">
          <span className={`party-tag party-tag--${cls}`}>{partyLabel(party)}</span>
          {isCorrect && <span className="confusion-bar__correct-badge">{t('politician.correct')}</span>}
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

function AttributionRow({ label, value, href, actionLabel }) {
  if (!value && !href) {
    return null;
  }

  return (
    <div className="attribution-card__row">
      <span className="attribution-card__label">{label}</span>
      <div className="attribution-card__value-wrap">
        {value && <span className="attribution-card__value">{value}</span>}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="attribution-card__link"
          >
            {actionLabel}
          </a>
        )}
      </div>
    </div>
  );
}

export default function PoliticianPage() {
  const { id } = useParams();
  const country = useCountry();
  const { t } = useI18n();
  const { partyLabel, partySlug } = usePartyHelpers();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setData(null);

    fetch(countryApiUrl(country.slug, `/politicians/${id}/stats/`))
      .then((response) => {
        if (response.status === 404) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        if (!response.ok) {
          throw new Error('politician stats failed');
        }
        return response.json();
      })
      .then((payload) => {
        if (payload) {
          setData(payload);
          setLoading(false);
        }
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [country.slug, id]);

  const cls = data ? partySlug(data.party) : '';
  const hasStructuredAttribution = Boolean(
    data?.author_name ||
      data?.author_url ||
      data?.license_short_name ||
      data?.license_url ||
      data?.image_page_url ||
      data?.credit_text ||
      data?.credit_url
  );

  return (
    <main className="politician-page">
      <header className="stats-header">
        <div className="stats-header__top">
          <AppBrand subtitle={t('politician.subtitle')} />
          <SettingsMenu buildCountryHref={(slug) => `/${slug}/stats`} />
        </div>
        <div className="stats-header__actions">
          <Link to={`/${country.slug}/stats`} className="stats-back-btn">
            ← {t('nav.backToStats')}
          </Link>
        </div>
      </header>

      {loading && (
        <div className="stats-loading">
          <span>{t('common.loading')}</span>
        </div>
      )}

      {notFound && (
        <div className="error-state">
          <span className="error-state__icon">⚠️</span>
          <p>{t('politician.notFound')}</p>
          <Link to={`/${country.slug}/stats`} className="btn-retry">
            {t('nav.backToStats')}
          </Link>
        </div>
      )}

      {data && (
        <>
          <div className={`pol-hero pol-hero--${cls}`}>
            <div className="pol-hero__photo-wrap">
              {data.image ? (
                <>
                  <img src={data.image} alt="" className="politician-card__photo-bg" aria-hidden="true" />
                  <img src={data.image} alt={data.name} className="politician-card__photo" />
                </>
              ) : (
                <div className="politician-card__photo-placeholder">👤</div>
              )}
              <div className="politician-card__gradient" />
              <div className="pol-hero__party-badge">
                <span className={`party-tag party-tag--${cls}`}>{partyLabel(data.party)}</span>
              </div>
            </div>
            <div className="pol-hero__info">
              <h2 className="pol-hero__name">{data.name}</h2>
              <p className="pol-hero__parliament">{data.parliament}</p>
            </div>
          </div>

          <div className="pol-stats-row">
            <AccuracyRing accuracy={data.accuracy} subtitle={t('stats.accuracy')} />
            <div className="pol-stat-card">
              <span className="pol-stat-card__value">{data.total_answers.toLocaleString()}</span>
              <span className="pol-stat-card__label">{t('politician.answers')}</span>
            </div>
          </div>

          <section className="pol-confusion">
            <p className="stats-section-heading">{t('politician.guessedAs')}</p>
            <div className="pol-confusion__list">
              {[...data.confusion]
                .sort((left, right) => right.percentage - left.percentage)
                .map((entry) => (
                  <ConfusionBar
                    key={entry.party}
                    {...entry}
                    isCorrect={entry.party === data.party}
                    partyLabel={partyLabel}
                    partySlug={partySlug}
                    t={t}
                  />
                ))}
            </div>
          </section>

          <section className="pol-attribution">
            <p className="stats-section-heading">{t('politician.imageAttribution')}</p>
            <div className="attribution-card">
              {hasStructuredAttribution ? (
                <>
                  <AttributionRow
                    label={t('politician.author')}
                    value={data.author_name}
                    href={data.author_url}
                    actionLabel={t('politician.open')}
                  />
                  <AttributionRow
                    label={t('politician.license')}
                    value={data.license_short_name}
                    href={data.license_url}
                    actionLabel={t('politician.open')}
                  />
                  <AttributionRow
                    label={t('politician.sourceImage')}
                    href={data.image_page_url}
                    actionLabel={t('politician.open')}
                  />
                  <AttributionRow
                    label={t('politician.credit')}
                    value={data.credit_text}
                    href={data.credit_url}
                    actionLabel={t('politician.open')}
                  />
                </>
              ) : (
                <p className="attribution-card__empty">{t('politician.attributionMissing')}</p>
              )}

              {data.full_party && data.full_party !== data.party && (
                <AttributionRow
                  label={t('politician.rawParty')}
                  value={data.full_party}
                  actionLabel={t('politician.open')}
                />
              )}

              {data.attribution_text && (
                <p className="attribution-card__text">{data.attribution_text}</p>
              )}
            </div>
          </section>
        </>
      )}

      <LegalFooter country={country.slug} />
    </main>
  );
}
