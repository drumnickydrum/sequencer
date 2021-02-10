import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import * as Tone from 'tone';
import { downtempo } from './defaultSequences';
import { Pattern } from './Pattern';

export const Sequencer = React.createContext();
export const SetSequencer = React.createContext();
export const SequencerProvider = ({ children }) => {
  const { scheduleCell } = useContext(Pattern);
  const [bpm, setBpm] = useState(downtempo.bpm);

  const step = useRef(0);

  useEffect(() => {
    document.addEventListener('keypress', keyPress);
    return () => document.removeEventListener('keypress', keyPress);
  });

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const start = useCallback(() => {
    if (Tone.Transport.state === 'started') return;
    const cells = document.querySelectorAll(`.cell`);
    Tone.Transport.scheduleRepeat((time) => {
      animateCell(time, cells[step.current]);
      scheduleCell(time, step);
    }, '16n');
    Tone.Transport.start();
  });

  const stop = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    step.current = 0;
  });

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
  document.removeEventListener('click', initialClick);
};
document.addEventListener('click', initialClick);

const animateCell = (time, cell) => {
  Tone.Draw.schedule(() => {
    cell.classList.remove('on');
    void cell.offsetWidth; // rm>offset>add to reset css animation
    cell.classList.add('on');
  }, time);
};
