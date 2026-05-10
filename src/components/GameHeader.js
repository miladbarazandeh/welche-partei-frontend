import { Link } from 'react-router-dom';

export default function GameHeader({ score, streak, best, spectrumAccuracy, totalAnswers, scorePop }) {
  const spectrumDisplay = totalAnswers > 0 && spectrumAccuracy != null
    ? `${Math.round(spectrumAccuracy)}%`
    : '—';

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__brand">
          <div className="header__flag" aria-hidden="true">
            <span /><span /><span />
          </div>
          <div className="header__titles">
            <h1 className="header__title">Welche Partei?</h1>
            <p className="header__subtitle">Politiker-Partei erraten</p>
          </div>
        </div>
        <div className="header__nav">
          <Link to="/stats" className="stats-nav-btn">Statistiken</Link>
          <a
            href="https://buymeacoffee.com/welche.partei"
            target="_blank"
            rel="noopener noreferrer"
            className="bmc-btn"
          >
            Support ☕
          </a>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          {scorePop && <span key={scorePop} className="score-pop">+1</span>}
          <span className="stat__value">{score}</span>
          <span className="stat__label">Score</span>
        </div>
        <div className="stat stat--streak">
          <span className="stat__value">{streak > 0 ? `🔥${streak}` : '—'}</span>
          <span className="stat__label">Serie</span>
        </div>
        <div className="stat">
          <span className="stat__value">{best}</span>
          <span className="stat__label">Rekord</span>
        </div>
        <div className="stat stat--spectrum">
          <span className="stat__value">{spectrumDisplay}</span>
          <span className="stat__label">Spektrum</span>
        </div>
      </div>
    </header>
  );
}
