import React, { useContext, useState, useEffect } from 'react';
import { Instrument } from '../Providers/Instrument';
import { Editor } from '../Providers/Editor';

export const SoundSelector = () => {
  const { instrument } = useContext(Instrument);
  const { setSelectedSound } = useContext(Editor);
  return (
    <div id='sound-selector'>
      {instrument.map((sound) => (
        <div
          key={`sound-selector-${sound.name}`}
          className={`sound border${sound.color}`}
          onClick={() => setSelectedSound(sound.name)}
        >
          {sound.name}
        </div>
      ))}
    </div>
  );
};
