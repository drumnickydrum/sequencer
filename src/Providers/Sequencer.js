import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import * as Tone from 'tone';
import { downtempo } from './patterns';
import { SetSamplers } from './Samplers';

export const Sequencer = React.createContext();
export const SetSequencer = React.createContext();
export const SequencerProvider = ({ children }) => {
  const setSamplers = useContext(SetSamplers);
  const [pattern, setPattern] = useState(downtempo.pattern);
  const [bpm, setBpm] = useState(downtempo.bpm);

  const step = useRef(0);

  useEffect(() => {
    document.addEventListener('keypress', keyPress);
    return () => document.removeEventListener('keypress', keyPress);
  });

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const play = useCallback(() => {
    if (Tone.Transport.state === 'started') return;
    Tone.Transport.scheduleRepeat(playCell, '16n');
    Tone.Transport.start();
  });

  const stop = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    step.current = 0;
  });

  const playCell = (time) => {
    for (const [inst, vol] of Object.entries(pattern[step.current])) {
      if (pattern[step.current][inst]) {
        setSamplers((samplers) => {
          samplers[inst].triggerAttack('C2', time, vol / 2);
          return samplers;
        });
      }
    }
    step.current = step.current === pattern.length - 1 ? 0 : step.current + 1;
  };

  const keyPress = ({ code }) => {
    if (code === 'Space') {
      if (Tone.Transport.state === 'stopped') {
        play();
      } else {
        stop();
      }
    }
  };

  return (
    <SetSequencer.Provider value={{ setPattern, setBpm, play, stop }}>
      <Sequencer.Provider value={{ bpm }}>{children}</Sequencer.Provider>
    </SetSequencer.Provider>
  );
};

const initialClick = async () => {
  await Tone.start();
  console.log('audio ready');
};
document.addEventListener('click', initialClick);
