import React, { useState, useEffect, useContext, useRef } from 'react';
import { analog } from '../../defaults/defaultPatterns';
import { useStateAndRef } from '../../utils/useStateAndRef';
import { Status } from '../Status';
import { getLS, setLS } from '../../utils/storage';
import { useStateAndLS, useStateAndSS } from '../../utils/storage';

export const PatternState = React.createContext();
export const PatternStateProvider = ({ children }) => {
  const { alertSelectSound } = useContext(Status);

  //! this belongs App level
  const [show, setShow] = useStateAndSS('show', false);

  //! these belong Sequence level
  const [patternId, setPatternId] = useStateAndLS('patternId', analog._id);
  const [patternBpm, setPatternBpm] = useStateAndLS('patternBpm', analog.bpm);
  const [patternName, setPatternName] = useStateAndLS(
    'patternName',
    analog.name
  );

  //! SELECT SOUND ALERT
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

  //! THE PATTERN
  const patternRef = useRef(
    deepCopyPattern(getLS('pattern') || analog.pattern)
  );
  const updatePatternLS = () => setLS('pattern', patternRef.current);
  const cellsRef = useRef({});
  const [refreshAll, setRefreshAll] = useState(false);

  //! MODE: PAINTING/ERASING
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

  const [mod, setMod, modRef] = useStateAndRef(null);
  useEffect(() => {
    if (mod) {
      setPainting(false);
    } else {
      setPainting(true);
    }
  }, [mod]);

  const [slicing, setSlicing, slicingRef] = useStateAndRef(false);
  useEffect(() => {
    if (slicing) {
      setPainting(false);
    } else {
      setPainting(true);
    }
  }, [slicing]);

  const [copying, setCopying] = useState(false);

  //! debugging
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
    <PatternState.Provider
      value={{
        gridRef,
        patternId,
        setPatternId,
        patternName,
        setPatternName,
        patternBpm,
        setPatternBpm,
        patternRef,
        updatePatternLS,
        cellsRef,
        refreshAll,
        setRefreshAll,
        erasing,
        setErasing,
        painting,
        setPainting,
        prevCellRef,
        selectedSound,
        setSelectedSound,
        mod,
        setMod,
        modRef,
        slicing,
        setSlicing,
        slicingRef,
        copying,
        setCopying,
        show,
        setShow,
      }}
    >
      {children}
    </PatternState.Provider>
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

export const deepCopyPattern = (pattern) => {
  return pattern.map((step) => {
    return deepCopyStep(step);
  });
};

export const initSound = (sound) => {
  sound.noteOn = false;
  sound.notes.length = 0;
  sound.notes.push({ pitch: 24, velocity: 1, length: 1 });
};

export const initPattern = (pattern) => {
  pattern.forEach((step) => {
    step.forEach((sound) => initSound(sound));
  });
};

export const copyValues = (patternRef, patternToCopy) => {
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
