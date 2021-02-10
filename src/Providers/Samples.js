import React, { useState, useCallback } from 'react';
import * as Tone from 'tone';
import { downtempo } from './defaultSequences';

export const Samples = React.createContext();
export const SamplesProvider = ({ children }) => {
  const [samples, setSamples] = useState(downtempo.instrument);
  const [selectedSample, setSelectedSample] = useState('kick');

  // how to avoid name collisions?
  const newSample = useCallback((name, sample, key) => {
    setSamples((prev) => ({
      ...prev,
      [name]: {
        sampler: new Tone.Sampler({ C2: sample }).toDestination(),
        key,
      },
    }));
  });

  return (
    <Samples.Provider
      value={{
        samples,
        setSamples,
        newSample,
        selectedSample,
        setSelectedSample,
      }}
    >
      {children}
    </Samples.Provider>
  );
};
