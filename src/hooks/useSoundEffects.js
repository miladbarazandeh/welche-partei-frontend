import { useCallback, useRef, useState } from 'react';

const MUTE_KEY = 'sound_muted';

function playTones(ctx, tones) {
  tones.forEach(({ freq, type = 'sine', start, duration, volume = 0.3 }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration + 0.01);
  });
}

export function useSoundEffects() {
  const [muted, setMuted] = useState(() => localStorage.getItem(MUTE_KEY) === '1');
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playCorrect = useCallback(() => {
    if (muted) return;
    try {
      playTones(getCtx(), [
        { freq: 523, start: 0, duration: 0.18 },
        { freq: 659, start: 0.12, duration: 0.22 },
      ]);
    } catch {}
  }, [muted, getCtx]);

  const playWrong = useCallback(() => {
    if (muted) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.29);
    } catch {}
  }, [muted, getCtx]);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      localStorage.setItem(MUTE_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  return { playCorrect, playWrong, muted, toggleMute };
}
