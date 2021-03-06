import React, { useContext, useRef } from 'react';
import { Kit } from './Kit';

export const Undo = React.createContext();
export const UndoProvider = ({ children }) => {
  const undoRef = useRef([]);
  const redoRef = useRef([]);

  const undo = () => {
    if (undoRef.current.length === 0) return;
    const [undoFunc, redoFunc] = undoRef.current.pop();
    undoingRef.current = true;
    undoFunc();
    undoingRef.current = false;
    redoRef.current.push([undoFunc, redoFunc]);
  };

  const redo = () => {
    if (redoRef.current.length === 0) return;
    const [undoFunc, redoFunc] = redoRef.current.pop();
    undoingRef.current = true;
    redoFunc();
    undoingRef.current = false;
    undoRef.current.push([undoFunc, redoFunc]);
  };

  const refreshRef = useRef({});

  const undoingRef = useRef(false);
  const addToStepUndo = (func, prevVal, newVal, step) => {
    redoRef.current.length = 0;
    undoRef.current.push([
      () => {
        func(prevVal);
        refreshRef.current[`cell-${step}`](true);
      },
      () => {
        func(newVal);
        refreshRef.current[`cell-${step}`](true);
      },
    ]);
  };

  const { setRefreshMods } = useContext(Kit);
  const addToKitUndo = (prevMods, newMods, sound) => {
    redoRef.current.length = 0;
    undoRef.current.push([
      () => {
        const { pitchMod, velocityMod, lengthMod } = prevMods;
        sound.pitchMod = pitchMod;
        sound.velocityMod = velocityMod;
        sound.lengthMod = lengthMod;
        setRefreshMods(true);
      },
      () => {
        const { pitchMod, velocityMod, lengthMod } = newMods;
        sound.pitchMod = pitchMod;
        sound.velocityMod = velocityMod;
        sound.lengthMod = lengthMod;
        setRefreshMods(true);
      },
    ]);
  };

  return (
    <Undo.Provider
      value={{
        undo,
        redo,
        undoRef,
        redoRef,
        refreshRef,
        undoingRef,
        addToStepUndo,
        addToKitUndo,
      }}
    >
      {children}
    </Undo.Provider>
  );
};
