import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { ACHIEVEMENTS } from '../game/achievements.js';
import './StatsModal.css';

const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

function timeAgo(ts) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function StatsModal({ open, onClose, stats, history, unlocked }) {
  const unlockedSet = new Set(unlocked);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="stats-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="stats-modal glass"
            role="dialog"
            aria-modal="true"
            aria-label="Stats and achievements"
            initial={{ scale: 0.9, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="stats-head">
              <h2 className="stats-title">Your Stats</h2>
              <button type="button" className="settings-close" aria-label="Close" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-tile">
                <span className="tile-value">{stats.gamesPlayed}</span>
                <span className="tile-label">Games</span>
              </div>
              <div className="stat-tile">
                <span className="tile-value">{stats.bestScore.toLocaleString()}</span>
                <span className="tile-label">Best score</span>
              </div>
              <div className="stat-tile">
                <span className="tile-value">{stats.bestLevel}</span>
                <span className="tile-label">Best level</span>
              </div>
              <div className="stat-tile">
                <span className="tile-value">{stats.bestStreak}</span>
                <span className="tile-label">Best streak</span>
              </div>
            </div>

            <h3 className="stats-subhead">
              Achievements <span className="muted">{unlockedSet.size}/{ACHIEVEMENTS.length}</span>
            </h3>
            <div className="achv-grid">
              {ACHIEVEMENTS.map((a) => {
                const got = unlockedSet.has(a.id);
                return (
                  <div key={a.id} className={got ? 'achv unlocked' : 'achv locked'} title={a.desc}>
                    <span className="achv-icon">{got ? a.icon : '🔒'}</span>
                    <span className="achv-text">
                      <span className="achv-title">{a.title}</span>
                      <span className="achv-desc">{a.desc}</span>
                    </span>
                  </div>
                );
              })}
            </div>

            <h3 className="stats-subhead">Recent games</h3>
            {history.length === 0 ? (
              <p className="empty">No games yet — start playing!</p>
            ) : (
              <ul className="history">
                {history.slice(0, 8).map((g, i) => (
                  <li key={i} className="history-row">
                    <span className="history-diff">{DIFF_LABEL[g.difficulty] ?? g.difficulty}</span>
                    <span className="history-meta">
                      Lv {g.level} · {g.score.toLocaleString()} pts
                    </span>
                    <span className="history-time">{timeAgo(g.ts)}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
