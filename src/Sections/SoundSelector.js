import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ClearOneIcon } from '../icons';
import { Knob } from '../icons/Knob';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';

export const SoundSelector = () => {
  const { kit } = useContext(Kit);
  const { selectedSound, setSelectedSound } = useContext(Pattern);
  const [edit, setEdit] = useState(false);

  const handleClick = (i) => {
    setSelectedSound(i === selectedSound ? -1 : i);
    setEdit(true);
  };

  return edit ? (
    <SoundEdit setEdit={setEdit} selectedSound={selectedSound} />
  ) : (
    <div id='sound-selector'>
      {kit.map((sound, i) => (
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

const SoundEdit = ({ setEdit, selectedSound }) => {
  const [vol, setVol] = useState(0);
  const [tune, setTune] = useState('C2');
  const [length, setLength] = useState(1);

  const [volVal, setVolVal] = useState(100);
  const [tuneVal, setTuneVal] = useState(50);
  const [lengthVal, setLengthVal] = useState(50);

  useEffect(() => {
    console.log(volVal);
  }, [volVal]);

  return (
    <div className='sound-edit'>
      <div className={`sample-edit color${selectedSound}`}>
        <div
          className='knob'
          onClick={() =>
            console.log(
              document.getElementsByClassName('arc')[0].getTotalLength()
            )
          }
        >
          <label htmlFor='vol-knob'>vol</label>
          <input
            id='vol-knob'
            type='range'
            value={volVal}
            onChange={(e) => setVolVal(e.target.value)}
          />
          <Knob value={volVal} />
        </div>
        <div className='knob'>
          <label htmlFor='tune-knob'>tune</label>
          <input
            id='tune-knob'
            type='range'
            value={tuneVal}
            onChange={(e) => setTuneVal(e.target.value)}
          />
          <Knob value={tuneVal} />
        </div>
        <div className='knob'>
          <label htmlFor='length-knob'>length</label>
          <input
            id='length-knob'
            type='range'
            value={lengthVal}
            onChange={(e) => setLengthVal(e.target.value)}
          />
          <Knob value={lengthVal} />
        </div>
      </div>
      {/* <div className='pattern-edit'>
        <ClearOneIcon />
        <h1>Copy</h1>
        <h1>Slice</h1>
      </div> */}
    </div>
  );
};

const SoundBtn = ({ i, sound, selectedSound, handleClick }) => {
  const soundBtnMemo = useMemo(() => {
    let classes = `sound borderDefault`;
    if (i === selectedSound) classes += ` border${sound.color} `;
    return (
      <div className={classes} onClick={() => handleClick(i)}>
        {sound.name}
      </div>
    );
  });
  return soundBtnMemo;
};
