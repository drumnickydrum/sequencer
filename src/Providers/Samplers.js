import React, { useState } from 'react';
import * as Tone from 'tone';

const INITIAL_SAMPLERS = {
  kick: new Tone.Sampler({ C2: './audio/kick.mp3' }).toDestination(),
  snr: new Tone.Sampler({ C2: './audio/snr.mp3' }).toDestination(),
  ch: new Tone.Sampler({ C2: './audio/ch.mp3' }).toDestination(),
  oh: new Tone.Sampler({ C2: './audio/oh.mp3' }).toDestination(),
};

export const Samplers = React.createContext();
export const SetSamplers = React.createContext();
export const SamplersProvider = ({ children }) => {
  const [samplers, setSamplers] = useState(INITIAL_SAMPLERS);

  return (
    <SetSamplers.Provider value={{ setSamplers }}>
      <Samplers.Provider value={{ samplers }}>{children}</Samplers.Provider>
    </SetSamplers.Provider>
  );
};
