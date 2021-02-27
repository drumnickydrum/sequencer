import React, { useState, useEffect, useRef, useContext } from 'react';
import * as Tone from 'tone';
import { init, analog } from './defaultSequences';
import { Pattern } from './Pattern';

export const Sequencer = React.createContext();
export const SetSequencer = React.createContext();
export const SequencerProvider = ({ children }) => {
  const { schedulePattern } = useContext(Pattern);
  const [bpm, setBpm] = useState(analog.bpm);
  const stepRef = useRef(0);

  useEffect(() => {
    document.addEventListener('keypress', keyPress);
    return () => document.removeEventListener('keypress', keyPress);
  });

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const start = () => {
    if (Tone.Transport.state === 'started') return;
    schedulePattern(stepRef);
    Tone.Transport.start();
  };

  const stop = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    stepRef.current = 0;
  };

  const keyPress = ({ code }) => {
    if (code === 'Space') {
      if (Tone.Transport.state === 'stopped') {
        start();
      } else {
        stop();
      }
    }
  };

  return (
    <SetSequencer.Provider value={{ setBpm, start, stop }}>
      <Sequencer.Provider value={{ bpm }}>{children}</Sequencer.Provider>
    </SetSequencer.Provider>
  );
};

const initialClick = async () => {
  await Tone.start();
  console.log('audio ready');
  document.dispatchEvent(new Event('getBufferDuration'));
  document.removeEventListener('click', initialClick);
};
document.addEventListener('click', initialClick);

Tone.getDestination().volume.value = -12;
