import { AnimatePresence, motion } from 'framer-motion';
import './Toast.css';

// Stacked achievement-unlock toasts. `toasts` is an array of
// { id, icon, title, desc }; the parent removes them on a timer.
export default function Toast({ toasts }) {
  return (
    <div className="toast-stack" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.key}
            className="toast glass"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <span className="toast-icon" aria-hidden="true">
              {t.icon}
            </span>
            <div className="toast-body">
              <span className="toast-kicker">Achievement unlocked</span>
              <span className="toast-title">{t.title}</span>
              <span className="toast-desc">{t.desc}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
