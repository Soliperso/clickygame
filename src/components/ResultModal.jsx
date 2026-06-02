import { AnimatePresence, motion } from 'framer-motion';
import { FiRefreshCw, FiFlag } from 'react-icons/fi';
import './ResultModal.css';

export default function ResultModal({ open, score, level, isBestScore, isBestLevel, onPlayAgain }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-title"
        >
          <motion.div
            className="modal glass"
            initial={{ scale: 0.85, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <span className="modal-icon lose" aria-hidden="true">
              <FiFlag />
            </span>

            <h2 id="result-title" className="modal-title">
              Game Over
            </h2>
            <p className="modal-sub">Out of lives — but those butterflies never stood a chance.</p>

            <div className="modal-stats">
              <div className="modal-stat">
                <span className="modal-stat-value">{score.toLocaleString()}</span>
                <span className="modal-stat-label">Final score</span>
              </div>
              <div className="modal-stat">
                <span className="modal-stat-value">{level}</span>
                <span className="modal-stat-label">Level reached</span>
              </div>
            </div>

            {(isBestScore || isBestLevel) && (
              <p className="modal-best">
                🏆 New best {isBestScore && isBestLevel ? 'score & level' : isBestScore ? 'score' : 'level'}!
              </p>
            )}

            <motion.button
              type="button"
              className="modal-btn"
              onClick={onPlayAgain}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              autoFocus
            >
              <FiRefreshCw /> Play again
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
