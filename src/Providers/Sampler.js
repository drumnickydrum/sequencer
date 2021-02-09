import React, { useState, useCallback } from 'react';
import * as Tone from 'tone';

const INITIAL_SAMPLERS = {
  kick: new Tone.Sampler({ C2: './audio/kick.mp3' }).toDestination(),
  snr: new Tone.Sampler({ C2: './audio/snr.mp3' }).toDestination(),
  ch: new Tone.Sampler({ C2: './audio/ch.mp3' }).toDestination(),
  oh: new Tone.Sampler({ C2: './audio/oh.mp3' }).toDestination(),
};

export const Sampler = React.createContext();
export const SamplerProvider = ({ children }) => {
  const [sampler, setSampler] = useState(INITIAL_SAMPLERS);

  // how to avoid name collisions?
  const newSample = useCallback((name, sample) => {
    setSampler((prev) => ({
      ...prev,
      [name]: new Tone.Sampler({ C2: sample }).toDestination(),
    }));
  });

  return (
    <Sampler.Provider value={{ setSampler, newSample }}>
      {children}
    </Sampler.Provider>
  );
};
