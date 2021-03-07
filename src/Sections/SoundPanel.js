import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';
import { CellEdit } from './CellEdit';
import { SliceAndCopy } from './SliceAndCopy';
import { SoloAndMute } from './SoloAndMute';

export const SoundPanel = () => {
  const { selectedSound, setSelectedSound } = useContext(Pattern);
  const { kit } = useContext(Kit);
  const [edit, setEdit] = useState(false);
  const closeCbRef = useRef([]);

  useEffect(() => {
    if (!edit) setSelectedSound(-1);
  }, [edit]);

  const handleClick = (i) => {
    setSelectedSound(i === selectedSound ? -1 : i);
    setEdit(true);
  };

  const handleClose = () => {
    while (closeCbRef.current.length > 0) {
      const cb = closeCbRef.current.pop();
      cb();
    }
    setEdit(false);
  };

  return edit ? (
    <div id='sound-panel-edit'>
      <div id='sound-scroll-container-container'>
        <div className='sound-scroll-container'>
          <CellEdit closeCbRef={closeCbRef} selectedSound={selectedSound} />
          <SoloAndMute closeCbRef={closeCbRef} selectedSound={selectedSound} />
          <SliceAndCopy closeCbRef={closeCbRef} />
        </div>
      </div>
      <button className='sound-close-btn' onClick={handleClose}>
        Close
      </button>
    </div>
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
