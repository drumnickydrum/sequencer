import React, { useContext, useMemo } from 'react';
import { Instrument } from '../Providers/Instrument';
import { Pattern } from '../Providers/Pattern';

export const SoundSelector = () => {
  const { instrument } = useContext(Instrument);
  const { selectedSound, setSelectedSound } = useContext(Pattern);

  const handleClick = (i) => {
    setSelectedSound(i === selectedSound ? -1 : i);
  };

  return (
    <div id='sound-selector'>
      {instrument.map((sound, i) => (
        <SoundBtn
          key={`sound-selector-${sound.name}`}
          i={i}
          sound={sound}
          selectedSound={selectedSound}
          handleClick={handleClick}
        />
      ))}
    </div>
  );
};

const SoundBtn = ({ i, sound, selectedSound, handleClick }) => {
  const soundBtnMemo = useMemo(() => {
    let classes = 'sound';
    if (i === selectedSound) classes += ` border${sound.color}`;
    return (
      <div className={classes} onClick={() => handleClick(i)}>
        {sound.name}
      </div>
    );
  });
  return soundBtnMemo;
};
