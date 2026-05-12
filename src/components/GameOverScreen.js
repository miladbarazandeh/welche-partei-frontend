import { useI18n } from '../context/AppContext';
import AppPromoCards from './AppPromoCards';

const BMC_URL = 'https://buymeacoffee.com/welche.partei';

function resetSession() {
  document.cookie = 'sessionid=; Max-Age=0; path=/;';
  window.location.reload();
}

export default function GameOverScreen({ stats }) {
  const { t } = useI18n();
  const accuracy = stats.spectrumAccuracy !== null ? Math.round(stats.spectrumAccuracy) : null;

  return (
    <div className="game-over">
      <div className="game-over__trophy">🏆</div>
      <h2 className="game-over__title">{t('game.over.title')}</h2>
      <p className="game-over__subtitle">{t('game.over.subtitle')}</p>

      <div className="game-over__stats">
        <div className="game-over__stat">
          <span className="game-over__stat-value">{stats.score}</span>
          <span className="game-over__stat-label">{t('game.over.points')}</span>
        </div>
        <div className="game-over__stat">
          <span className="game-over__stat-value">{stats.best}</span>
          <span className="game-over__stat-label">{t('game.over.best')}</span>
        </div>
        <div className="game-over__stat">
          <span className="game-over__stat-value">{stats.totalAnswers}</span>
          <span className="game-over__stat-label">{t('game.over.answered')}</span>
        </div>
        {accuracy !== null && (
          <div className="game-over__stat">
            <span className="game-over__stat-value">{accuracy}%</span>
            <span className="game-over__stat-label">{t('game.over.accuracy')}</span>
          </div>
        )}
      </div>

      <div className="game-over__actions">
        <a
          href={BMC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="game-over__btn game-over__btn--coffee"
        >
          ☕ {t('game.over.support')}
        </a>
        <button className="game-over__btn game-over__btn--reset" onClick={resetSession}>
          {t('game.over.restart')}
        </button>
      </div>

      <AppPromoCards />
    </div>
  );
}
