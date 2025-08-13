import { useRef, useCallback } from 'react';
import * as Tone from 'tone';

export const useSound = (isEnabled: boolean) => {
  const synthRef = useRef<Tone.Synth | null>(null);

  const initializeSynth = useCallback(async () => {
    if (!synthRef.current && isEnabled) {
      await Tone.start();
      synthRef.current = new Tone.Synth().toDestination();
    }
  }, [isEnabled]);

  const playSound = useCallback(async (note: string, duration: string) => {
    if (!isEnabled) return;
    
    try {
      await initializeSynth();
      if (synthRef.current) {
        synthRef.current.triggerAttackRelease(note, duration);
      }
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [isEnabled, initializeSynth]);

  const playClick = useCallback(() => playSound('C4', '8n'), [playSound]);
  const playSpin = useCallback(() => playSound('C5', '4n'), [playSound]);
  const playWinner = useCallback(() => playSound('C6', '2n'), [playSound]);
  const playRangeSelected = useCallback(() => playSound('E5', '8n'), [playSound]);

  return {
    playClick,
    playSpin,
    playWinner,
    playRangeSelected
  };
};