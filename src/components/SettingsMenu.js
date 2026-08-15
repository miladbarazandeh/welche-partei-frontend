import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRY_LIST, getCountryName } from '../config/gameConfig';
import { useCountry, useI18n, usePlayerName } from '../context/AppContext';
import { patchPlayerName } from '../lib/api';

const LANGUAGE_OPTIONS = [
  { value: 'de', label: 'DE' },
  { value: 'en', label: 'EN' },
];

export default function SettingsMenu({ buildCountryHref = (slug) => `/quiz/${slug}` }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const country = useCountry();
  const { locale, setLocale, t } = useI18n();
  const { playerName, setPlayerName } = usePlayerName();
  const [draftName, setDraftName] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setDraftName(playerName);
      setNameError('');
      setNameSaved(false);
    }
  }, [open, playerName]);

  const handleSaveName = async () => {
    const trimmed = draftName.trim();
    if (trimmed === playerName) return;
    if (trimmed.length >= 50) {
      setNameError(t('settings.playerNameError'));
      return;
    }
    setNameError('');
    try {
      await patchPlayerName(trimmed);
      setPlayerName(trimmed);
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 1500);
    } catch {
      setNameError(t('common.retry'));
    }
  };

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
            <p className="settings-panel__label">{t('settings.playerName')}</p>
            <div className="settings-name">
              <div className="settings-name__row">
                <input
                  type="text"
                  className="settings-name__input"
                  value={draftName}
                  onChange={(e) => {
                    setDraftName(e.target.value);
                    setNameError('');
                    setNameSaved(false);
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); }}
                  placeholder={t('settings.playerNamePlaceholder')}
                  maxLength={50}
                />
                {draftName.trim() !== playerName && (
                  <button
                    type="button"
                    className="settings-name__confirm"
                    onClick={handleSaveName}
                    aria-label={t('settings.playerNameSaved')}
                  >
                    ✓
                  </button>
                )}
              </div>
              {nameSaved && <span className="settings-name__saved">{t('settings.playerNameSaved')}</span>}
              {nameError && <span className="settings-name__error">{nameError}</span>}
            </div>
          </div>

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
