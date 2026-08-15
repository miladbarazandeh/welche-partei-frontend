import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWelchePartei } from '../../context/WelcheParteiContext';
import { useI18n } from '../../context/AppContext';

function IconBarChart() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  );
}

function IconReset() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
    </svg>
  );
}

export default function WpHeader() {
  const { step, reset } = useWelchePartei();
  const { locale, setLocale, t } = useI18n();
  const [confirm, setConfirm] = useState(false);

  function handleReset() {
    if (!confirm) {
      setConfirm(true);
      setTimeout(() => setConfirm(false), 3000);
    } else {
      setConfirm(false);
      reset();
    }
  }

  return (
    <header className="wp-header">
      <div className="wp-header__inner">
        <Link to="/" className="wp-header__brand" onClick={() => setConfirm(false)}>
          {t('wp.header.brand')}
        </Link>

        <nav className="wp-header__nav">
          <Link to="/statistik" className="wp-header__nav-link" aria-label={t('wp.header.stats')}>
            <IconBarChart />
            <span>{t('wp.header.stats')}</span>
          </Link>

          <div className="wp-header__lang">
            <button
              className={`wp-header__lang-btn ${locale === 'de' ? 'wp-header__lang-btn--active' : ''}`}
              onClick={() => setLocale('de')}
              aria-label="Deutsch"
            >
              DE
            </button>
            <span className="wp-header__lang-sep">|</span>
            <button
              className={`wp-header__lang-btn ${locale === 'en' ? 'wp-header__lang-btn--active' : ''}`}
              onClick={() => setLocale('en')}
              aria-label="English"
            >
              EN
            </button>
          </div>

          {step > 0 && (
            <button
              className={`wp-header__reset ${confirm ? 'wp-header__reset--confirm' : ''}`}
              onClick={handleReset}
              aria-label={confirm ? t('wp.header.resetConfirm') : t('wp.header.reset')}
            >
              {confirm ? (
                t('wp.header.resetConfirm')
              ) : (
                <>
                  <IconReset />
                  <span>{t('wp.header.reset')}</span>
                </>
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
