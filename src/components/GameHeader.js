import { Link } from 'react-router-dom';
import AppBrand from './AppBrand';
import SettingsMenu from './SettingsMenu';
import { useCountry, useI18n } from '../context/AppContext';
import { useSupportTreat } from '../hooks/useSupportTreat';

export default function GameHeader({ score, streak, best, spectrumAccuracy, totalAnswers, scorePop }) {
  const country = useCountry();
  const { t } = useI18n();
  const { emoji } = useSupportTreat();
  const spectrumDisplay =
    totalAnswers > 0 && spectrumAccuracy != null ? `${Math.round(spectrumAccuracy)}%` : t('common.notAvailable');

  return (
    <header className="header">
      <div className="header__top">
        <AppBrand subtitle={t('app.subtitle')} />
        <SettingsMenu />
      </div>

      <div className="header__actions">
        <Link to={`/quiz/${country.slug}/stats`} className="stats-nav-btn">{t('nav.stats')}</Link>
        <a
          href="https://buymeacoffee.com/welche.partei"
          target="_blank"
          rel="noopener noreferrer"
          className="bmc-btn"
        >
          {t('nav.support')} {emoji}
        </a>
      </div>

      <div className="stats">
        <div className="stat">
          {scorePop && <span key={scorePop} className="score-pop">+1</span>}
          <span className="stat__value">{score}</span>
          <span className="stat__label">{t('header.score')}</span>
        </div>
        <div className="stat stat--streak">
          <span className="stat__value">{streak > 0 ? `🔥${streak}` : t('common.notAvailable')}</span>
          <span className="stat__label">{t('header.streak')}</span>
        </div>
        <div className="stat">
          <span className="stat__value">{best}</span>
          <span className="stat__label">{t('header.best')}</span>
        </div>
        {country.supportsSpectrum && (
          <div className="stat stat--spectrum">
            <span className="stat__value">{spectrumDisplay}</span>
            <span className="stat__label">{t('header.spectrum')}</span>
          </div>
        )}
      </div>
    </header>
  );
}
