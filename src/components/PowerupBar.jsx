import { motion } from 'framer-motion';
import { FiClock, FiEye, FiZap } from 'react-icons/fi';
import './PowerupBar.css';

const POWERUPS = [
  { key: 'freeze', label: 'Freeze', icon: <FiClock />, hint: '+3s on the clock' },
  { key: 'peek', label: 'Peek', icon: <FiEye />, hint: 'Reveal clicked cards' },
  { key: 'hint', label: 'Hint', icon: <FiZap />, hint: 'Glow a safe card' },
];

export default function PowerupBar({ powerups, timed, onUse }) {
  return (
    <div className="powerups" role="group" aria-label="Power-ups">
      {POWERUPS.map(({ key, label, icon, hint }) => {
        const count = powerups[key] ?? 0;
        // Freeze is only useful while timed.
        const disabled = count <= 0 || (key === 'freeze' && !timed);
        return (
          <motion.button
            key={key}
            type="button"
            className="powerup glass"
            disabled={disabled}
            onClick={() => onUse(key)}
            title={key === 'freeze' && !timed ? 'Freeze needs timed mode' : hint}
            aria-label={`${label} — ${count} left`}
            whileHover={disabled ? undefined : { y: -3 }}
            whileTap={disabled ? undefined : { scale: 0.93 }}
          >
            <span className="powerup-icon">{icon}</span>
            <span className="powerup-label">{label}</span>
            <span className="powerup-count">{count}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
