import React, { useContext, useMemo } from 'react';
import { Instrument } from '../Providers/Instrument';
import { Editor } from '../Providers/Editor';

export const SoundSelector = () => {
  const { instrument } = useContext(Instrument);
  const { selectedSound, setSelectedSound } = useContext(Editor);

  return (
    <div id='sound-selector'>
      {instrument.map((sound, i) => (
        <SoundBtn
          key={`sound-selector-${sound.name}`}
          i={i}
          sound={sound}
          selectedSound={selectedSound}
          setSelectedSound={setSelectedSound}
        />
      ))}
    </div>
  );
};

const SoundBtn = ({ i, sound, selectedSound, setSelectedSound }) => {
  const soundBtnMemo = useMemo(() => {
    let classes = 'sound';
    if (i === selectedSound) classes += ` border${sound.color}`;
    return (
      <div className={classes} onClick={() => setSelectedSound(i)}>
        {sound.name}
      </div>
    );
  });
  return soundBtnMemo;
};
