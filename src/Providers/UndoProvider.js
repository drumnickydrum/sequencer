import React, { useRef } from 'react';

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

  const addToPatternUndo = (prevPattern, newPattern, setPattern) => {
    redoRef.current.length = 0;
    undoRef.current.push([
      () => setPattern(prevPattern), // undo
      () => setPattern(newPattern), // redo
    ]);
  };

  return (
    <Undo.Provider
      value={{ undo, redo, undoRef, redoRef, addToPatternUndo, undoingRef }}
    >
      {children}
    </Undo.Provider>
  );
};
