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
  const undoRef = useRef([]);
  const redoRef = useRef([]);

  const toggleCell = (i, vol, addHistory = true) => {
    if (selectedSound === -1) return;
    let newVol;
    setPattern((pattern) => {
      newVol = vol === 0 ? 1 : 0;
      let newPattern = pattern.map((cell) => [...cell]);
      newPattern[i][selectedSound] = newVol;
      return newPattern;
    });
    if (addHistory) {
      redoRef.current.length = 0;
      addToUndo('toggleCell', newVol, vol, i);
    }
  };

  const clearPattern = (one, addHistory = true) => {
    let prevPattern = pattern,
      newPattern;
    if (!one) {
      newPattern = INIT_PATTERN();
      setPattern(newPattern);
    } else {
      if (selectedSound === -1) return;
      newPattern = pattern.map((cell) => {
        let newCell = [...cell];
        newCell[selectedSound] = 0;
        return newCell;
      });
      setPattern(newPattern);
    }
    if (addHistory) {
      redoRef.current.length = 0;
      addToUndo('clearPattern', newPattern, prevPattern);
    }
  };

  const addToUndo = (type, newVal, prevVal, i) => {
    if (type === 'toggleCell') {
      undoRef.current.push([
        () => toggleCell(i, newVal, false),
        () => toggleCell(i, prevVal, false),
      ]);
    }
    if (type === 'clearPattern') {
      undoRef.current.push([
        () => setPattern([...prevVal], false),
        () => setPattern([...newVal], false),
      ]);
    }
  };

  const undo = () => {
    if (undoRef.current.length === 0) return;
    const [undoFunc, redoFunc] = undoRef.current.pop();
    undoFunc();
    redoRef.current.push([undoFunc, redoFunc]);
  };

  const redo = () => {
    if (redoRef.current.length === 0) return;
    const [undoFunc, redoFunc] = redoRef.current.pop();
    redoFunc();
    undoRef.current.push([undoFunc, redoFunc]);
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

  useEffect(() => {
    const printPattern = (e) => {
      console.log(e.code);
      if (e.code === 'KeyP') console.log(pattern);
    };
    document.addEventListener('keydown', printPattern);
    return () => document.removeEventListener('keydown', printPattern);
  }, [pattern]);

  return (
    <Pattern.Provider
      value={{
        pattern,
        setPattern,
        undo,
        redo,
        clearPattern,
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
