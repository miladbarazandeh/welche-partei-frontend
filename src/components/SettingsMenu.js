import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRY_LIST, getCountryName } from '../config/gameConfig';
import { useCountry, useI18n } from '../context/AppContext';

const LANGUAGE_OPTIONS = [
  { value: 'de', label: 'DE' },
  { value: 'en', label: 'EN' },
];

export default function SettingsMenu({ buildCountryHref = (slug) => `/${slug}` }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const country = useCountry();
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="settings-menu" ref={menuRef}>
      <button
        type="button"
        className="settings-btn"
        aria-label={t('settings.open')}
        title={t('settings.open')}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden="true">⚙</span>
      </button>

      {open && (
        <div className="settings-panel" role="dialog" aria-label={t('settings.title')}>
          <div className="settings-panel__section">
            <p className="settings-panel__label">{t('settings.language')}</p>
            <div className="settings-panel__options">
              {LANGUAGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`settings-choice${
                    locale === option.value ? ' settings-choice--active' : ''
                  }`}
                  onClick={() => {
                    setLocale(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-panel__section">
            <p className="settings-panel__label">{t('settings.country')}</p>
            <div className="settings-panel__options settings-panel__options--stack">
              {COUNTRY_LIST.map((item) => (
                <Link
                  key={item.slug}
                  to={buildCountryHref(item.slug)}
                  className={`settings-country${
                    item.slug === country.slug ? ' settings-country--active' : ''
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span>{getCountryName(item.slug, locale)}</span>
                  {item.slug === country.slug && (
                    <span className="settings-country__current">{t('settings.current')}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
