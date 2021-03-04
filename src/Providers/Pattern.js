import React, { useState, useEffect, useContext, useRef } from 'react';
import * as Tone from 'tone';
import { Kit } from '../Providers/Kit';
import { INIT_PATTERN, INIT_ONE_PATTERN, analog } from './defaultSequences';
import { MIDI_NOTES } from '../kits/defaultKits';
import { Undo } from './UndoProvider';
import { useStateAndRef } from '../utils/useStateAndRef';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { kit } = useContext(Kit);
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

  const schedulePattern = (stepRef) => {
    const cells = document.querySelectorAll(`.cell`);
    Tone.Transport.scheduleRepeat((time) => {
      animateCell(time, cells[stepRef.current]);
      scheduleCell(time, stepRef);
    }, '16n');
  };

  const animateCell = (time, cell) => {
    Tone.Draw.schedule(() => {
      if (cell.classList.contains('on')) {
        cell.classList.add('pulse');
        setTimeout(() => cell.classList.remove('pulse'), 0);
      } else {
        cell.classList.add('flash');
        setTimeout(() => cell.classList.remove('flash'), 0);
      }
    }, time);
  };

  const scheduleCell = (time, stepRef) => {
    for (const [sound, { on, notes }] of Object.entries(
      patternRef.current[stepRef.current]
    )) {
      if (on) {
        // console.time('schedule note');
        let slice = notes.length;
        let [pitch, velocity, length] = getModdedValues(sound, notes[0]);
        kit[sound].sampler.triggerAttackRelease(pitch, length, time, velocity);
        if (slice === 2) {
          let [pitch2, velocity2, length2] = getModdedValues(sound, notes[1]);
          kit[sound].sampler.triggerAttackRelease(
            pitch2,
            length2,
            time + Tone.Time('32n'),
            velocity2
          );
        } else if (slice === 3) {
          let [pitch2, velocity2, length2] = getModdedValues(sound, notes[1]);
          let [pitch3, velocity3, length3] = getModdedValues(sound, notes[2]);
          kit[sound].sampler.triggerAttackRelease(
            pitch2,
            length2,
            time + Tone.Time('32t'),
            velocity2
          );
          kit[sound].sampler.triggerAttackRelease(
            pitch3,
            length3,
            time + Tone.Time('32t') + Tone.Time('32t'),
            velocity3
          );
        }
        // console.timeEnd('schedule note');
      }
    }
    stepRef.current =
      stepRef.current === pattern.length - 1 ? 0 : stepRef.current + 1;
  };

  const getModdedValues = (sound, { pitch, velocity, length }) => {
    pitch += kit[sound].pitchMod;
    pitch = MIDI_NOTES[pitch];
    velocity *= kit[sound].velocityMod;
    length *= kit[sound].lengthMod * kit[sound].duration;
    return [pitch, velocity, length];
  };

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
        schedulePattern,
        selectedSound,
        setSelectedSound,
        scheduleCell,
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
