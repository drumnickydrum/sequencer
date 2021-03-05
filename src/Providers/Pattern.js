import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  INIT_PATTERN,
  INIT_ONE_PATTERN,
  analog,
} from '../defaults/defaultSequences';
import { Undo } from './UndoProvider';
import { useStateAndRef } from '../utils/useStateAndRef';
import { Kit } from './Kit';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { addToPatternUndo, undoingRef } = useContext(Undo);
  const { setRefreshAll } = useContext(Kit);

  const [selectedSound, setSelectedSound] = useState(-1);

  const patternRef = useRef(deepCopyPattern(analog.pattern));
  const prevPatternRef = useRef(deepCopyPattern(patternRef.current));

  const prevCellRef = useRef(null);
  const toggleEventsRef = useRef({});
  const toggleCell = (step) => {
    patternRef.current[step][selectedSound].on = !patternRef.current[step][
      selectedSound
    ].on;
  };

  const [cellMod, setCellMod, cellModRef] = useStateAndRef(null);
  const modStep = (newVal, step) => {
    patternRef.current[step][selectedSound].notes.forEach((note) => {
      if (cellModRef.current === 'pitch') note.pitch = newVal;
      if (cellModRef.current === 'velocity') note.velocity = newVal;
      if (cellModRef.current === 'length') note.length = newVal;
    });
  };

  const resetCellMods = (type) => {
    patternRef.current.forEach((step) => {
      step[selectedSound].notes.forEach((note) => {
        if (type === 'pitch') note.pitch = 24;
        if (type === 'velocity') note.velocity = 1;
        if (type === 'length') note.length = 1;
      });
    });
    setRefreshAll(true);
  };

  const [slicing, setSlicing, slicingRef] = useStateAndRef(false);
  const sliceStep = (step) => {
    let notes = patternRef.current[step][selectedSound].notes;
    const len = notes.length;
    if (len === 3) {
      notes = [notes[0]];
    } else {
      notes.push(notes[0]);
    }
  };

  const [copying, setCopying] = useState(false);
  const pastePattern = (sound) => {
    patternRef.current.forEach((step) => {
      step[sound].on = step[selectedSound].on;
      step[sound].notes = step[selectedSound].notes.map((note) => ({
        ...note,
      }));
    });
  };

  const clearPattern = (one) => {
    if (one) {
      if (selectedSound === -1) return;
      patternRef.current.forEach((step) => {
        step[selectedSound] = INIT_ONE_PATTERN();
      });
    } else {
      patternRef.current = INIT_PATTERN();
    }
    setRefreshAll(true);
  };

  // debugging
  useEffect(() => {
    const printPattern = (e) => {
      // console.log(e.code);
      if (e.code === 'KeyP') console.log(patternRef.current);
      if (e.code === 'Digit0') console.log(patternRef.current[0][0]);
    };
    document.addEventListener('keydown', printPattern);
    return () => document.removeEventListener('keydown', printPattern);
  }, [patternRef.current]);

  return (
    <Pattern.Provider
      value={{
        patternRef,
        prevCellRef,
        toggleEventsRef,
        toggleCell,
        selectedSound,
        setSelectedSound,
        cellMod,
        setCellMod,
        cellModRef,
        modStep,
        resetCellMods,
        slicing,
        setSlicing,
        slicingRef,
        sliceStep,
        copying,
        setCopying,
        pastePattern,
        clearPattern,
      }}
    >
      {children}
    </Pattern.Provider>
  );
};

const deepCopyStep = (step) => {
  return step.map((sound) => {
    let newNotes = sound.notes.map((note) => {
      return { ...note };
    });
    return { on: sound.on, notes: newNotes };
  });
};

const deepCopyPattern = (pattern) => {
  return pattern.map((step) => {
    return deepCopyStep(step);
  });
};
