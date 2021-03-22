import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export const PatternRef = React.createContext();
export const PatternRefProvider = ({ children }) => {
  const pattern = useSelector((state) => state.sequencer.present.pattern);

  const patternRef = useRef(pattern);
  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  const cellsRef = useRef({});

  return (
    <PatternRef.Provider value={{ patternRef, cellsRef }}>
      {children}
    </PatternRef.Provider>
  );
};
