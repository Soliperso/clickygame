import { useCallback, useEffect, useState } from 'react';

// Persisted state hook. Reads once on mount, writes back on change, and
// tolerates unavailable / blocked storage (private mode, quota) gracefully.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore write failures */
    }
  }, [key, value]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setValue, reset];
}
