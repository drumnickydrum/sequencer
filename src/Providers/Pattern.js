import React, { useState, useEffect, useContext, useRef } from 'react';
import { analog } from '../defaults/defaultSequences';
import { Undo } from './UndoProvider';
import { useStateAndRef } from '../utils/useStateAndRef';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { addToPatternUndo } = useContext(Undo);

  const [selectedSound, setSelectedSound] = useState(-1);

  const patternRef = useRef(deepCopyPattern(analog.pattern));

  const refreshEventsRef = useRef({});
  const [refreshAll, setRefreshAll] = useState(false);

  const prevCellRef = useRef(null);
  const toggleEventsRef = useRef({});
  const toggleCell = (step) => {
    const cell = patternRef.current[step][selectedSound];
    function toggle(val) {
      cell.on = val;
      document.dispatchEvent(refreshEventsRef.current[`cell-${step}`]);
    }
    const prevOn = cell.on;
    const newOn = !prevOn;
    toggle(newOn);
    addToPatternUndo(toggle, prevOn, newOn, step);
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
      document.dispatchEvent(refreshEventsRef.current[`cell-${step}`]);
    }
    modify(newVal);
    addToPatternUndo(modify, prevVal, newVal, step);
  };

  const resetCellMods = (type) => {
    const prevPattern = deepCopyPattern(patternRef.current);
    const newPattern = deepCopyPattern(patternRef.current);
    newPattern.forEach((step) => {
      step[selectedSound].notes.forEach((note) => {
        if (type === 'pitch') note.pitch = 24;
        if (type === 'velocity') note.velocity = 1;
        if (type === 'length') note.length = 1;
      });
    });
    function reset(pattern) {
      patternRef.current.forEach((step, s) => {
        step[selectedSound].notes.forEach((note, n) => {
          note.pitch = pattern[s][selectedSound].notes[n].pitch;
          note.velocity = pattern[s][selectedSound].notes[n].velocity;
          note.length = pattern[s][selectedSound].notes[n].length;
        });
      });
      setRefreshAll(true);
    }
    reset(newPattern);
    addToPatternUndo(reset, prevPattern, newPattern);
  };

  const [slicing, setSlicing, slicingRef] = useStateAndRef(false);
  const sliceStep = (step) => {
    function slice(count) {
      function sliceFunc(count) {
        let notes = patternRef.current[step][selectedSound].notes;
        const len = notes.length;
        const note = notes[0];
        if (len === 3) notes.length = 0;
        notes.push(note);
        if (count === 2) sliceFunc(1);
      }
      sliceFunc(count);
      document.dispatchEvent(refreshEventsRef.current[`cell-${step}`]);
    }
    slice(1);
    addToPatternUndo(slice, 2, 1, step);
  };

  const [copying, setCopying] = useState(false);
  const pastePattern = (sound) => {
    const prevSoundPattern = [];
    const newSoundPattern = [];
    patternRef.current.forEach((step) => {
      prevSoundPattern.push({
        on: step[sound].on,
        notes: step[sound].notes.map((note) => ({ ...note })),
      });
      newSoundPattern.push({
        on: step[selectedSound].on,
        notes: step[selectedSound].notes.map((note) => ({ ...note })),
      });
    });
    function paste(copiedPattern) {
      patternRef.current.forEach((step, i) => {
        step[sound].on = copiedPattern[i].on;
        step[sound].notes = copiedPattern[i].notes.map((note) => ({ ...note }));
      });
      setRefreshAll(true);
    }
    paste(newSoundPattern);
    addToPatternUndo(paste, prevSoundPattern, newSoundPattern);
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
    function clear(patternToCopy) {
      copyValues(patternRef, patternToCopy);
      setRefreshAll(true);
    }
    clear(newPattern);
    addToPatternUndo(clear, prevPattern, newPattern);
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
        refreshEventsRef,
        refreshAll,
        setRefreshAll,
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

const initSound = (sound) => {
  sound.on = false;
  sound.notes.length = 0;
  sound.notes.push({ pitch: 24, velocity: 1, length: 1 });
};

const initPattern = (pattern) => {
  pattern.forEach((step) => {
    step.forEach((sound) => initSound(sound));
  });
};

const copyValues = (patternRef, patternToCopy) => {
  patternRef.current.forEach((step, i) => {
    step.forEach((sound, s) => {
      sound.on = patternToCopy[i][s].on;
      sound.notes.length = 0;
      patternToCopy[i][s].notes.forEach((note) => {
        sound.notes.push({ ...note });
      });
    });
  });
};
