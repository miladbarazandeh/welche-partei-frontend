import { Link } from 'react-router-dom';
import { useWelchePartei } from '../../context/WelcheParteiContext';
import { useI18n } from '../../context/AppContext';

function IconValues() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}

function IconPositions() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="6" x2="20" y2="6"/>
      <line x1="9" y1="12" x2="20" y2="12"/>
      <line x1="9" y1="18" x2="20" y2="18"/>
      <polyline points="3 6 4.5 7.5 6.5 5"/>
      <polyline points="3 12 4.5 13.5 6.5 11"/>
      <polyline points="3 18 4.5 19.5 6.5 17"/>
    </svg>
  );
}

function IconResult() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  );
}

function IconSources() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="13" y2="17"/>
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function WpLanding() {
  const { step, nextStep, reset, TOTAL_VALUES_STEPS, totalBlindSteps } = useWelchePartei();
  const { t } = useI18n();

  const hasProgress = step > 0;
  const totalSteps = TOTAL_VALUES_STEPS + totalBlindSteps;
  const progressPct = hasProgress ? Math.round((step / totalSteps) * 100) : 0;

  const flowSteps = [
    { Icon: IconValues,    label: t('wp.landing.flow.values.label'),    desc: t('wp.landing.flow.values.desc') },
    { Icon: IconPositions, label: t('wp.landing.flow.positions.label'), desc: t('wp.landing.flow.positions.desc') },
    { Icon: IconResult,    label: t('wp.landing.flow.result.label'),    desc: t('wp.landing.flow.result.desc') },
    { Icon: IconSources,   label: t('wp.landing.flow.sources.label'),   desc: t('wp.landing.flow.sources.desc') },
  ];

  return (
    <div className="wp-landing">
      <div className="wp-landing__main">
        <div className="wp-landing__intro">
          <div className="wp-landing__hero">
            <span className="wp-landing__eyebrow">
              <span className="wp-landing__eyebrow-dot" />
              {t('wp.landing.eyebrow')}
            </span>
            <h1 className="wp-landing__title">
              {t('wp.landing.title').split('\n').map((line, i) => (
                i === 0 ? <span key={i}>{line}<br /></span> : <span key={i}>{line}</span>
              ))}
            </h1>
            <p className="wp-landing__subtitle">
              {t('wp.landing.subtitle')}
            </p>
          </div>

        </div>

        <aside className="wp-landing__right">
          <div className="wp-landing__action-card">
            {hasProgress ? (
              <div className="wp-landing__resume">
                <div className="wp-landing__resume-header">
                  <span className="wp-landing__resume-label">{t('wp.landing.resume.label')}</span>
                  <span className="wp-landing__resume-pct">{progressPct}%</span>
                </div>
                <div className="wp-landing__resume-track">
                  <div className="wp-landing__resume-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="wp-landing__cta">
                  <button className="wp-btn wp-btn--primary wp-btn--lg" onClick={nextStep}>
                    <span>{t('wp.landing.continue')}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <button className="wp-btn wp-btn--ghost wp-btn--sm" onClick={reset}>
                    {t('wp.landing.restart')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="wp-landing__cta">
                <button className="wp-btn wp-btn--primary wp-btn--lg" onClick={nextStep}>
                  <span>{t('wp.landing.start')}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}

            <ul className="wp-landing__meta">
              <li className="wp-landing__meta-item"><IconClock />{t('wp.landing.meta.time')}</li>
              <li className="wp-landing__meta-item"><IconShield />{t('wp.landing.meta.anon')}</li>
              <li className="wp-landing__meta-item"><IconCheck />{t('wp.landing.meta.sources')}</li>
            </ul>
          </div>

          <div className="wp-landing__footer">
            <span className="wp-landing__divider" />
            <Link to="/statistik" className="wp-landing__quiz-link">
              {t('wp.landing.community')}
            </Link>
          </div>

          <div className="wp-landing__legal">
            <Link to="/datenschutz" className="wp-landing__legal-link">{t('wp.landing.privacy')}</Link>
            <span className="wp-landing__legal-sep">·</span>
            <Link to="/impressum" className="wp-landing__legal-link">{t('wp.landing.imprint')}</Link>
          </div>
        </aside>
      </div>

      <ol className="wp-landing__flow">
        {flowSteps.map(({ Icon, label, desc }, i) => (
          <li key={label} className="wp-landing__flow-step">
            <span className="wp-landing__flow-number" aria-hidden="true">0{i + 1}</span>
            <span className="wp-landing__flow-icon" aria-hidden="true">
              <Icon />
            </span>
            <span className="wp-landing__flow-copy">
              <span className="wp-landing__flow-label">{label}</span>
              <span className="wp-landing__flow-desc">{desc}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
