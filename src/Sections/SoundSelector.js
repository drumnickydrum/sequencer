import React, { useState, useEffect, useContext, useMemo } from 'react';
import { ClearOneIcon, SwipeVerticalIcon } from '../icons';
import { Knob } from '../icons/Knob';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';
import { Info } from '../Providers/Info';

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
  const { setInfo } = useContext(Info);

  const [vol, setVol] = useState(0);
  const [tune, setTune] = useState('C2');
  const [length, setLength] = useState(1);

  const [volVal, setVolVal] = useState(100);
  const [tuneVal, setTuneVal] = useState(50);
  const [lengthVal, setLengthVal] = useState(100);

  const [y, setY] = useState(null);

  useEffect(() => {
    console.log(volVal);
  }, [volVal]);

  const handleTouchStart = (e) => {
    setInfo({
      h: '',
      i: <SwipeVerticalIcon />,
      p: 'Swipe vertically to adjust',
      show: true,
    });
    setY(e.changedTouches[0].clientY);
  };

  const handleTouchMove = (e, type) => {
    const newY = e.changedTouches[0].clientY;
    if (newY - y > 1) {
      switch (type) {
        case 'vol':
          setVolVal((val) => (val - 6 < 0 ? 0 : val - 6));
          break;
        case 'tune':
          setTuneVal((val) => (val - 6 < 0 ? 0 : val - 6));
          break;
        case 'length':
          setLengthVal((val) => (val - 6 < 0 ? 0 : val - 6));
          break;
        default:
          return;
      }
    } else if (newY - y < -1) {
      switch (type) {
        case 'vol':
          setVolVal((val) => (val + 6 > 100 ? 100 : val + 6));
          break;
        case 'tune':
          setTuneVal((val) => (val + 6 > 100 ? 100 : val + 6));
          break;
        case 'length':
          setLengthVal((val) => (val + 6 > 100 ? 100 : val + 6));
          break;
        default:
          return;
      }
    }
    setY(newY);
  };

  const handleTouchEnd = () => {
    setInfo({ h: '', i: null, p: '', show: false });
    setY(null);
  };

  return (
    <div className='sound-edit'>
      <div className={`sample-edit color${selectedSound}`}>
        <div
          className='knob'
          id='vol-knob'
          onTouchStart={handleTouchStart}
          onTouchMove={(e) => handleTouchMove(e, 'vol')}
          onTouchEnd={handleTouchEnd}
        >
          <label htmlFor='vol-knob'>vol</label>
          <Knob value={volVal} />
        </div>
        <div
          className='knob'
          id='tune-knob'
          onTouchStart={handleTouchStart}
          onTouchMove={(e) => handleTouchMove(e, 'tune')}
          onTouchEnd={handleTouchEnd}
        >
          <label htmlFor='tune-knob'>tune</label>

          <Knob value={tuneVal} />
        </div>
        <div
          className='knob'
          id='length-knob'
          onTouchStart={handleTouchStart}
          onTouchMove={(e) => handleTouchMove(e, 'length')}
          onTouchEnd={handleTouchEnd}
        >
          <label htmlFor='length-knob'>length</label>
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
