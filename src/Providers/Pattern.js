import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import * as Tone from 'tone';
import { Kit } from './Kit';
import { INIT_PATTERN, analog } from './defaultSequences';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { setKit } = useContext(Kit);
  const [pattern, setPattern] = useState(analog.pattern);
  const [selectedSound, setSelectedSound] = useState(-1);
  const [events, setEvents] = useState({});
  const prevCellRef = useRef(null);
  const undoRef = useRef({ history: [], length: 0 });
  const redoRef = useRef({ history: [], length: 0 });

  const toggleCell = (i, vol, addHistory = true) => {
    if (selectedSound === -1) return;
    let newVol;
    setPattern((pattern) => {
      let newPattern = [...pattern];
      newVol = vol === 0 ? 1 : 0;
      newPattern[i][selectedSound] = newVol;
      return newPattern;
    });
    if (addHistory) addToUndo('toggleCell', i, newVol, vol);
  };

  const addToUndo = (type, i, newVol, prevVol) => {
    if (type === 'toggleCell') {
      undoRef.current.history.push([
        () => toggleCell(i, newVol, false),
        () => toggleCell(i, prevVol),
      ]);
      undoRef.current.length++;
    }
  };

  const undo = () => {
    if (undoRef.current.length === 0) return;
    const [undoFunc, redoFunc] = undoRef.current.history.pop();
    undoRef.current.length--;
    undoFunc();
    redoRef.current.history.push(redoFunc);
    redoRef.current.length++;
  };

  const redo = () => {
    if (redoRef.current.length === 0) return;
    const func = redoRef.current.history.pop();
    redoRef.current.length--;
    func();
  };

  const printPattern = () => console.log(pattern);

  const clearPattern = (sound) => {
    if (!sound) {
      setPattern(INIT_PATTERN());
    } else {
      if (selectedSound === -1) return;
      setPattern((pattern) => {
        let newPattern = [...pattern];
        newPattern.forEach((cell, i) => {
          cell[selectedSound] = 0;
          newPattern[i] = cell;
        });
        return newPattern;
      });
    }
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
        cell.classList.add('pulse');
        setTimeout(() => cell.classList.remove('pulse'), 0);
      } else {
        cell.classList.add('flash');
        setTimeout(() => cell.classList.remove('flash'), 0);
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
        undo,
        redo,
        clearPattern,
        printPattern,
        events,
        setEvents,
        prevCellRef,
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
