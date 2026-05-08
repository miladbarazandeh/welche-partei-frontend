import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import GameHeader from './components/GameHeader';
import GuessHistory from './components/GuessHistory';
import PartyGrid from './components/PartyGrid';
import PoliticianCard from './components/PoliticianCard';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const REVEAL_MS = 1800;

const DEFAULT_STATS = { score: 0, streak: 0, best: 0, spectrumAccuracy: null, totalAnswers: 0 };

export default function App() {
  const [politician, setPolitician] = useState(null);
  const [gameState, setGameState] = useState('loading');
  const [result, setResult] = useState(null);
  const [flashClass, setFlashClass] = useState('');
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [history, setHistory] = useState([]);
  const [scorePop, setScorePop] = useState(null);
  const nextTimer = useRef(null);

  const fetchPolitician = useCallback(async () => {
    setGameState('loading');
    setPolitician(null);
    setResult(null);
    setFlashClass('');

    try {
      const res = await fetch(`${API}/politicians/random/`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPolitician(data);
      setGameState('playing');
    } catch {
      setGameState('error');
    }
  }, []);

  // Load session stats, history and first politician on mount
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${API}/stats/`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setStats({
            score: data.score,
            streak: data.streak,
            best: data.best,
            spectrumAccuracy: data.spectrum_accuracy ?? null,
            totalAnswers: data.total_answers ?? 0,
          });
          setHistory(
            data.recent.map((a) => ({
              politician_name: a.politician_name,
              guessed_party: a.guessed_party,
              correct_party: a.correct_party,
              correct: a.is_correct,
            }))
          );
        }
      } catch {
        // non-fatal — proceed with defaults
      }
      fetchPolitician();
    };

    init();
    return () => clearTimeout(nextTimer.current);
  }, [fetchPolitician]);

  const handleGuess = useCallback(async (guessedParty) => {
    if (gameState !== 'playing' || !politician) return;
    setGameState('revealing');

    try {
      const res = await fetch(`${API}/answers/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ politician_id: politician.id, guessed_party: guessedParty }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      const roundResult = { ...data, guessed_party: guessedParty };
      setResult(roundResult);
      setFlashClass(data.correct ? 'politician-card--flash-correct' : 'politician-card--flash-wrong');

      // Stats come from server
      setStats({
        score: data.score,
        streak: data.streak,
        best: data.best,
        spectrumAccuracy: data.spectrum_accuracy ?? null,
        totalAnswers: data.total_answers ?? 0,
      });

      if (data.correct) {
        setScorePop(Date.now());
        setTimeout(() => setScorePop(null), 700);
      }

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
  }, [gameState, politician, fetchPolitician]);

  return (
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
          <p>Verbindung zum Server fehlgeschlagen.<br />Ist das Backend gestartet?</p>
          <button className="btn-retry" onClick={fetchPolitician}>Nochmal versuchen</button>
        </div>
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
        </>
      )}

      <footer className="page-footer">
        <Link to="/datenschutz" className="page-footer__link">Datenschutz</Link>
      </footer>
    </main>
  );
}
