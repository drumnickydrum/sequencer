import React, { useState, useCallback } from 'react';
import * as Tone from 'tone';
import { analog } from '../Kits/index';

export const Kit = React.createContext();
export const KitProvider = ({ children }) => {
  const [kit, setKit] = useState(analog);

  // how to avoid name collisions?
  const newSample = useCallback((name, sample, key) => {
    setKit((prev) => ({
      ...prev,
      [name]: {
        sampler: new Tone.Sampler({ C2: sample }).toDestination(),
        key,
      },
    }));
  });

  return (
    <Kit.Provider
      value={{
        kit,
        setKit,
        newSample,
      }}
    >
      {children}
    </Kit.Provider>
  );
};
