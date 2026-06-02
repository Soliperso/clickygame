import { useEffect, useReducer, useState } from 'react';
import confetti from 'canvas-confetti';

import butterflies from './cards.json';
import { gameReducer, initialState } from './game/reducer.js';
import { DIFFICULTIES, DEFAULT_DIFFICULTY, PEEK_MS, HINT_MS, levelParams } from './game/config.js';
import { ACHIEVEMENTS } from './game/achievements.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useSound } from './hooks/useSound.js';
import { useTheme } from './hooks/useTheme.js';
import { useStats } from './hooks/useStats.js';

import Header from './components/Header.jsx';
import Scoreboard from './components/Scoreboard.jsx';
import PowerupBar from './components/PowerupBar.jsx';
import Board from './components/Board.jsx';
import ResultModal from './components/ResultModal.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import StatsModal from './components/StatsModal.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';

import './App.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [theme, toggleTheme] = useTheme();

  // Persisted preferences.
  const [difficulty, setDifficulty] = useLocalStorage('bc.difficulty', DEFAULT_DIFFICULTY);
  const [timed, setTimed] = useLocalStorage('bc.timed', false);
  const [muted, setMuted] = useLocalStorage('bc.muted', false);

  const { stats, history, unlocked, evaluate, recordGame } = useStats();
  const playSound = useSound(muted);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [endSummary, setEndSummary] = useState({ score: 0, level: 1, isBestScore: false, isBestLevel: false });

  const startGame = () => dispatch({ type: 'START', pool: butterflies, difficulty, timed });

  const pushToasts = (ids) => {
    if (!ids.length) return;
    const items = ids.map((id) => {
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      return { key: `${id}-${Date.now()}`, icon: a.icon, title: a.title, desc: a.desc };
    });
    setToasts((prev) => [...prev, ...items]);
    items.forEach((it) =>
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.key !== it.key)), 4500)
    );
  };

  // React to game outcomes: sounds, confetti, achievements, records.
  useEffect(() => {
    if (!state.outcome) return;

    const runSnapshot = {
      level: state.level,
      score: state.score,
      maxStreak: state.maxStreak,
      livesLostThisRun: state.livesLostThisRun,
      cleanLevelStreak: state.cleanLevelStreak,
      difficulty: state.difficulty,
      timed: state.timed,
      powerTypesUsed: state.powerTypesUsed,
    };

    if (state.outcome === 'correct') {
      playSound('correct');
    } else if (state.outcome === 'levelup') {
      playSound('win');
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, scalar: 1 });
      pushToasts(evaluate({ ...runSnapshot, stats }));
    } else if (state.outcome === 'life-lost') {
      playSound('lose');
    } else if (state.outcome === 'over') {
      playSound('lose');
      const isBestScore = state.score > stats.bestScore;
      const isBestLevel = state.level > stats.bestLevel;
      setEndSummary({ score: state.score, level: state.level, isBestScore, isBestLevel });
      // Evaluate with games-played incremented so "play N games" can unlock now.
      const statsAfter = { ...stats, gamesPlayed: stats.gamesPlayed + 1 };
      pushToasts(evaluate({ ...runSnapshot, stats: statsAfter }));
      recordGame(runSnapshot);
    }

    dispatch({ type: 'CLEAR_OUTCOME' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.outcome]);

  // Transient power-up effects auto-clear.
  useEffect(() => {
    if (!state.peeking) return undefined;
    const id = setTimeout(() => dispatch({ type: 'CLEAR_PEEK' }), PEEK_MS);
    return () => clearTimeout(id);
  }, [state.peeking]);

  useEffect(() => {
    if (state.hintedId === null) return undefined;
    const id = setTimeout(() => dispatch({ type: 'CLEAR_HINT' }), HINT_MS);
    return () => clearTimeout(id);
  }, [state.hintedId]);

  const isIdle = state.status === 'idle';
  const isPlaying = state.status === 'playing';
  const activeDifficulty = isIdle ? difficulty : state.difficulty;
  const preset = DIFFICULTIES[activeDifficulty];

  return (
    <div className="app">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onOpenStats={() => setStatsOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="stage">
        <section className="intro">
          <h2 className="tagline">
            Click each butterfly <span className="gradient-text">exactly once</span>.
          </h2>
          <p className="subtitle">Clear the board to level up. Repeat one and you lose a life.</p>
        </section>

        <Scoreboard
          score={state.score}
          streak={state.streak}
          level={isIdle ? 1 : state.level}
          lives={isIdle ? preset.lives : state.lives}
          maxLives={preset.lives}
          cleared={state.clickedIds.length}
          goal={isIdle ? preset.cards : state.goal}
          difficultyLabel={preset.label}
        />

        {isPlaying && (
          <PowerupBar
            powerups={state.powerups}
            timed={state.timed}
            onUse={(key) => dispatch({ type: `USE_${key.toUpperCase()}` })}
          />
        )}

        <Board
          status={state.status}
          deck={state.deck}
          clickedIds={state.clickedIds}
          timed={state.timed}
          timer={isPlaying ? levelParams(state.difficulty, state.level).timer : 0}
          freezeNonce={state.freezeNonce}
          peeking={state.peeking}
          hintedId={state.hintedId}
          level={state.level}
          onPick={(id) => dispatch({ type: 'PICK', id })}
          onTimeout={() => dispatch({ type: 'TIMEOUT' })}
          onStart={startGame}
        />
      </main>

      <Footer />

      <ResultModal
        open={state.status === 'over'}
        score={state.score}
        level={state.level}
        isBestScore={endSummary.isBestScore}
        isBestLevel={endSummary.isBestLevel}
        onPlayAgain={startGame}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        difficulty={difficulty}
        onDifficulty={setDifficulty}
        timed={timed}
        onTimed={setTimed}
        muted={muted}
        onMuted={setMuted}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        stats={stats}
        history={history}
        unlocked={unlocked}
      />

      <Toast toasts={toasts} />
    </div>
  );
}
