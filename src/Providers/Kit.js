import React, { useRef } from 'react';
// import * as Tone from 'tone';
import { analog } from '../Kit/index';

export const Kit = React.createContext();
export const KitProvider = ({ children }) => {
  const kitRef = useRef(analog);

  // // how to avoid name collisions?
  // const newSample = useCallback((name, sample, key) => {
  //   setKit((prev) => ({
  //     ...prev,
  //     [name]: {
  //       pitchShift = new Tone.PitchShift().t
  //       sampler: new Tone.Sampler({ C2: sample }).toDestination(),
  //       key,
  //     },
  //   }));
  // });

  return (
    <Kit.Provider
      value={{
        kit: kitRef.current,
      }}
    >
      {children}
    </Kit.Provider>
  );
};
