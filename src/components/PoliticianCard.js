import { useEffect, useState } from 'react';
import AttributionModal from './AttributionModal';
import { usePartyHelpers } from '../context/AppContext';

export default function PoliticianCard({ politician, flashClass, result, gameState, onAttributionOpen, onAttributionClose }) {
  const { partyLabel } = usePartyHelpers();
  const [showAttribution, setShowAttribution] = useState(false);
  const [pendingAttribution, setPendingAttribution] = useState(false);

  useEffect(() => {
    setShowAttribution(false);
    setPendingAttribution(false);
  }, [politician?.id]);

  useEffect(() => {
    if (pendingAttribution && result) {
      setShowAttribution(true);
      setPendingAttribution(false);
      onAttributionOpen?.();
    }
  }, [result, pendingAttribution, onAttributionOpen]);

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
  const hasAttribution =
    politician.author_name ||
    politician.license_short_name ||
    politician.license_url ||
    politician.image_page_url;

  return (
    <>
      {showAttribution && (
        <AttributionModal
          politician={politician}
          answered={!!result || gameState === 'revealing'}
          onClose={() => {
            setShowAttribution(false);
            if (isRevealing) {
              onAttributionClose?.();
            } else {
              setPendingAttribution(true);
            }
          }}
        />
      )}
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
                  alt={politician.name}
                />
              </>
            ) : (
              <div className="politician-card__photo-placeholder">👤</div>
            )}

            {/* Subtle bottom vignette during gameplay */}
            <div className="politician-card__gradient" />

            {hasAttribution && (
              <button
                className="politician-card__attribution-btn"
                onClick={() => {
                  setShowAttribution(true);
                  onAttributionOpen?.();
                }}
                aria-label="Image attribution"
              >
                ©
              </button>
            )}

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
                  <span className="politician-card__result-party">
                    → {partyLabel(result.correct_party)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
