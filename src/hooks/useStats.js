import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { newlyUnlocked } from '../game/achievements.js';

const EMPTY_STATS = {
  gamesPlayed: 0,
  bestScore: 0,
  bestLevel: 1,
  bestStreak: 0,
  totalScore: 0,
};

const HISTORY_CAP = 25;

// Persists aggregate stats, recent game history, and unlocked achievement ids.
// Exposes `evaluate` (returns newly-unlocked ids and stores them) and
// `recordGame` (folds a finished run into stats + history).
export function useStats() {
  const [stats, setStats] = useLocalStorage('bc.stats', EMPTY_STATS);
  const [history, setHistory] = useLocalStorage('bc.history', []);
  const [unlocked, setUnlocked] = useLocalStorage('bc.unlocked', []);

  // Check achievements against a full snapshot (the caller supplies `stats`, so
  // it can account for in-flight changes like the just-finished game). Returns
  // the ids unlocked by this call so the caller can surface toasts.
  const evaluate = useCallback(
    (snapshot) => {
      let gained = [];
      setUnlocked((prev) => {
        gained = newlyUnlocked(snapshot, prev);
        return gained.length ? [...prev, ...gained] : prev;
      });
      return gained;
    },
    [setUnlocked]
  );

  const recordGame = useCallback(
    (run) => {
      setStats((prev) => ({
        gamesPlayed: prev.gamesPlayed + 1,
        bestScore: Math.max(prev.bestScore, run.score),
        bestLevel: Math.max(prev.bestLevel, run.level),
        bestStreak: Math.max(prev.bestStreak, run.maxStreak),
        totalScore: prev.totalScore + run.score,
      }));
      setHistory((prev) =>
        [
          { ts: Date.now(), score: run.score, level: run.level, difficulty: run.difficulty },
          ...prev,
        ].slice(0, HISTORY_CAP)
      );
    },
    [setStats, setHistory]
  );

  return { stats, history, unlocked, evaluate, recordGame };
}
