import React, { useState, useEffect, useContext, useRef } from 'react';
import { analog } from '../defaults/defaultPatterns';
import { Undo } from './UndoProvider';
import { useStateAndRef } from '../utils/useStateAndRef';
import { Kit } from './Kit';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { addToPatternUndo } = useContext(Undo);
  const { kit } = useContext(Kit);

  const [selectedSound, setSelectedSound] = useState(-1);

  const patternRef = useRef(deepCopyPattern(analog.pattern));
  const [patternName, setPatternName] = useState(analog.name);

  const refreshEventsRef = useRef({});
  const [refreshAll, setRefreshAll] = useState(false);

  const [painting, setPainting] = useState(false);
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

  const [mod, setMod, modRef] = useStateAndRef(null);
  const modify = (prevVal, newVal, step) => {
    const notes =
      step || step === 0 ? patternRef.current[step][selectedSound].notes : null;
    const type = modRef.current;
    function modifyFunc(val) {
      if (step || step === 0) {
        notes.forEach((note) => {
          if (type === 'pitch') note.pitch = val;
          if (type === 'velocity') note.velocity = val;
          if (type === 'length') note.length = val;
        });
        document.dispatchEvent(refreshEventsRef.current[`cell-${step}`]);
      } else {
        kit.sounds[selectedSound][`${type}Mod`] = val;
        setRefreshAll(true);
      }
    }
    modifyFunc(newVal);
    addToPatternUndo(modifyFunc, prevVal, newVal, step);
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
    function reset(val) {
      patternRef.current.forEach((step, s) => {
        step[selectedSound].notes.forEach((note, n) => {
          note.pitch = val.pattern[s][selectedSound].notes[n].pitch;
          note.velocity = val.pattern[s][selectedSound].notes[n].velocity;
          note.length = val.pattern[s][selectedSound].notes[n].length;
        });
      });
      kit.sounds[selectedSound][`${type}Mod`] = val.kit;
      setRefreshAll(true);
    }
    const prevVal = {
      pattern: prevPattern,
      kit: kit.sounds[selectedSound][`${type}Mod`],
    };
    const newVal = { pattern: newPattern, kit: type === 'pitch' ? 0 : 1 };
    reset(newVal);
    addToPatternUndo(reset, prevVal, newVal);
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

  const changePattern = (newPattern, changeTempo, bpm) => {
    const prevPattern = {
      name: patternName,
      pattern: deepCopyPattern(patternRef.current),
      bpm,
    };
    function change(pattern) {
      patternRef.current = deepCopyPattern(pattern.pattern);
      changeTempo(pattern.bpm);
      setPatternName(pattern.name);
      setRefreshAll(true);
    }
    change(newPattern);
    addToPatternUndo(change, prevPattern, newPattern);
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
        patternName,
        setPatternName,
        patternRef,
        refreshEventsRef,
        refreshAll,
        setRefreshAll,
        painting,
        setPainting,
        prevCellRef,
        toggleEventsRef,
        toggleCell,
        selectedSound,
        setSelectedSound,
        mod,
        setMod,
        modRef,
        modify,
        resetMods,
        slicing,
        setSlicing,
        slicingRef,
        sliceStep,
        copying,
        setCopying,
        pastePattern,
        changePattern,
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

// const INIT_ONE_NOTE = () => ({
//   pitch: 24,
//   velocity: 1,
//   length: 1,
// });

// const INIT_SOUND_STEP = () => ({
//   on: false,
//   notes: [INIT_ONE_NOTE()],
// });

// const INIT_PATTERN = () => {
//   const initPattern = [];
//   for (let i = 0; i < 64; i++) {
//     const initCell = [];
//     for (let i = 0; i < 9; i++) {
//       initCell.push(INIT_SOUND_STEP());
//     }
//     initPattern.push(initCell);
//   }
//   return initPattern;
// };

// const init = {
//   bpm: 128,
//   instrument: null,
//   pattern: INIT_PATTERN(),
// };
