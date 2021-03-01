import React, { useState, useEffect, useContext, useRef } from 'react';
import * as Tone from 'tone';
import { Kit } from '../Providers/Kit';
import { INIT_PATTERN, INIT_ONE_PATTERN, analog } from './defaultSequences';
import { MIDI_NOTES } from '../kits/defaultKits';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { kit } = useContext(Kit);

  const [selectedSound, setSelectedSound] = useState(-1);
  const [events, setEvents] = useState({});

  const prevCellRef = useRef(null);
  const undoRef = useRef([]);
  const redoRef = useRef([]);

  const [pattern, setPattern] = useState(deepCopyPattern(analog.pattern));
  const patternRef = useRef(null);
  useEffect(() => {
    patternRef.current = deepCopyPattern(pattern);
  }, [pattern]);

  const [slicing, setSlicing] = useState(false);
  const slicingRef = useRef(null);
  useEffect(() => {
    slicingRef.current = slicing;
  }, [slicing]);

  const [copying, setCopying] = useState(false);
  const copyingRef = useRef(null);
  useEffect(() => {
    copyingRef.current = copying;
  });

  const toggleCell = (i, addHistory = true) => {
    setPattern((pattern) => {
      let newPattern = deepCopyPattern(pattern);
      newPattern[i][selectedSound].on = !newPattern[i][selectedSound].on;
      return newPattern;
    });
    if (addHistory) {
      addToUndo('toggleCell', i);
    }
  };

  const sliceCell = (i, addHistory = true) => {
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
    if (addHistory) {
      addToUndo('sliceCell', i);
    }
  };

  const copySoundPattern = () => {
    console.log('copying sound pattern');
  };

  const clearPattern = (one, addHistory = true) => {
    let prevPattern = pattern,
      newPattern;
    if (!one) {
      newPattern = INIT_PATTERN();
      setPattern(newPattern);
    } else {
      if (selectedSound === -1) return;
      newPattern = deepCopyPattern(pattern);
      newPattern.forEach((cell) => {
        cell[selectedSound] = INIT_ONE_PATTERN();
      });
      setPattern(newPattern);
    }
    if (addHistory) {
      addToUndo('clearPattern', null, newPattern, prevPattern);
    }
  };

  const addToUndo = (type, i, newVal, prevVal) => {
    redoRef.current.length = 0;
    if (type === 'toggleCell') {
      undoRef.current.push([
        () => toggleCell(i, false),
        () => toggleCell(i, false),
      ]);
    }
    if (type === 'sliceCell') {
      undoRef.current.push([
        () => {
          sliceCell(i, false);
          sliceCell(i, false);
        },
        () => sliceCell(i, false),
      ]);
    }
    if (type === 'clearPattern') {
      undoRef.current.push([
        () => setPattern([...prevVal], false),
        () => setPattern([...newVal], false),
      ]);
    }
  };

  const undo = () => {
    if (undoRef.current.length === 0) return;
    const [undoFunc, redoFunc] = undoRef.current.pop();
    undoFunc();
    redoRef.current.push([undoFunc, redoFunc]);
  };

  const redo = () => {
    if (redoRef.current.length === 0) return;
    const [undoFunc, redoFunc] = redoRef.current.pop();
    redoFunc();
    undoRef.current.push([undoFunc, redoFunc]);
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
        let [pitch, velocity, release] = getModdedValues(sound, notes[0]);
        kit[sound].sampler.triggerAttackRelease(pitch, release, time, velocity);
        if (slice === 2) {
          let [pitch2, velocity2, release2] = getModdedValues(sound, notes[1]);
          kit[sound].sampler.triggerAttackRelease(
            pitch2,
            release2,
            time + Tone.Time('32n'),
            velocity2
          );
        } else if (slice === 3) {
          let [pitch2, velocity2, release2] = getModdedValues(sound, notes[1]);
          let [pitch3, velocity3, release3] = getModdedValues(sound, notes[2]);
          kit[sound].sampler.triggerAttackRelease(
            pitch2,
            release2,
            time + Tone.Time('32t'),
            velocity2
          );
          kit[sound].sampler.triggerAttackRelease(
            pitch3,
            release3,
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

  const getModdedValues = (sound, { pitch, velocity, release }) => {
    pitch += kit[sound].pitchMod;
    pitch = MIDI_NOTES[pitch];
    velocity *= kit[sound].velocityMod;
    release *= kit[sound].releaseMod * kit[sound].duration;
    return [pitch, velocity, release];
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
        undo,
        redo,
        clearPattern,
        slicing,
        setSlicing,
        slicingRef,
        sliceCell,
        copying,
        setCopying,
        copyingRef,
        events,
        setEvents,
        prevCellRef,
        toggleCell,
        schedulePattern,
        selectedSound,
        setSelectedSound,
        scheduleCell,
      }}
    >
      {children}
    </Pattern.Provider>
  );
};

const deepCopyPattern = (pattern) => {
  return pattern.map((cell) => {
    return cell.map((sound) => {
      let newNotes = sound.notes.map((note) => {
        return { ...note };
      });
      return { on: sound.on, notes: newNotes };
    });
  });
};
