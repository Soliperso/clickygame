// Total butterflies available in the pool (cards.json). Board size is capped here.
export const POOL_SIZE = 9;

// Difficulty presets. `cards` is the starting board size at level 1, `timer` is
// the starting per-pick countdown (seconds), and `lives` is how many mistakes
// are allowed before the run ends.
export const DIFFICULTIES = {
  easy: { label: 'Easy', cards: 4, timer: 6, lives: 5 },
  medium: { label: 'Medium', cards: 6, timer: 5, lives: 3 },
  hard: { label: 'Hard', cards: 9, timer: 4, lives: 2 },
};

export const DEFAULT_DIFFICULTY = 'medium';

// Base points per correct pick; scaled by streak (combo) and level.
export const BASE_POINTS = 10;

// Lower bound on the per-pick timer so high levels stay playable.
export const MIN_TIMER = 2;

export const POWERUP_TYPES = ['freeze', 'peek', 'hint'];
export const STARTING_POWERUPS = { freeze: 1, peek: 1, hint: 1 };

// Transient effect durations (ms).
export const PEEK_MS = 2500;
export const HINT_MS = 2000;
export const FREEZE_BONUS_SECONDS = 3;

// Per-level parameters. Card count grows by one each level up to the pool size;
// the timer shrinks toward MIN_TIMER so higher levels lean on speed.
export function levelParams(difficulty, level) {
  const preset = DIFFICULTIES[difficulty];
  const cards = Math.min(POOL_SIZE, preset.cards + (level - 1));
  const timer = Math.max(MIN_TIMER, +(preset.timer - (level - 1) * 0.3).toFixed(1));
  return { cards, timer };
}
