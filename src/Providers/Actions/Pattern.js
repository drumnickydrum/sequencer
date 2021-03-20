import React, { useContext } from 'react';
import { PatternFunction } from '../Functions/Pattern';
import { Kit } from '../Kit';
import {
  PatternState,
  deepCopyPattern,
  initSound,
  initPattern,
} from '../State/Pattern';
import { Undo } from '../UndoProvider';

export const PatternAction = React.createContext();
export const PatternActionProvider = ({ children }) => {
  const { addToUndo } = useContext(Undo);
  const { kitRef, currentKit } = useContext(Kit);
  const {
    patternRef,
    selectedSound,
    modRef,
    patternId,
    patternName,
    patternBpm,
    clearOneDisabled,
    clearAllDisabled,
  } = useContext(PatternState);
  const { toggle, modifyFunc, reset, slice, paste, load, clear } = useContext(
    PatternFunction
  );

  const toggleCell = (step) => {
    const prevVal = {
      step,
      noteOn: patternRef.current[step][selectedSound].noteOn,
    };
    const newVal = { step, noteOn: !prevVal.noteOn };
    toggle(newVal, true);
    addToUndo(toggle, prevVal, newVal);
  };

  const modify = (prevModVal, newModVal, step) => {
    const prevVal = { type: modRef.current, modVal: prevModVal, step };
    const newVal = { type: modRef.current, modVal: newModVal, step };
    modifyFunc(newVal, true);
    addToUndo(modifyFunc, prevVal, newVal);
  };

  const resetMods = (type) => {
    const prevPattern = deepCopyPattern(patternRef.current);
    const newPattern = deepCopyPattern(patternRef.current);
    newPattern.forEach((step) => {
      step[selectedSound].notes.forEach((note) => {
        if (type === 'pitch') note.pitch = 24;
        if (type === 'velocity') note.velocity = 1;
        if (type === 'length') note.length = 1;
      });
    });
    const prevVal = {
      pattern: prevPattern,
      kit: kitRef.current.sounds[selectedSound][`${type}Mod`],
      type,
    };
    const newVal = { pattern: newPattern, kit: type === 'pitch' ? 0 : 1, type };
    reset(newVal, true);
    addToUndo(reset, prevVal, newVal);
  };

  const sliceStep = (step) => {
    const prevVal = { step, count: 2 };
    const newVal = { step, count: 1 };
    slice(newVal, true);
    addToUndo(slice, prevVal, newVal);
  };

  const pastePattern = (sound) => {
    const prevSoundPattern = [];
    const newSoundPattern = [];
    patternRef.current.forEach((step) => {
      prevSoundPattern.push({
        noteOn: step[sound].noteOn,
        notes: step[sound].notes.map((note) => ({ ...note })),
      });
      newSoundPattern.push({
        noteOn: step[selectedSound].noteOn,
        notes: step[selectedSound].notes.map((note) => ({ ...note })),
      });
    });
    const prevVal = { sound, soundPattern: prevSoundPattern };
    const newVal = { sound, soundPattern: newSoundPattern };
    paste(newVal, true);
    addToUndo(paste, prevVal, newVal);
  };

  const loadPattern = (newPattern, cb) => {
    const prevPattern = {
      _id: patternId,
      name: patternName,
      bpm: patternBpm,
      kit: currentKit,
      pattern: deepCopyPattern(patternRef.current),
    };
    const prevVal = { cb, pattern: prevPattern };
    const newVal = { cb, pattern: newPattern };

    load(newVal, true);
    addToUndo(load, prevVal, newVal);
  };

  const clearPattern = (one) => {
    const prevPattern = deepCopyPattern(patternRef.current);
    const newPattern = deepCopyPattern(patternRef.current);
    if (one) {
      if (selectedSound === -1) return;
      newPattern.forEach((step) =>
        step.forEach((sound, s) => {
          if (s === selectedSound) initSound(sound);
        })
      );
    } else {
      initPattern(newPattern);
    }
    const prevVal = {
      one,
      pattern: prevPattern,
      cod: clearOneDisabled,
      cad: clearAllDisabled,
    };
    const newVal = {
      one,
      pattern: newPattern,
      cod: true,
      cad: !one || prevVal.cad,
    };
    clear(newVal, true);
    addToUndo(clear, prevVal, newVal);
  };

  return (
    <PatternAction.Provider
      value={{
        toggleCell,
        modify,
        resetMods,
        sliceStep,
        pastePattern,
        loadPattern,
        clearPattern,
      }}
    >
      {children}
    </PatternAction.Provider>
  );
};
