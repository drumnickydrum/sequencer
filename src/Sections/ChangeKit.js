import React, { useState, useEffect, useContext } from 'react';
import * as Tone from 'tone';
import { ChevronDownIcon } from '../icons';
import * as kits from '../defaults/defaultKits';
import { Kit } from '../Providers/Kit';
import { SetSequencer } from '../Providers/Sequencer';

export const ChangeKit = () => {
  const {
    kitRef,
    setLoadSamples,
    buffersLoaded,
    setBuffersLoaded,
  } = useContext(Kit);
  const { stop, start } = useContext(SetSequencer);
  const [restart, setRestart] = useState(false);

  useEffect(() => {
    if (buffersLoaded && restart) {
      start();
      setRestart(false);
    }
  }, [buffersLoaded, restart, start]);

  const handleChange = ({ target: { value } }) => {
    if (Tone.Transport.state === 'started') setRestart(true);
    stop();
    const newSounds = kits[value].sounds.map((sound) => ({ ...sound }));
    const newKit = { name: kits[value].name, sounds: newSounds };
    kitRef.current = newKit;
    setBuffersLoaded(false);
    setLoadSamples(true);
  };
  return (
    <div className='change-kit'>
      <h1>Change Kit</h1>
      <p>{buffersLoaded ? 'buffers loaded' : 'buffers not loaded'}</p>
      <div className='custom-select'>
        <select className='kit-select' onChange={handleChange}>
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
