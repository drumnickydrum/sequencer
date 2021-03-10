import React, { useState, useEffect, useContext } from 'react';
import * as Tone from 'tone';
import { ChevronDownIcon } from '../icons';
import * as kits from '../defaults/defaultKits';
import { Kit } from '../Providers/Kit';
import { SetSequencer } from '../Providers/Sequencer';

export const ChangeKit = () => {
  const {
    kitRef,
    disposeSamples,
    loadSamples,
    buffersLoaded,
    setBuffersLoaded,
  } = useContext(Kit);
  const { stop, start } = useContext(SetSequencer);
  const [restart, setRestart] = useState(false);
  const [kitName, setKitName] = useState(kitRef.current.name);

  useEffect(() => {
    if (buffersLoaded && restart) {
      start();
      setRestart(false);
    }
  }, [buffersLoaded, restart, start]);

  const handleChange = ({ target: { value } }) => {
    if (Tone.Transport.state === 'started') setRestart(true);
    stop();
    setBuffersLoaded(false);
    disposeSamples();
    const newSounds = kits[value].sounds.map((sound) => ({ ...sound }));
    const newKit = { name: value, sounds: newSounds };
    kitRef.current = newKit;
    loadSamples();
    setKitName(value);
  };
  return (
    <div className='change-kit'>
      <h1>Change Kit</h1>
      <div className='custom-select'>
        <select className='kit-select' value={kitName} onChange={handleChange}>
          {Object.keys(kits).map((kit) => {
            return (
              <option key={`ck-${kit}`} value={kit}>
                {kit}
              </option>
            );
          })}
        </select>
        <ChevronDownIcon />
      </div>
    </div>
  );
};
