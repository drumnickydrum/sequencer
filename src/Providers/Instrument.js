import React, { useState, useCallback } from 'react';
import * as Tone from 'tone';
import { init } from './defaultSequences';

export const Instrument = React.createContext();
export const InstrumentProvider = ({ children }) => {
  const [instrument, setInstrument] = useState(init.instrument);

  // how to avoid name collisions?
  const newSample = useCallback((name, sample, key) => {
    setInstrument((prev) => ({
      ...prev,
      [name]: {
        sampler: new Tone.Sampler({ C2: sample }).toDestination(),
        key,
      },
    }));
  });

  return (
    <Instrument.Provider
      value={{
        instrument,
        setInstrument,
        newSample,
      }}
    >
      {children}
    </Instrument.Provider>
  );
};
