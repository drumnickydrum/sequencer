import React, { useState, useEffect, useContext, useRef } from 'react';
import { analog } from '../defaults/defaultPatterns';
import { Undo } from './UndoProvider';
import { useStateAndRef } from '../utils/useStateAndRef';
import { Kit } from './Kit';
import { Status } from './Status';
import { getLS, getSS, setLS, setSS } from '../utils/storage';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { addToUndo } = useContext(Undo);
  const { kitRef, currentKit } = useContext(Kit);
  const { changeStatus, alertSelectSound } = useContext(Status);

  const gridRef = useRef(null);

  const [selectedSound, setSelectedSound] = useState(-1);
  useEffect(() => {
    const grid = gridRef.current;
    if (selectedSound === -1) {
      if (grid) {
        grid.addEventListener('click', alertSelectSound);
      }
    }
    return () => {
      if (grid) grid.removeEventListener('click', alertSelectSound);
    };
  }, [selectedSound, alertSelectSound]);

  const [show, setShow] = useState(getSS('show') || false);
  useEffect(() => {
    setSS('show', show);
  }, [show]);

  const patternRef = useRef(
    deepCopyPattern(getLS('pattern') || analog.pattern)
  );
  const updatePatternLS = () => setLS('pattern', patternRef.current);
  const cellsRef = useRef({});

  const [patternId, setPatternId] = useState(getLS('patternId') || analog._id);
  useEffect(() => {
    setLS('patternId', patternId);
  }, [patternId]);

  const [patternName, setPatternName] = useState(
    getLS('patternName') || analog.name
  );
  useEffect(() => {
    setLS('patternName', patternName);
  }, [patternName]);

  const [patternBpm, setPatternBpm] = useState(
    getLS('patternBpm') || analog.bpm
  );
  useEffect(() => {
    setLS('patternBpm', patternBpm);
  }, [patternBpm]);

  const [refreshAll, setRefreshAll] = useState(false);

  const [painting, setPainting] = useState(true);
  const [erasing, setErasing] = useState(false);
  useEffect(() => {
    if (erasing) {
      setPainting(false);
    } else {
      setPainting(true);
    }
  }, [erasing]);

  const prevCellRef = useRef(null);
  const toggleCell = (step) => {
    function toggle(val, noStatus) {
      patternRef.current[step][selectedSound].noteOn = val;
      document.dispatchEvent(cellsRef.current[`cell-${step}`].events.refresh);
      if (!noStatus)
        changeStatus(
          `sound: ${selectedSound} | cell: ${step} | ${val ? 'on' : 'off'}`
        );
      updatePatternLS();
    }
    const prevOn = patternRef.current[step][selectedSound].noteOn;
    const newOn = !prevOn;
    toggle(newOn, true);
    addToUndo(toggle, prevOn, newOn);
  };

  const [mod, setMod, modRef] = useStateAndRef(null);
  useEffect(() => {
    if (mod) {
      setPainting(false);
    } else {
      setPainting(true);
    }
  }, [mod]);

  const modify = (prevVal, newVal, step) => {
    const type = modRef.current;
    function modifyFunc(val, noStatus) {
      if (step || step === 0) {
        patternRef.current[step][selectedSound].notes.forEach((note) => {
          if (type === 'pitch') note.pitch = val;
          if (type === 'velocity') note.velocity = val;
          if (type === 'length') note.length = val;
        });
        document.dispatchEvent(cellsRef.current[`cell-${step}`].events.refresh);
        if (!noStatus)
          changeStatus(
            `sound: ${selectedSound} | step: ${step} | mod: ${type}`
          );
      } else {
        kitRef.current.sounds[selectedSound][`${type}Mod`] = val;
        if (!noStatus) changeStatus(`sound: ${selectedSound} | mod: ${type}`);
        setRefreshAll(true);
      }
      updatePatternLS();
    }
    modifyFunc(newVal, true);
    addToUndo(modifyFunc, prevVal, newVal, step);
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
    function reset(val, noStatus) {
      patternRef.current.forEach((step, s) => {
        step[selectedSound].notes.forEach((note, n) => {
          note.pitch = val.pattern[s][selectedSound].notes[n].pitch;
          note.velocity = val.pattern[s][selectedSound].notes[n].velocity;
          note.length = val.pattern[s][selectedSound].notes[n].length;
        });
      });
      kitRef.current.sounds[selectedSound][`${type}Mod`] = val.kit;
      setRefreshAll(true);
      if (!noStatus) changeStatus(`sound: ${selectedSound} | mod: ${type}`);
      updatePatternLS();
    }
    const prevVal = {
      pattern: prevPattern,
      kit: kitRef.current.sounds[selectedSound][`${type}Mod`],
    };
    const newVal = { pattern: newPattern, kit: type === 'pitch' ? 0 : 1 };
    reset(newVal, true);
    addToUndo(reset, prevVal, newVal);
  };

  const [slicing, setSlicing, slicingRef] = useStateAndRef(false);
  useEffect(() => {
    if (slicing) {
      setPainting(false);
    } else {
      setPainting(true);
    }
  }, [slicing]);

  const sliceStep = (step) => {
    function slice(count, noStatus) {
      function sliceFunc(count) {
        let notes = patternRef.current[step][selectedSound].notes;
        const len = notes.length;
        const note = notes[0];
        if (len === 3) notes.length = 0;
        notes.push(note);
        if (count === 2) sliceFunc(1);
      }
      sliceFunc(count);
      document.dispatchEvent(cellsRef.current[`cell-${step}`].events.refresh);
      if (!noStatus)
        changeStatus(`slice sound: ${selectedSound} | cell: ${step}`);
      updatePatternLS();
    }
    slice(1, true);
    addToUndo(slice, 2, 1, step);
  };

  const [copying, setCopying] = useState(false);
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
    function paste(copiedPattern, noStatus) {
      patternRef.current.forEach((step, i) => {
        step[sound].noteOn = copiedPattern[i].noteOn;
        step[sound].notes = copiedPattern[i].notes.map((note) => ({ ...note }));
      });
      setRefreshAll(true);
      if (!noStatus) changeStatus(`copy from: ${selectedSound} | to: ${sound}`);
      updatePatternLS();
    }
    paste(newSoundPattern, true);
    addToUndo(paste, prevSoundPattern, newSoundPattern);
  };

  const loadPattern = (newPattern, changeKit) => {
    const prevPattern = {
      _id: patternId,
      name: patternName,
      bpm: patternBpm,
      kit: currentKit,
      pattern: deepCopyPattern(patternRef.current),
    };
    function change(pattern, noStatus) {
      patternRef.current = deepCopyPattern(pattern.pattern);
      setPatternBpm(pattern.bpm);
      setPatternId(pattern._id);
      setPatternName(pattern.name);
      setRefreshAll(true);
      changeKit(pattern.kit);
      if (!noStatus) changeStatus(`load pattern: ${pattern.name}`);
      updatePatternLS();
    }
    change(newPattern, true);
    addToUndo(change, prevPattern, newPattern);
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
    function clear(patternToCopy, noStatus) {
      copyValues(patternRef, patternToCopy);
      setRefreshAll(true);
      if (!noStatus)
        changeStatus(`clear ${one ? 'sound: ' + selectedSound : 'all'}`);
      updatePatternLS();
    }
    clear(newPattern, true);
    addToUndo(clear, prevPattern, newPattern);
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
        patternId,
        setPatternId,
        patternName,
        setPatternName,
        patternBpm,
        setPatternBpm,
        patternRef,
        cellsRef,
        refreshAll,
        setRefreshAll,
        erasing,
        setErasing,
        painting,
        setPainting,
        prevCellRef,
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
        loadPattern,
        clearPattern,
        show,
        setShow,
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
    return { noteOn: sound.noteOn, notes: newNotes };
  });
};

const deepCopyPattern = (pattern) => {
  return pattern.map((step) => {
    return deepCopyStep(step);
  });
};

const initSound = (sound) => {
  sound.noteOn = false;
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
      sound.noteOn = patternToCopy[i][s].noteOn;
      sound.notes.length = 0;
      patternToCopy[i][s].notes.forEach((note) => {
        sound.notes.push({ ...note });
      });
    });
  });
};

const INIT_ONE_NOTE = () => ({
  pitch: 24,
  velocity: 1,
  length: 1,
});

const INIT_SOUND_STEP = () => ({
  noteOn: false,
  notes: [INIT_ONE_NOTE()],
});

const INIT_PATTERN = () => {
  const initPattern = [];
  for (let i = 0; i < 64; i++) {
    const initCell = [];
    for (let i = 0; i < 9; i++) {
      initCell.push(INIT_SOUND_STEP());
    }
    initPattern.push(initCell);
  }
  return initPattern;
};
