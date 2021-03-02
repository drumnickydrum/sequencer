import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { analog as kit } from '../kits/defaultKits';

export const Kit = React.createContext();
export const KitProvider = ({ children }) => {
  const kitRef = useRef(kit.map((sound) => ({ ...sound })));

  useEffect(() => {
    for (let i = 0; i < 9; i++) {
      kitRef.current[i].sampler = new Tone.Sampler({
        C2: kitRef.current[i].sample,
      });
      kitRef.current[i].channel = new Tone.Channel({
        volume: 0,
        pan: 0,
        channelCount: 2,
      }).toDestination();
      kitRef.current[i].sampler.connect(kitRef.current[i].channel);
      document.addEventListener('getBufferDuration', () => {
        kitRef.current[i].duration = kitRef.current[
          i
        ].sampler._buffers._buffers.get('36')._buffer.duration;
      });
    }
  }, []);

  const [refreshMods, setRefreshMods] = useState(false);

  return (
    <Kit.Provider
      value={{
        kit: kitRef.current,
        refreshMods,
        setRefreshMods,
      }}
    >
      {children}
    </Kit.Provider>
  );
};
