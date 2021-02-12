import React, { useContext } from 'react';
import { Instrument } from '../Providers/Instrument';
import { Editor } from '../Providers/Editor';

export const SoundSelector = () => {
  const { instrument } = useContext(Instrument);
  const { setSelectedSound } = useContext(Editor);

  return (
    <div id='sound-selector'>
      {instrument.map((sound, i) => (
        <div
          key={`sound-selector-${sound.name}`}
          className={`sound border${sound.color}`}
          onClick={() => setSelectedSound(i)}
        >
          {sound.name}
        </div>
      ))}
    </div>
  );
};
