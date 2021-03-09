import React, { useContext, useEffect, useRef } from 'react';
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

  const undoingRef = useRef(false);

  const addToPatternUndo = (func, prevVal, newVal) => {
    if (undoingRef.current) return;
    redoRef.current.length = 0;
    undoRef.current.push([() => func(prevVal), () => func(newVal)]);
  };

  const addToModsUndo = (prevMods, newMods, sound, setRefreshAll) => {
    redoRef.current.length = 0;
    undoRef.current.push([
      () => {
        const { pitchMod, velocityMod, lengthMod } = prevMods;
        sound.pitchMod = pitchMod;
        sound.velocityMod = velocityMod;
        sound.lengthMod = lengthMod;
        setRefreshAll(true);
      },
      () => {
        const { pitchMod, velocityMod, lengthMod } = newMods;
        sound.pitchMod = pitchMod;
        sound.velocityMod = velocityMod;
        sound.lengthMod = lengthMod;
        setRefreshAll(true);
      },
    ]);
  };

  useEffect(() => {
    const undoRedo = (e) => {
      // console.log(e.code);
      if (e.code === 'KeyU') undo();
      if (e.code === 'KeyR') redo();
    };
    document.addEventListener('keydown', undoRedo);
    return () => document.removeEventListener('keydown', undoRedo);
  }, []);

  return (
    <Undo.Provider
      value={{
        undo,
        redo,
        undoRef,
        redoRef,
        addToPatternUndo,
        addToModsUndo,
      }}
    >
      {children}
    </Undo.Provider>
  );
};
