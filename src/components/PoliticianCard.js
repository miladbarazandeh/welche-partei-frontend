export default function PoliticianCard({ politician, flashClass, result, gameState }) {
  if (!politician) {
    return (
      <div className="card-wrap">
        <div className="politician-card politician-card--skeleton">
          <div className="politician-card__photo-wrap" />
        </div>
      </div>
    );
  }

  const isRevealing = gameState === 'revealing' && result;

  return (
    <div className="card-wrap">
      <div
        className={[
          'politician-card',
          gameState === 'playing' ? 'politician-card--playing' : '',
          flashClass || '',
        ].join(' ')}
      >
        <div className="politician-card__photo-wrap">
          {politician.image_path ? (
            <>
              {/* Blurred background fills dead space for any aspect ratio */}
              <img
                className="politician-card__photo-bg"
                src={politician.image_path}
                alt=""
                aria-hidden="true"
              />
              <img
                className="politician-card__photo"
                src={politician.image_path}
                alt="Politiker"
              />
            </>
          ) : (
            <div className="politician-card__photo-placeholder">👤</div>
          )}

          {/* Subtle bottom vignette during gameplay */}
          <div className="politician-card__gradient" />

          {/* Result overlay — also reveals name/parliament for the first time */}
          {isRevealing && (
            <div
              className={`politician-card__result-overlay politician-card__result-overlay--${
                result.correct ? 'correct' : 'wrong'
              }`}
            >
              <span className="politician-card__result-icon">
                {result.correct ? '✓' : '✗'}
              </span>
              <span className="politician-card__result-name">{politician.name}</span>
              {politician.parliament && (
                <span className="politician-card__result-parliament">{politician.parliament}</span>
              )}
              {!result.correct && (
                <span className="politician-card__result-party">→ {result.correct_party}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
