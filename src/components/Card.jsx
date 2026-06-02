import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import './Card.css';

export default function Card({ card, disabled, peeked, hinted, onPick }) {
  const classes = ['card', 'glass'];
  if (peeked) classes.push('peeked');
  if (hinted) classes.push('hinted');

  return (
    <motion.button
      type="button"
      layout
      className={classes.join(' ')}
      aria-label={peeked ? `${card.name} (already clicked)` : card.name}
      disabled={disabled}
      onClick={() => onPick(card.id)}
      whileHover={disabled ? undefined : { scale: 1.04, y: -4 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
    >
      <img className="card-img" src={card.image} alt="" loading="lazy" draggable="false" />
      <span className="card-shine" aria-hidden="true" />
      {peeked && (
        <span className="card-peek" aria-hidden="true">
          <FiCheck />
        </span>
      )}
    </motion.button>
  );
}
