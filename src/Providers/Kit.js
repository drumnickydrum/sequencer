import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as Tone from 'tone';
import { setLS } from '../utils/storage';

export const Kit = React.createContext();
export const KitProvider = ({ children }) => {
  const kit = useSelector((state) => state.kit.present);
  const kitRef = useRef({ name: 'empty', sounds: kit.sounds });
  const [buffersLoaded, setBuffersLoaded] = useState(false);

  const disposeSamples = useCallback(() => {
    for (let i = 0; i < 9; i++) {
      kitRef.current.sounds[i].sampler.dispose();
      delete kitRef.current.sounds[i].sampler;
      kitRef.current.sounds[i].channel.dispose();
      delete kitRef.current.sounds[i].channel;
    }
  }, []);
  document.addEventListener('disposeKit', disposeSamples);

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

  useEffect(() => {
    kitRef.current.name = kit.name;
    kitRef.current.sounds = kit.sounds.map((sound) => ({ ...sound }));
    setLS('kit', kit.name);
    console.log('kit changed to: ', kit.name);
    if (Tone.Transport.state === 'started') {
      setBuffersLoaded(false);
      document.dispatchEvent(new Event('prepRestart'));
    } else {
      loadSamples(kit.name);
    }
  }, [disposeSamples, kit]);

  const soundsRef = useRef({});

  return (
    <Kit.Provider
      value={{
        kitRef,
        buffersLoaded,
        setBuffersLoaded,
        soundsRef,
        loadSamples,
      }}
    >
      {children}
    </Kit.Provider>
  );
};
