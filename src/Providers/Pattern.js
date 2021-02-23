import React, { useState, useEffect, useContext, useCallback } from 'react';
import * as Tone from 'tone';
import { Kit } from './Kit';
import { init, analog } from './defaultSequences';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { setKit } = useContext(Kit);
  const [pattern, setPattern] = useState(analog.pattern);
  const [selectedSound, setSelectedSound] = useState(-1);
  const [events, setEvents] = useState({});

  const toggleCell = (i, vol) => {
    console.log('toggling: ', i, vol);
    console.log(selectedSound);
    if (selectedSound === -1) return;
    const newVol = vol === 1 ? 0.5 : vol === 0.5 ? 0 : 1;
    setPattern((pattern) => {
      let newPattern = [...pattern];
      newPattern[i][selectedSound] = newVol;
      return newPattern;
    });
  };

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
        setKit((kit) => {
          kit[sound].sampler.triggerAttack('C2', time, vol / 2);
          return kit;
        });
      }
    }
    step.current = step.current === pattern.length - 1 ? 0 : step.current + 1;
  });

  return (
    <Pattern.Provider
      value={{
        pattern,
        setPattern,
        events,
        setEvents,
        toggleCell,
        schedulePattern,
        selectedSound,
        setSelectedSound,
        scheduleCell,
      }}
    >
      {children}
    </Pattern.Provider>
  );
};
