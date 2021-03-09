import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { analog as kit } from '../defaults/defaultKits';

export const Kit = React.createContext();
export const KitProvider = ({ children }) => {
  const kitRef = useRef(kit);

  useEffect(() => {
    for (let i = 0; i < 9; i++) {
      kitRef.current.sounds[i].sampler = new Tone.Sampler(
        {
          C2: kitRef.current.sounds[i].sample,
        },
        () => {
          kitRef.current.sounds[i].duration = kitRef.current.sounds[
            i
          ].sampler._buffers._buffers.get('36')._buffer.duration;
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
  }, [kitRef]);

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
