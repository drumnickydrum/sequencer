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
  const {
    undoRef,
    redoRef,
    refreshRef,
    undoingRef,
    addToStepUndo,
  } = useContext(Undo);
  const { setRefreshAll } = useContext(Kit);

  const [selectedSound, setSelectedSound] = useState(-1);

  const patternRef = useRef(deepCopyPattern(analog.pattern));

  const prevCellRef = useRef(null);
  const toggleEventsRef = useRef({});
  const toggleCell = (step) => {
    const cell = patternRef.current[step][selectedSound];
    function toggle(val) {
      cell.on = val;
    }
    const prevOn = cell.on;
    const newOn = !prevOn;
    toggle(newOn);
    if (!undoingRef.current) addToStepUndo(toggle, prevOn, newOn, step);
  };

  const [cellMod, setCellMod, cellModRef] = useStateAndRef(null);
  const modStep = (prevVal, newVal, step) => {
    const notes = patternRef.current[step][selectedSound].notes;
    const type = cellModRef.current;
    function modify(val) {
      notes.forEach((note) => {
        if (type === 'pitch') note.pitch = val;
        if (type === 'velocity') note.velocity = val;
        if (type === 'length') note.length = val;
      });
    }
    modify(newVal);
    if (!undoingRef.current) addToStepUndo(modify, prevVal, newVal, step);
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
    function slice(count) {
      const len = notes.length;
      const note = notes[0];
      if (len === 3) notes.length = 0;
      notes.push(note);
      if (count === 2) slice(1);
    }
    slice(1);
    if (!undoingRef.current) addToStepUndo(slice, 2, 1, step);
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
  });

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
