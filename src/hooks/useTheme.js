import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage.js';

// Theme controller: persists the choice and reflects it on <html data-theme>.
// Defaults to the OS preference on first visit.
function preferredTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('bc.theme', preferredTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return [theme, toggle];
}
