import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { ClearOneIcon, SwipeVerticalIcon } from '../icons';
import { Knob } from '../icons/Knob';
import { kit } from '../Kit';
import { Pattern } from '../Providers/Pattern';
import { Info } from '../Providers/Info';

export const SoundSelector = () => {
  const { selectedSound, setSelectedSound } = useContext(Pattern);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!edit) setSelectedSound(-1);
  }, [edit]);

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

  const [volVal, setVolVal] = useState(100);
  const [tuneVal, setTuneVal] = useState(50);
  const [lengthVal, setLengthVal] = useState(100);

  let timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const db = volVal === 0 ? -100 : (-100 + volVal) * 0.2;
      kit[selectedSound].sampler.volume.value = db > 0 ? 0 : db;
      console.log(db);
    }, 50);

    return () => clearTimeout(timerRef.current);
  }, [volVal]);

  useEffect(() => {
    const old = kit[selectedSound].sampler._buffers._buffers.get('36');
    kit[selectedSound].sampler._buffers._buffers.set('30', old);
  }, [tuneVal]);

  const [y, setY] = useState(null);
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
        <div className='knob-wrapper'>
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
          <p onClick={() => setVolVal(100)}>reset</p>
        </div>
        <div className='knob-wrapper'>
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
          <p onClick={() => setTuneVal(50)}>reset</p>
        </div>
        <div className='knob-wrapper'>
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
          <p onClick={() => setLengthVal(100)}>reset</p>
        </div>
      </div>
      <button onClick={() => setEdit(false)}>Close</button>
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
