import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import AppPromoCards from './components/AppPromoCards';
import GameHeader from './components/GameHeader';
import GameOverScreen from './components/GameOverScreen';
import GuessHistory from './components/GuessHistory';
import LegalFooter from './components/LegalFooter';
import PartyGrid from './components/PartyGrid';
import PoliticianCard from './components/PoliticianCard';
import SupportModal from './components/SupportModal';
import { useCountry, useI18n } from './context/AppContext';
import { useSoundEffects } from './hooks/useSoundEffects';
import { countryApiUrl, normalizeSessionStats } from './lib/api';

const REVEAL_MS = 1800;
const DEFAULT_STATS = {
  score: 0,
  streak: 0,
  best: 0,
  spectrumAccuracy: null,
  totalAnswers: 0,
};

export default function App() {
  const country = useCountry();
  const { t } = useI18n();
  const api = countryApiUrl(country.slug);
  const [politician, setPolitician] = useState(null);
  const [gameState, setGameState] = useState('loading');
  const [result, setResult] = useState(null);
  const [flashClass, setFlashClass] = useState('');
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [history, setHistory] = useState([]);
  const [scorePop, setScorePop] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const nextTimer = useRef(null);
  const { playCorrect, playWrong, muted, toggleMute } = useSoundEffects();

  const fetchPolitician = useCallback(async () => {
    setGameState('loading');
    setPolitician(null);
    setResult(null);
    setFlashClass('');

    try {
      const res = await fetch(`${api}/politicians/random/`, { credentials: 'include' });
      if (!res.ok) {
        throw new Error('random politician failed');
      }

      const data = await res.json();
      if (data.game_over) {
        setStats(normalizeSessionStats(data));
        setGameState('game_over');
      } else {
        setPolitician(data);
        setGameState('playing');
      }
    } catch {
      setGameState('error');
    }
  }, [api]);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${api}/stats/`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setStats(normalizeSessionStats(data));
          setHistory(
            (data.recent || []).map((answer) => ({
              politician_name: answer.politician_name,
              guessed_party: answer.guessed_party,
              correct_party: answer.correct_party,
              correct: answer.is_correct,
            }))
          );
        }
      } catch {
        // Keep defaults and try to load the next card.
      }

      fetchPolitician();
    };

    init();
    return () => clearTimeout(nextTimer.current);
  }, [api, fetchPolitician]);

  useEffect(() => {
    if (stats.totalAnswers >= 10 && !localStorage.getItem('support_modal_seen')) {
      setShowSupportModal(true);
    }
  }, [stats.totalAnswers]);

  const handleCloseSupport = () => {
    localStorage.setItem('support_modal_seen', '1');
    setShowSupportModal(false);
  };

  const handleGuess = useCallback(
    async (guessedParty) => {
      if (gameState !== 'playing' || !politician) {
        return;
      }

      setGameState('revealing');

      try {
        const res = await fetch(`${api}/answers/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ politician_id: politician.id, guessed_party: guessedParty }),
        });
        if (!res.ok) {
          throw new Error('answer submission failed');
        }

        const data = await res.json();
        const roundResult = { ...data, guessed_party: guessedParty };
        setResult(roundResult);
        setFlashClass(
          data.correct ? 'politician-card--flash-correct' : 'politician-card--flash-wrong'
        );

        if (data.correct) {
          playCorrect();
          setScorePop(Date.now());
          setTimeout(() => setScorePop(null), 700);
        } else {
          playWrong();
        }

        setStats(normalizeSessionStats(data));
        setHistory((prev) => [
          {
            politician_name: data.politician_name,
            guessed_party: guessedParty,
            correct_party: data.correct_party,
            correct: data.correct,
          },
          ...prev.slice(0, 19),
        ]);

        nextTimer.current = setTimeout(fetchPolitician, REVEAL_MS);
      } catch {
        setGameState('error');
      }
    },
    [api, gameState, politician, fetchPolitician, playCorrect, playWrong]
  );

  return (
    <>
      {showSupportModal && <SupportModal onClose={handleCloseSupport} />}

      <button
        className="sound-fab"
        onClick={toggleMute}
        aria-label={muted ? t('sound.enable') : t('sound.disable')}
        title={muted ? t('sound.enable') : t('sound.disable')}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      <main className="app">
        <GameHeader
          score={stats.score}
          streak={stats.streak}
          best={stats.best}
          spectrumAccuracy={stats.spectrumAccuracy}
          totalAnswers={stats.totalAnswers}
          scorePop={scorePop}
        />

        {gameState === 'error' ? (
          <div className="error-state">
            <span className="error-state__icon">⚠️</span>
            <p>{t('game.connectionError')}</p>
            <button className="btn-retry" onClick={fetchPolitician}>
              {t('common.retry')}
            </button>
          </div>
        ) : gameState === 'game_over' ? (
          <GameOverScreen stats={stats} />
        ) : (
          <>
            <PoliticianCard
              politician={politician}
              flashClass={flashClass}
              result={result}
              gameState={gameState}
            />
            <PartyGrid
              onGuess={handleGuess}
              result={result}
              disabled={gameState !== 'playing'}
            />
            <GuessHistory history={history} />
            <AppPromoCards />
          </>
        )}

        <LegalFooter country={country.slug} />
      </main>
    </>
  );
}
