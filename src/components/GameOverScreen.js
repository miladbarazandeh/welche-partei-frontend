import AppPromoCards from './AppPromoCards';

const BMC_URL = 'https://buymeacoffee.com/welche.partei';

function resetSession() {
  document.cookie = 'sessionid=; Max-Age=0; path=/;';
  window.location.reload();
}

export default function GameOverScreen({ stats }) {
  const accuracy = stats.spectrumAccuracy !== null ? Math.round(stats.spectrumAccuracy) : null;

  return (
    <div className="game-over">
      <div className="game-over__trophy">🏆</div>
      <h2 className="game-over__title">Alle Politiker erraten!</h2>
      <p className="game-over__subtitle">
        Du hast das komplette Bundestagsspiel durchgespielt. Respekt!
      </p>

      <div className="game-over__stats">
        <div className="game-over__stat">
          <span className="game-over__stat-value">{stats.score}</span>
          <span className="game-over__stat-label">Punkte</span>
        </div>
        <div className="game-over__stat">
          <span className="game-over__stat-value">{stats.best}</span>
          <span className="game-over__stat-label">Best Streak</span>
        </div>
        <div className="game-over__stat">
          <span className="game-over__stat-value">{stats.totalAnswers}</span>
          <span className="game-over__stat-label">Beantwortet</span>
        </div>
        {accuracy !== null && (
          <div className="game-over__stat">
            <span className="game-over__stat-value">{accuracy}%</span>
            <span className="game-over__stat-label">Genauigkeit</span>
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
          ☕ Kaffee spendieren
        </a>
        <button className="game-over__btn game-over__btn--reset" onClick={resetSession}>
          Neu starten
        </button>
      </div>

      <AppPromoCards />
    </div>
  );
}
