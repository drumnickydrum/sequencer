import React, { useState, useEffect, useContext, useRef } from 'react';
import { INIT_PATTERN, INIT_ONE_PATTERN, analog } from './defaultSequences';
import { Undo } from './UndoProvider';
import { useStateAndRef } from '../utils/useStateAndRef';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { addToPatternUndo, undoingRef } = useContext(Undo);
  const [selectedSound, setSelectedSound] = useState(-1);
  const [pattern, setPattern, patternRef] = useStateAndRef(
    analog.pattern,
    deepCopyPattern
  );
  const prevPatternRef = useRef(deepCopyPattern(pattern));

  // add all pattern edits to undo
  useEffect(() => {
    if (!undoingRef.current) {
      addToPatternUndo(prevPatternRef.current, pattern, setPattern);
    } else {
      undoingRef.current = false;
    }
    prevPatternRef.current = deepCopyPattern(pattern);
  }, [pattern, undoingRef]);

  const [toggleEvents, setToggleEvents] = useState({});
  const prevCellRef = useRef(null);
  const toggleCell = (i) => {
    setPattern((pattern) => {
      let newPattern = deepCopyPattern(pattern);
      newPattern[i][selectedSound].on = !newPattern[i][selectedSound].on;
      return newPattern;
    });
  };

  const [cellMod, setCellMod, cellModRef] = useStateAndRef('');
  const modCell = (i, type, newVal) => {
    let newPattern = deepCopyPattern(pattern);
    newPattern[i][selectedSound].notes.forEach((note) => {
      if (type === 'pitch') note.pitch = newVal;
      if (type === 'velocity') note.velocity = newVal;
      if (type === 'length') note.length = newVal;
    });
    setPattern(newPattern);
  };
  const resetCellMods = (type) => {
    let newPattern = deepCopyPattern(pattern);
    newPattern.forEach((step) => {
      step[selectedSound].notes.forEach((note) => {
        if (type === 'pitch') note.pitch = 24;
        if (type === 'velocity') note.velocity = 1;
        if (type === 'length') note.length = 1;
      });
    });
    setPattern(newPattern);
  };

  const [slicing, setSlicing, slicingRef] = useStateAndRef(false);
  const sliceCell = (i) => {
    setPattern((pattern) => {
      let newPattern = deepCopyPattern(pattern);
      let notes = newPattern[i][selectedSound].notes;
      let len = notes.length;
      if (len === 3) {
        newPattern[i][selectedSound].notes = [notes[0]];
      } else {
        notes.push(notes[0]);
      }
      return newPattern;
    });
  };

  const [copying, setCopying] = useState(false);
  const pastePattern = (sound) => {
    let newPattern = deepCopyPattern(pattern);
    newPattern.forEach((step) => {
      const copiedSound = { ...step[selectedSound] };
      const notes = [...copiedSound.notes];
      notes.forEach((note) => ({ ...note }));
      step[sound] = { on: copiedSound.on, notes };
    });
    setPattern(newPattern);
  };

  const clearPattern = (one) => {
    let newPattern;
    if (!one) {
      newPattern = INIT_PATTERN();
      setPattern(newPattern);
    } else {
      if (selectedSound === -1) return;
      newPattern = deepCopyPattern(pattern);
      newPattern.forEach((step) => {
        step[selectedSound] = INIT_ONE_PATTERN();
      });
      setPattern(newPattern);
    }
  };

  // debugging
  useEffect(() => {
    const printPattern = (e) => {
      // console.log(e.code);
      if (e.code === 'KeyP') console.log(pattern);
      if (e.code === 'KeyR') console.log(patternRef.current);
      if (e.code === 'Digit0') console.log(pattern[0][0]);
    };
    document.addEventListener('keydown', printPattern);
    return () => document.removeEventListener('keydown', printPattern);
  }, [pattern]);

  return (
    <Pattern.Provider
      value={{
        pattern,
        setPattern,
        patternRef,
        clearPattern,
        slicing,
        setSlicing,
        slicingRef,
        sliceCell,
        copying,
        setCopying,
        pastePattern,
        toggleEvents,
        setToggleEvents,
        prevCellRef,
        toggleCell,
        selectedSound,
        setSelectedSound,
        cellMod,
        setCellMod,
        cellModRef,
        modCell,
        resetCellMods,
      }}
    >
      {children}
    </Pattern.Provider>
  );
};

const deepCopyPattern = (pattern) => {
  return pattern.map((step) => {
    return step.map((sound) => {
      let newNotes = sound.notes.map((note) => {
        return { ...note };
      });
      return { on: sound.on, notes: newNotes };
    });
  });
};
