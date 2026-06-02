import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiZap, FiAward, FiTrendingUp } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './Scoreboard.css';

// Smoothly counts up to `value` using a spring.
function AnimatedNumber({ value }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 140, damping: 22 });
  const rounded = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    mv.set(value);
  }, [mv, value]);

  return <motion.span>{rounded}</motion.span>;
}

function Stat({ icon, label, children }) {
  return (
    <div className="stat">
      <span className="stat-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{children}</span>
      </div>
    </div>
  );
}

export default function Scoreboard({
  score,
  streak,
  level,
  lives,
  maxLives,
  cleared,
  goal,
  difficultyLabel,
}) {
  const progress = goal > 0 ? Math.min(100, (cleared / goal) * 100) : 0;
  const hearts = Array.from({ length: maxLives }, (_, i) => i < lives);

  return (
    <div className="scoreboard glass">
      <div className="stats">
        <Stat icon={<FiAward />} label="Score">
          <AnimatedNumber value={score} />
        </Stat>
        <Stat icon={<FiTrendingUp />} label="Level">
          {level}
        </Stat>
        <Stat icon={<FiZap />} label="Streak">
          {streak}
          {streak > 1 && <span className="combo">×{streak}</span>}
        </Stat>
      </div>

      <div className="board-meta">
        <div className="lives" aria-label={`${lives} of ${maxLives} lives remaining`}>
          {hearts.map((full, i) =>
            full ? (
              <FaHeart key={i} className="heart full" />
            ) : (
              <FaRegHeart key={i} className="heart empty" />
            )
          )}
        </div>
        <span className="pill">{difficultyLabel}</span>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={cleared}
        aria-label="Board progress"
      >
        <motion.div
          className="progress-fill"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
