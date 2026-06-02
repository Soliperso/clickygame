import { useCallback, useRef } from 'react';

// Tiny Web Audio synthesiser — no audio asset files. Generates short tones for
// game events. The AudioContext is created lazily on first play (browsers
// require a user gesture before audio can start).
const PRESETS = {
  correct: { notes: [660, 880], duration: 0.12, type: 'triangle', gain: 0.08 },
  win: { notes: [523.25, 659.25, 783.99, 1046.5], duration: 0.16, type: 'sine', gain: 0.1 },
  lose: { notes: [311.13, 233.08, 174.61], duration: 0.22, type: 'sawtooth', gain: 0.07 },
};

export function useSound(muted) {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (name) => {
      if (muted) return;
      const preset = PRESETS[name];
      if (!preset) return;
      const ctx = getCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      preset.notes.forEach((freq, i) => {
        const start = now + i * preset.duration;
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = preset.type;
        osc.frequency.value = freq;
        env.gain.setValueAtTime(0, start);
        env.gain.linearRampToValueAtTime(preset.gain, start + 0.01);
        env.gain.exponentialRampToValueAtTime(0.0001, start + preset.duration);
        osc.connect(env).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + preset.duration);
      });
    },
    [muted, getCtx]
  );

  return play;
}
