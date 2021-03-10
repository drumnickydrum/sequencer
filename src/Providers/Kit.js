import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { analog } from '../defaults/defaultKits';

const initialSounds = analog.sounds.map((sound) => ({ ...sound }));
const initialKit = { name: analog.name, sounds: initialSounds };

export const Kit = React.createContext();
export const KitProvider = ({ children }) => {
  const [loadSamples, setLoadSamples] = useState(true);
  const [buffersLoaded, setBuffersLoaded] = useState(false);
  const kitRef = useRef(initialKit);

  useEffect(() => {
    console.log(loadSamples);
    if (loadSamples) {
      console.log('loading samples');
      for (let i = 0; i < 9; i++) {
        kitRef.current.sounds[i].sampler = new Tone.Sampler(
          {
            C2: kitRef.current.sounds[i].sample,
          },
          () => {
            kitRef.current.sounds[i].duration = kitRef.current.sounds[
              i
            ].sampler._buffers._buffers.get('36')._buffer.duration;
            console.log(kitRef.current.sounds[i].duration);
            if (i === 8) setBuffersLoaded(true);
          }
        );
        delete kitRef.current.sounds[i].channel;
        kitRef.current.sounds[i].channel = new Tone.Channel({
          volume: 0,
          pan: 0,
          channelCount: 2,
        }).toDestination();
        kitRef.current.sounds[i].sampler.connect(
          kitRef.current.sounds[i].channel
        );
      }
      setLoadSamples(false);
    }
  }, [loadSamples]);

  return (
    <Kit.Provider
      value={{
        kitRef: kitRef,
        kit: kitRef.current,
        setLoadSamples,
        buffersLoaded,
        setBuffersLoaded,
      }}
    >
      {children}
    </Kit.Provider>
  );
};
