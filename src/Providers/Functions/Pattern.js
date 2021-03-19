import React, { useContext } from 'react';
import { Kit } from '../Kit';
import { Pattern, deepCopyPattern, copyValues } from '../Pattern';
import { Status } from '../Status';

export const PatternFunction = React.createContext();
export const PatternFunctionProvider = ({ children }) => {
  const {
    patternRef,
    selectedSound,
    cellsRef,
    updatePatternLS,
    setRefreshAll,
    setPatternBpm,
    setPatternId,
    setPatternName,
  } = useContext(Pattern);
  const { kitRef } = useContext(Kit);
  const { changeStatus } = useContext(Status);

  function toggle(val, noStatus) {
    patternRef.current[val.step][selectedSound].noteOn = val.noteOn;
    document.dispatchEvent(cellsRef.current[`cell-${val.step}`].events.refresh);
    if (!noStatus)
      changeStatus(
        `sound: ${selectedSound} | cell: ${val.step} | ${
          val.noteOn ? 'on' : 'off'
        }`
      );
    updatePatternLS();
  }

  function modifyFunc(val, noStatus) {
    if (val.step || val.step === 0) {
      patternRef.current[val.step][selectedSound].notes.forEach((note) => {
        if (val.type === 'pitch') note.pitch = val.modVal;
        if (val.type === 'velocity') note.velocity = val.modVal;
        if (val.type === 'length') note.length = val.modVal;
      });
      document.dispatchEvent(
        cellsRef.current[`cell-${val.step}`].events.refresh
      );
      if (!noStatus)
        changeStatus(
          `sound: ${selectedSound} | step: ${val.step} | mod: ${val.type}`
        );
    } else {
      kitRef.current.sounds[selectedSound][`${val.type}Mod`] = val.modVal;
      if (!noStatus) changeStatus(`sound: ${selectedSound} | mod: ${val.type}`);
      setRefreshAll(true);
    }
    updatePatternLS();
  }

  function reset(val, noStatus) {
    patternRef.current.forEach((step, s) => {
      step[selectedSound].notes.forEach((note, n) => {
        note.pitch = val.pattern[s][selectedSound].notes[n].pitch;
        note.velocity = val.pattern[s][selectedSound].notes[n].velocity;
        note.length = val.pattern[s][selectedSound].notes[n].length;
      });
    });
    kitRef.current.sounds[selectedSound][`${val.type}Mod`] = val.kit;
    setRefreshAll(true);
    if (!noStatus) changeStatus(`sound: ${selectedSound} | mod: ${val.type}`);
    updatePatternLS();
  }

  function slice(val, noStatus) {
    function sliceFunc(count) {
      let notes = patternRef.current[val.step][selectedSound].notes;
      const len = notes.length;
      const note = notes[0];
      if (len === 3) notes.length = 0;
      notes.push(note);
      if (count === 2) sliceFunc(1);
    }
    sliceFunc(val.count);
    document.dispatchEvent(cellsRef.current[`cell-${val.step}`].events.refresh);
    if (!noStatus)
      changeStatus(`slice sound: ${selectedSound} | cell: ${val.step}`);
    updatePatternLS();
  }

  function paste(val, noStatus) {
    patternRef.current.forEach((step, i) => {
      step[val.sound].noteOn = val.soundPattern[i].noteOn;
      step[val.sound].notes = val.soundPattern[i].notes.map((note) => ({
        ...note,
      }));
    });
    setRefreshAll(true);
    if (!noStatus)
      changeStatus(`copy from: ${selectedSound} | to: ${val.sound}`);
    updatePatternLS();
  }

  function load(val, noStatus) {
    patternRef.current = deepCopyPattern(val.pattern.pattern);
    setPatternBpm(val.pattern.bpm);
    setPatternId(val.pattern._id);
    setPatternName(val.pattern.name);
    setRefreshAll(true);
    val.cb(val.pattern.kit);
    if (!noStatus) changeStatus(`load pattern: ${val.pattern.name}`);
    updatePatternLS();
  }

  function clear(val, noStatus) {
    copyValues(patternRef, val.pattern);
    setRefreshAll(true);
    if (!noStatus)
      changeStatus(`clear ${val.one ? 'sound: ' + selectedSound : 'all'}`);
    updatePatternLS();
  }

  return (
    <PatternFunction.Provider
      value={{ toggle, modifyFunc, reset, slice, paste, load, clear }}
    >
      {children}
    </PatternFunction.Provider>
  );
};
