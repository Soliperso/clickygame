// Achievement definitions. Each `test` receives a snapshot that merges the
// finished/active run with persisted aggregate stats, and returns true once the
// achievement should unlock. Unlocks are evaluated on level-up and game-over.
//
// snapshot shape:
// {
//   level, score, maxStreak, livesLostThisRun, cleanLevelStreak,
//   difficulty, timed, powerTypesUsed: string[],
//   stats: { gamesPlayed, bestScore, bestLevel, bestStreak, totalScore }
// }
export const ACHIEVEMENTS = [
  {
    id: 'first-level',
    title: 'Taking Flight',
    desc: 'Clear your first level.',
    icon: '🦋',
    test: (s) => s.level >= 2,
  },
  {
    id: 'streak-8',
    title: 'On Fire',
    desc: 'Reach a combo streak of 8.',
    icon: '🔥',
    test: (s) => s.maxStreak >= 8,
  },
  {
    id: 'level-5',
    title: 'Survivor',
    desc: 'Reach level 5 in a single run.',
    icon: '🛡️',
    test: (s) => s.level >= 5,
  },
  {
    id: 'score-500',
    title: 'High Roller',
    desc: 'Score 500 points in one game.',
    icon: '💎',
    test: (s) => s.score >= 500,
  },
  {
    id: 'flawless-3',
    title: 'Flawless',
    desc: 'Clear 3 levels in a row without losing a life.',
    icon: '✨',
    test: (s) => s.cleanLevelStreak >= 3,
  },
  {
    id: 'hard-timed',
    title: 'Daredevil',
    desc: 'Clear a level on Hard with timed mode on.',
    icon: '⚡',
    test: (s) => s.difficulty === 'hard' && s.timed && s.level >= 2,
  },
  {
    id: 'power-player',
    title: 'Power Player',
    desc: 'Use all three power-ups in one run.',
    icon: '🎛️',
    test: (s) => ['freeze', 'peek', 'hint'].every((t) => s.powerTypesUsed.includes(t)),
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    desc: 'Play 10 games.',
    icon: '🏅',
    test: (s) => s.stats.gamesPlayed >= 10,
  },
];

// Returns the ids newly satisfied by `snapshot` that aren't already unlocked.
export function newlyUnlocked(snapshot, unlockedIds) {
  const have = new Set(unlockedIds);
  return ACHIEVEMENTS.filter((a) => !have.has(a.id) && a.test(snapshot)).map((a) => a.id);
}
