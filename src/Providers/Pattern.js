import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  INIT_PATTERN,
  INIT_ONE_PATTERN,
  analog,
} from '../defaults/defaultSequences';
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

  const iRef = useRef(null);
  useEffect(() => {
    if (!undoingRef.current) {
      addToPatternUndo(
        prevPatternRef.current,
        pattern,
        setPattern,
        iRef.current
      );
    } else {
      undoingRef.current = false;
    }
    prevPatternRef.current = deepCopyPattern(pattern);
    iRef.current = null;
  }, [pattern, undoingRef]);

  const [toggleEvents, setToggleEvents] = useState({});
  const prevCellRef = useRef(null);
  const toggleCell = (i) => {
    iRef.current = i;
    setPattern((pattern) => {
      let newPattern = deepCopyPattern(pattern);
      newPattern[i].sounds[selectedSound].on = !newPattern[i].sounds[
        selectedSound
      ].on;
      newPattern[i].updated++;
      return newPattern;
    });
  };

  const [cellMod, setCellMod, cellModRef] = useStateAndRef('');
  const modCell = (i, type, newVal) => {
    iRef.current = i;
    setPattern((pattern) => {
      let newPattern = deepCopyPattern(pattern);
      newPattern[i].sounds[selectedSound].notes.forEach((note) => {
        if (type === 'pitch') note.pitch = newVal;
        if (type === 'velocity') note.velocity = newVal;
        if (type === 'length') note.length = newVal;
      });
      newPattern[i].updated++;
      return newPattern;
    });
  };
  const resetCellMods = (type) => {
    setPattern((pattern) => {
      let newPattern = deepCopyPattern(pattern);
      newPattern.forEach((step) => {
        step.sounds[selectedSound].notes.forEach((note) => {
          if (type === 'pitch') note.pitch = 24;
          if (type === 'velocity') note.velocity = 1;
          if (type === 'length') note.length = 1;
        });
      });
    });
  };

  const [slicing, setSlicing, slicingRef] = useStateAndRef(false);
  const sliceCell = (i) => {
    iRef.current = i;
    setPattern((pattern) => {
      let newPattern = deepCopyPattern(pattern);
      let notes = newPattern[i].sounds[selectedSound].notes;
      let len = notes.length;
      if (len === 3) {
        newPattern[i].sounds[selectedSound].notes = [notes[0]];
      } else {
        notes.push(notes[0]);
      }
      newPattern[i].updated++;
      return newPattern;
    });
  };

  const [copying, setCopying] = useState(false);
  const pastePattern = (sound) => {
    let newPattern = deepCopyPattern(pattern);
    newPattern.forEach((step) => {
      const copiedSound = { ...step.sounds[selectedSound] };
      const notes = [...copiedSound.notes];
      notes.forEach((note) => ({ ...note }));
      step.sounds[sound] = { on: copiedSound.on, notes };
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
        step.sounds[selectedSound] = INIT_ONE_PATTERN();
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
      if (e.code === 'Digit0') console.log(pattern[0].sounds[0]);
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

export const deepCopyPattern = (pattern) => {
  return pattern.map((step) => {
    let newSounds = step.sounds.map((sound) => {
      let newNotes = sound.notes.map((note) => {
        return { ...note };
      });
      return { on: sound.on, notes: newNotes };
    });
    return { sounds: newSounds, updated: step.updated };
  });
};
