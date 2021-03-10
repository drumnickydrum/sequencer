import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { analog } from '../defaults/defaultKits';

const initialSounds = analog.sounds.map((sound) => ({ ...sound }));
const initialKit = { name: analog.name, sounds: initialSounds };

export const Kit = React.createContext();
export const KitProvider = ({ children }) => {
  const [buffersLoaded, setBuffersLoaded] = useState(false);
  const kitRef = useRef(initialKit);

  const loadSamples = () => {
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
          if (i === 8) setBuffersLoaded(true);
        }
      );
      kitRef.current.sounds[i].channel = new Tone.Channel({
        volume: 0,
        pan: 0,
        channelCount: 2,
      }).toDestination();
      kitRef.current.sounds[i].sampler.connect(
        kitRef.current.sounds[i].channel
      );
    }
  };

  const disposeSamples = () => {
    for (let i = 0; i < 9; i++) {
      kitRef.current.sounds[i].sampler.dispose();
      kitRef.current.sounds[i].channel.dispose();
    }
  };

  useEffect(() => {
    loadSamples();
  }, []);

  return (
    <Kit.Provider
      value={{
        kitRef: kitRef,
        kit: kitRef.current,
        disposeSamples,
        loadSamples,
        buffersLoaded,
        setBuffersLoaded,
      }}
    >
      {children}
    </Kit.Provider>
  );
};
