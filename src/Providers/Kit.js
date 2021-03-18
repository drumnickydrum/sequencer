import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import * as defaultKits from '../defaults/defaultKits';
import { getLS, setLS } from '../utils/storage';

const kit = getLS('kit') || 'analog';
const initialSounds = defaultKits[kit].sounds.map((sound) => ({ ...sound }));
const initialKit = { name: defaultKits[kit].name, sounds: initialSounds };

export const Kit = React.createContext();
export const KitProvider = ({ children }) => {
  const [buffersLoaded, setBuffersLoaded] = useState(false);
  const [currentKit, setCurrentKit] = useState(initialKit.name);
  useEffect(() => {
    setLS('kit', currentKit);
  }, [currentKit]);
  const kitRef = useRef(initialKit);

  const loadSamples = (kit) => {
    console.log('loading samples');
    for (let i = 0; i < 9; i++) {
      kitRef.current.sounds[i].sampler = new Tone.Sampler({
        urls: {
          C2: kitRef.current.sounds[i].sample,
        },
        onload: () => {
          kitRef.current.sounds[i].duration = kitRef.current.sounds[
            i
          ].sampler._buffers._buffers.get('36')._buffer.duration;
          if (i === 8) {
            console.log(kit, 'buffers loaded');
            setBuffersLoaded(true);
          }
        },
      });
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
      delete kitRef.current.sounds[i].sampler;
      kitRef.current.sounds[i].channel.dispose();
      delete kitRef.current.sounds[i].channel;
    }
  };

  useEffect(() => {
    loadSamples('default');
  }, []);

  return (
    <Kit.Provider
      value={{
        kitRef: kitRef,
        currentKit,
        setCurrentKit,
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
