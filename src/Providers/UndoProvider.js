import React, { useEffect, useRef, useState } from 'react';

export const Undo = React.createContext();
export const UndoProvider = ({ children }) => {
  const undoRef = useRef([]);
  const redoRef = useRef([]);
  const [undoDisabled, setUndoDisabled] = useState(true);
  const [redoDisabled, setRedoDisabled] = useState(true);

  const undo = () => {
    const [undoFunc, redoFunc] = undoRef.current.pop();
    if (undoRef.current.length === 0) setUndoDisabled(true);
    undoingRef.current = true;
    undoFunc();
    undoingRef.current = false;
    redoRef.current.push([undoFunc, redoFunc]);
    setRedoDisabled(false);
  };

  const redo = () => {
    if (redoRef.current.length === 0) return;
    const [undoFunc, redoFunc] = redoRef.current.pop();
    if (redoRef.current.length === 0) setRedoDisabled(true);
    undoingRef.current = true;
    redoFunc();
    undoingRef.current = false;
    undoRef.current.push([undoFunc, redoFunc]);
    setUndoDisabled(false);
  };

  const undoingRef = useRef(false);

  const addToUndo = (func, prevVal, newVal) => {
    if (undoingRef.current) return;
    setUndoDisabled(false);
    setRedoDisabled(true);
    redoRef.current.length = 0;
    undoRef.current.push([() => func(prevVal), () => func(newVal)]);
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
        undoDisabled,
        redoDisabled,
        addToUndo,
      }}
    >
      {children}
    </Undo.Provider>
  );
};
