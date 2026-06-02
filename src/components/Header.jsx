import { motion } from 'framer-motion';
import { GiButterfly } from 'react-icons/gi';
import { FiSun, FiMoon, FiVolume2, FiVolumeX, FiSettings, FiBarChart2 } from 'react-icons/fi';
import './Header.css';

function IconButton({ label, onClick, children }) {
  return (
    <motion.button
      type="button"
      className="icon-btn glass"
      aria-label={label}
      title={label}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.92 }}
    >
      {children}
    </motion.button>
  );
}

export default function Header({
  theme,
  onToggleTheme,
  muted,
  onToggleMute,
  onOpenStats,
  onOpenSettings,
}) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-logo gradient-text" aria-hidden="true">
          <GiButterfly />
        </span>
        <span className="brand-name">
          Butterfly <span className="gradient-text">Clicker</span>
        </span>
      </div>

      <nav className="header-actions" aria-label="Game controls">
        <IconButton
          label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </IconButton>
        <IconButton label={muted ? 'Unmute sound' : 'Mute sound'} onClick={onToggleMute}>
          {muted ? <FiVolumeX /> : <FiVolume2 />}
        </IconButton>
        <IconButton label="View stats and achievements" onClick={onOpenStats}>
          <FiBarChart2 />
        </IconButton>
        <IconButton label="Open settings" onClick={onOpenSettings}>
          <FiSettings />
        </IconButton>
      </nav>
    </header>
  );
}
