import React, { useState, useContext, useCallback } from 'react';
import * as Tone from 'tone';
import { Instrument } from './Instrument';
import { init, downtempo } from './defaultSequences';

export const Editor = React.createContext();
export const EditorProvider = ({ children }) => {
  const { setInstrument } = useContext(Instrument);
  const [pattern, setPattern] = useState(downtempo.pattern);
  const [selectedSound, setSelectedSound] = useState(-1);

  const schedulePattern = useCallback((step) => {
    const cells = document.querySelectorAll(`.cell`);
    Tone.Transport.scheduleRepeat((time) => {
      animateCell(time, cells[step.current]);
      scheduleCell(time, step);
    }, '16n');
  });

  const animateCell = useCallback((time, cell) => {
    Tone.Draw.schedule(() => {
      if (cell.classList.contains('on')) {
        cell.classList.remove('pulse');
        void cell.offsetWidth; // rm>offset>add to reset css animation
        cell.classList.add('pulse');
      } else {
        cell.classList.remove('flash');
        void cell.offsetWidth;
        cell.classList.add('flash');
      }
    }, time);
  });

  const scheduleCell = useCallback((time, step) => {
    for (const [sound, vol] of Object.entries(pattern[step.current])) {
      if (pattern[step.current][sound]) {
        setInstrument((instrument) => {
          instrument[sound].sampler.triggerAttack('C2', time, vol / 2);
          return instrument;
        });
      }
    }
    step.current = step.current === pattern.length - 1 ? 0 : step.current + 1;
  });

  return (
    <Editor.Provider
      value={{
        pattern,
        setPattern,
        schedulePattern,
        selectedSound,
        setSelectedSound,
        scheduleCell,
      }}
    >
      {children}
    </Editor.Provider>
  );
};
