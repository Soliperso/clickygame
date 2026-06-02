import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { DIFFICULTIES } from '../game/config.js';
import './SettingsPanel.css';

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="toggle-row">
      <span className="toggle-text">
        <span className="toggle-label">{label}</span>
        {hint && <span className="toggle-hint">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={checked ? 'switch on' : 'switch'}
        onClick={() => onChange(!checked)}
      >
        <span className="switch-knob" />
      </button>
    </label>
  );
}

export default function SettingsPanel({
  open,
  onClose,
  difficulty,
  onDifficulty,
  timed,
  onTimed,
  muted,
  onMuted,
  theme,
  onToggleTheme,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="settings-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            className="settings glass"
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="settings-head">
              <h2 className="settings-title">Settings</h2>
              <button type="button" className="settings-close" aria-label="Close settings" onClick={onClose}>
                <FiX />
              </button>
            </div>

            <div className="settings-group">
              <span className="group-label">Difficulty</span>
              <p className="group-hint">Changes the number of butterflies. Applies on the next game.</p>
              <div className="seg">
                {Object.entries(DIFFICULTIES).map(([key, preset]) => (
                  <button
                    key={key}
                    type="button"
                    className={key === difficulty ? 'seg-btn active' : 'seg-btn'}
                    aria-pressed={key === difficulty}
                    onClick={() => onDifficulty(key)}
                  >
                    {preset.label}
                    <span className="seg-meta">{preset.cards} cards</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-group">
              <Toggle
                label="Timed mode"
                hint="A countdown on every pick — beat the clock."
                checked={timed}
                onChange={onTimed}
              />
              <Toggle label="Sound effects" checked={!muted} onChange={(v) => onMuted(!v)} />
              <Toggle label="Dark theme" checked={theme === 'dark'} onChange={onToggleTheme} />
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
