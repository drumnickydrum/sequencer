import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as Tone from 'tone';
import { setLS } from '../utils/storage';
import * as defaultKits from '../defaults/defaultKits';

const getInitialKit = (kit) => {
  const sounds = defaultKits[kit].sounds.map((sound) => ({
    ...sound,
  }));
  return {
    name: defaultKits[kit].name,
    sounds: sounds,
  };
};

export const Kit = React.createContext();
export const KitProvider = ({ children }) => {
  const kit = useSelector((state) => state.sequencer.present.kit);
  const kitRef = useRef(getInitialKit(kit));
  const [buffersLoaded, setBuffersLoaded] = useState(false);

  const disposeSamples = useCallback(() => {
    console.log('disposing: ', kitRef.current.name);
    for (let i = 0; i < 9; i++) {
      kitRef.current.sounds[i].sampler?.dispose();
      delete kitRef.current.sounds[i].sampler;
      kitRef.current.sounds[i].channel?.dispose();
      delete kitRef.current.sounds[i].channel;
    }
  }, []);

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
    loadSamples(kitRef.current.name);
  }, []);

  useEffect(() => {
    kitRef.current.name = defaultKits[kit].name;
    kitRef.current.sounds = defaultKits[kit].sounds.map((sound) => ({
      ...sound,
    }));
    console.log('kit changed to: ', kitRef.current.name);
    if (Tone.Transport.state === 'started') {
      setBuffersLoaded(false);
      document.dispatchEvent(new Event('prepRestart'));
      disposeSamples();
    } else {
      if (kitRef.current.sounds.length > 0) {
        disposeSamples();
        loadSamples(kitRef.current.name);
      }
    }
  }, [disposeSamples, kit]);

  return (
    <Kit.Provider
      value={{
        kitRef,
        buffersLoaded,
        setBuffersLoaded,
        loadSamples,
      }}
    >
      {children}
    </Kit.Provider>
  );
};
