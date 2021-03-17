import React, { useRef } from 'react';
import * as tone from 'tone';

export const ToneContext = React.createContext();
export const ToneProvider = ({ children }) => {
  const ToneRef = useRef(tone);
  return (
    <ToneContext.Provider value={ToneRef}>{children}</ToneContext.Provider>
  );
};
