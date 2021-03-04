import React, { useContext, useRef } from 'react';
import { Kit } from './Kit';

export const Undo = React.createContext();
export const UndoProvider = ({ children }) => {
  const undoRef = useRef([]);
  const redoRef = useRef([]);

  const undoingRef = useRef(true);

  const undo = () => {
    if (undoRef.current.length === 0) return;
    const [undoFunc, redoFunc] = undoRef.current.pop();
    undoingRef.current = true;
    undoFunc();
    redoRef.current.push([undoFunc, redoFunc]);
  };

  const redo = () => {
    if (redoRef.current.length === 0) return;
    const [undoFunc, redoFunc] = redoRef.current.pop();
    undoingRef.current = true;
    redoFunc();
    undoRef.current.push([undoFunc, redoFunc]);
  };

  const addToPatternUndo = (prevPattern, newPattern, setPattern, i) => {
    redoRef.current.length = 0;
    undoRef.current.push([
      () => {
        if (i) prevPattern[i].updated = newPattern[i].updated + 1;
        setPattern(prevPattern);
      },
      () => {
        if (i) newPattern[i].updated = prevPattern[i].updated + 1;
        setPattern(newPattern);
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
        addToPatternUndo,
        undoingRef,
        addToKitUndo,
      }}
    >
      {children}
    </Undo.Provider>
  );
};
