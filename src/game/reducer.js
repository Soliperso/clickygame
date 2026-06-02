import {
  DIFFICULTIES,
  BASE_POINTS,
  STARTING_POWERUPS,
  POWERUP_TYPES,
  levelParams,
} from './config.js';

// Immutable Fisher–Yates shuffle — never mutates the input array.
export function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(pool, count) {
  return shuffle(pool).slice(0, count);
}

function withPowerType(used, type) {
  return used.includes(type) ? used : [...used, type];
}

export const initialState = {
  status: 'idle', // 'idle' | 'playing' | 'over'
  difficulty: 'medium',
  timed: false,
  pool: [],
  level: 1,
  lives: 0,
  deck: [], // cards currently on the board (a shuffled subset of the pool)
  clickedIds: [], // ids picked so far on the current board
  score: 0, // cumulative across levels
  streak: 0, // consecutive correct picks (combo)
  goal: 0, // cards to clear the current board
  powerups: { ...STARTING_POWERUPS },
  peeking: false, // transient: reveal already-clicked cards
  hintedId: null, // transient: highlight a safe card
  freezeNonce: 0, // bump to extend the active countdown
  outcome: null, // effect signal: 'correct' | 'levelup' | 'life-lost' | 'over'
  // Per-run trackers used for achievements / records.
  maxStreak: 0,
  livesLostThisRun: 0,
  cleanLevelStreak: 0, // consecutive levels cleared without losing a life
  powerTypesUsed: [],
};

// Shared "lose a life" transition for wrong picks and timeouts.
function loseLife(state) {
  const lives = state.lives - 1;
  const base = {
    ...state,
    lives,
    streak: 0,
    livesLostThisRun: state.livesLostThisRun + 1,
    cleanLevelStreak: 0,
    hintedId: null,
    peeking: false,
  };

  if (lives <= 0) {
    return { ...base, lives: 0, status: 'over', outcome: 'over' };
  }
  // Survived — reset the current board and keep playing the same level.
  return {
    ...base,
    clickedIds: [],
    deck: buildDeck(state.pool, state.goal),
    outcome: 'life-lost',
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START': {
      const { pool, difficulty, timed } = action;
      const preset = DIFFICULTIES[difficulty];
      const { cards } = levelParams(difficulty, 1);
      return {
        ...initialState,
        status: 'playing',
        difficulty,
        timed,
        pool,
        level: 1,
        lives: preset.lives,
        deck: buildDeck(pool, cards),
        goal: cards,
        powerups: { ...STARTING_POWERUPS },
      };
    }

    case 'PICK': {
      if (state.status !== 'playing') return state;

      // Repeating a card costs a life.
      if (state.clickedIds.includes(action.id)) {
        return loseLife(state);
      }

      const clickedIds = [...state.clickedIds, action.id];
      const streak = state.streak + 1;
      const score = state.score + BASE_POINTS * streak * state.level;
      const maxStreak = Math.max(state.maxStreak, streak);

      // Board cleared → advance a level (game continues; no modal).
      if (clickedIds.length === state.goal) {
        const level = state.level + 1;
        const { cards } = levelParams(state.difficulty, level);
        const bonusType = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
        return {
          ...state,
          level,
          score,
          streak,
          maxStreak,
          clickedIds: [],
          goal: cards,
          deck: buildDeck(state.pool, cards),
          powerups: { ...state.powerups, [bonusType]: state.powerups[bonusType] + 1 },
          cleanLevelStreak: state.cleanLevelStreak + 1,
          hintedId: null,
          peeking: false,
          outcome: 'levelup',
        };
      }

      // Ordinary correct pick → reshuffle the same board.
      return {
        ...state,
        clickedIds,
        streak,
        score,
        maxStreak,
        deck: shuffle(state.deck),
        hintedId: null,
        outcome: 'correct',
      };
    }

    case 'TIMEOUT':
      if (state.status !== 'playing') return state;
      return loseLife(state);

    case 'USE_FREEZE': {
      // Only meaningful while timed; otherwise a no-op.
      if (state.status !== 'playing' || !state.timed || state.powerups.freeze <= 0) return state;
      return {
        ...state,
        powerups: { ...state.powerups, freeze: state.powerups.freeze - 1 },
        freezeNonce: state.freezeNonce + 1,
        powerTypesUsed: withPowerType(state.powerTypesUsed, 'freeze'),
      };
    }

    case 'USE_PEEK': {
      if (state.status !== 'playing' || state.powerups.peek <= 0) return state;
      return {
        ...state,
        powerups: { ...state.powerups, peek: state.powerups.peek - 1 },
        peeking: true,
        powerTypesUsed: withPowerType(state.powerTypesUsed, 'peek'),
      };
    }

    case 'USE_HINT': {
      if (state.status !== 'playing' || state.powerups.hint <= 0) return state;
      const safe = state.deck.filter((c) => !state.clickedIds.includes(c.id));
      if (safe.length === 0) return state;
      const pick = safe[Math.floor(Math.random() * safe.length)];
      return {
        ...state,
        powerups: { ...state.powerups, hint: state.powerups.hint - 1 },
        hintedId: pick.id,
        powerTypesUsed: withPowerType(state.powerTypesUsed, 'hint'),
      };
    }

    case 'CLEAR_PEEK':
      return state.peeking ? { ...state, peeking: false } : state;

    case 'CLEAR_HINT':
      return state.hintedId !== null ? { ...state, hintedId: null } : state;

    case 'CLEAR_OUTCOME':
      return state.outcome ? { ...state, outcome: null } : state;

    case 'RESET':
      return { ...initialState, difficulty: state.difficulty, timed: state.timed };

    default:
      return state;
  }
}
