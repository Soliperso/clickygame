import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlay, FiClock } from 'react-icons/fi';
import Card from './Card.jsx';
import { FREEZE_BONUS_SECONDS } from '../game/config.js';
import './Board.css';

// Per-pick countdown. Remounts (via a `key` in the parent) whenever a pick is
// made, so the bar restarts from full each turn. `freezeNonce` bumps add time.
function CountdownBar({ seconds, freezeNonce, onTimeout }) {
  const [remaining, setRemaining] = useState(seconds);
  const deadlineRef = useRef(Date.now() + seconds * 1000);
  const firstNonce = useRef(freezeNonce);

  // Extend the deadline when a freeze power-up is used.
  useEffect(() => {
    if (freezeNonce !== firstNonce.current) {
      deadlineRef.current += FREEZE_BONUS_SECONDS * 1000;
      firstNonce.current = freezeNonce;
    }
  }, [freezeNonce]);

  useEffect(() => {
    const id = setInterval(() => {
      const left = Math.max(0, deadlineRef.current - Date.now()) / 1000;
      setRemaining(left);
      if (left <= 0) {
        clearInterval(id);
        onTimeout();
      }
    }, 50);
    return () => clearInterval(id);
  }, [onTimeout]);

  const pct = Math.max(0, Math.min(100, (remaining / seconds) * 100));
  const low = remaining <= seconds * 0.35;

  return (
    <div className="countdown" aria-hidden="true">
      <FiClock className={low ? 'countdown-icon low' : 'countdown-icon'} />
      <div className="countdown-track">
        <div className={low ? 'countdown-fill low' : 'countdown-fill'} style={{ width: `${pct}%` }} />
      </div>
      <span className={low ? 'countdown-num low' : 'countdown-num'}>{remaining.toFixed(1)}s</span>
    </div>
  );
}

export default function Board({
  status,
  deck,
  clickedIds,
  timed,
  timer,
  freezeNonce,
  peeking,
  hintedId,
  level,
  onPick,
  onTimeout,
  onStart,
}) {
  if (status === 'idle') {
    return (
      <div className="board-start glass">
        <p className="start-hint">
          Endless mode — clear the board to level up. Repeat a butterfly and you lose a life.
        </p>
        <motion.button
          type="button"
          className="start-btn"
          onClick={onStart}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <FiPlay /> Start game
        </motion.button>
      </div>
    );
  }

  const isPlaying = status === 'playing';
  const clicked = new Set(clickedIds);

  return (
    <div className="board-area">
      {timed && isPlaying && (
        <CountdownBar
          key={`${level}-${clickedIds.length}`}
          seconds={timer}
          freezeNonce={freezeNonce}
          onTimeout={onTimeout}
        />
      )}

      <motion.div className="board" layout>
        <AnimatePresence>
          {deck.map((card) => (
            <Card
              key={card.id}
              card={card}
              disabled={!isPlaying}
              peeked={peeking && clicked.has(card.id)}
              hinted={hintedId === card.id}
              onPick={onPick}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
