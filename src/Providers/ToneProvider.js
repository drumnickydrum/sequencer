import React, { useRef } from 'react';
import * as tone from 'tone';

export const Tone = React.createContext();
export const ToneProvider = ({ children }) => {
  const toneRef = useRef(tone);
  return <Tone.Provider value={toneRef}>{children}</Tone.Provider>;
};
