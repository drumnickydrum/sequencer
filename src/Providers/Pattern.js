import React, { useState, useEffect, useContext, useRef } from 'react';
import * as Tone from 'tone';
import { Kit } from '../Providers/Kit';
import { INIT_PATTERN, analog } from './defaultSequences';

export const Pattern = React.createContext();
export const PatternProvider = ({ children }) => {
  const { kit } = useContext(Kit);

  const [selectedSound, setSelectedSound] = useState(-1);
  const [events, setEvents] = useState({});

  const prevCellRef = useRef(null);
  const undoRef = useRef([]);
  const redoRef = useRef([]);

  const [pattern, setPattern] = useState(
    analog.pattern.map((cell) => [...cell])
  );
  const patternRef = useRef(pattern.map((cell) => [...cell]));
  useEffect(() => {
    patternRef.current = pattern.map((cell) => [...cell]);
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

  const toggleCell = (i, vol, addHistory = true) => {
    let newVol;
    setPattern((pattern) => {
      newVol = vol === 0 ? 1 : 0;
      let newPattern = pattern.map((cell) => [...cell]);
      newPattern[i][selectedSound] = newVol;
      return newPattern;
    });
    if (addHistory) {
      redoRef.current.length = 0;
      addToUndo('toggleCell', newVol, vol, i);
    }
  };

  const sliceCell = (i) => {
    setPattern((pattern) => {
      let newPattern = pattern.map((cell) => [...cell]);
      let note = newPattern[i][selectedSound];
      if (!isNaN(note)) {
        newPattern[i][selectedSound] = [note, note];
      } else if (note.length === 2) {
        newPattern[i][selectedSound] = [...note, note[0]];
      } else if (note.length === 3) {
        newPattern[i][selectedSound] = note[0];
      }
      return newPattern;
    });
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
      newPattern = pattern.map((cell) => {
        let newCell = [...cell];
        newCell[selectedSound] = 0;
        return newCell;
      });
      setPattern(newPattern);
    }
    if (addHistory) {
      redoRef.current.length = 0;
      addToUndo('clearPattern', newPattern, prevPattern);
    }
  };

  const addToUndo = (type, newVal, prevVal, i) => {
    if (type === 'toggleCell') {
      undoRef.current.push([
        () => toggleCell(i, newVal, false),
        () => toggleCell(i, prevVal, false),
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
    for (const [sound, vol] of Object.entries(
      patternRef.current[stepRef.current]
    )) {
      const cell = patternRef.current[stepRef.current][sound];
      if (cell) {
        let event;
        let pitch = 24 + kit[sound].pitchMod;
        pitch = pitch > 59 ? 59 : pitch < 0 ? 0 : pitch;
        if (!isNaN(cell)) event = scheduleNote(sound, pitch, vol, time);
        if (Array.isArray(cell)) event = scheduleArray(sound, pitch, vol, time);
        event.start();
      }
    }
    stepRef.current =
      stepRef.current === pattern.length - 1 ? 0 : stepRef.current + 1;
  };

  const scheduleNote = (sound, pitch, vol, time) => {
    return new Tone.ToneEvent(() => {
      kit[sound].sampler.triggerAttackRelease(
        kit[sound].pitch[pitch],
        kit[sound].duration * kit[sound].durationMod,
        time,
        vol * kit[sound].volumeMod
      );
    });
  };

  const scheduleArray = (sound, pitch, array, time) => {
    const notes = array.map((vol) => kit[sound].pitch[pitch]);
    let seq = new Tone.Sequence(
      (_, note) => {
        console.log(note);
        kit[sound].sampler.triggerAttackRelease(note, 0.1, time, 1);
      },
      [notes],
      '16n'
    );
    seq.loop = false;
    return seq;
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
