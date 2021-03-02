import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { ClearOneIcon, CopyIcon, SawIcon, SwipeVerticalIcon } from '../icons';
import { Knob } from '../icons/Knob';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';
import { Info } from '../Providers/Info';

export const SoundPanel = () => {
  const { selectedSound, setSelectedSound } = useContext(Pattern);
  const { kit } = useContext(Kit);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!edit) setSelectedSound(-1);
  }, [edit]);

  const handleClick = (i) => {
    setSelectedSound(i === selectedSound ? -1 : i);
    setEdit(true);
  };

  return edit ? (
    // <SoundEdit setEdit={setEdit} selectedSound={selectedSound} />
    <SliceAndCopy setEdit={setEdit} selectedSound={selectedSound} />
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

const SliceAndCopy = ({ setEdit }) => {
  const { slicing, setSlicing, copying, setCopying } = useContext(Pattern);

  const handleSlice = () => {
    const cells = document.querySelectorAll('.on');
    if (slicing) {
      cells.forEach((cell) => cell.classList.remove('flashing'));
      setSlicing(false);
    } else {
      cells.forEach((cell) => cell.classList.add('flashing'));
      setSlicing(true);
    }
  };

  const handleCopy = () => {
    setCopying((copying) => !copying);
  };

  const handleClose = () => {
    setSlicing(false);
    setCopying(false);
    setEdit(false);
  };

  return (
    <div className='sound-edit'>
      <div className='sound-pattern-edit'>
        {copying ? (
          <p className='instruction'>Click sound to paste copied pattern</p>
        ) : (
          <div className='sound-pattern-edit-btn' onClick={handleSlice}>
            <SawIcon addClass={slicing ? 'slicing' : ''} />
            <p>{slicing ? 'Finish' : 'Slice'}</p>
          </div>
        )}
        {slicing ? (
          <p className='instruction'>Click cell to slice in half or thirds</p>
        ) : (
          <div className='sound-pattern-edit-btn' onClick={handleCopy}>
            <CopyIcon addClass={copying ? 'flashing' : ''} />
            <p>{copying ? 'Finish' : 'Copy'}</p>
          </div>
        )}
      </div>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

const SoundEdit = ({ setEdit, selectedSound }) => {
  const { setInfo } = useContext(Info);
  const { kit } = useContext(Kit);

  const [volVal, setVolVal] = useState(kit[selectedSound].volumeMod * 100);
  const [tuneVal, setTuneVal] = useState(
    Math.round(kit[selectedSound].pitchMod / 0.1) + 50
  );
  const [lengthVal, setLengthVal] = useState(
    kit[selectedSound].durationMod * 100 + 0.1
  );

  useEffect(() => {
    kit[selectedSound].volumeMod = volVal * 0.01;
  }, [volVal]);

  useEffect(() => {
    let pitchMod = Math.round((tuneVal - 50) * 0.1);
    kit[selectedSound].pitchMod =
      pitchMod < -5 ? -5 : pitchMod > 5 ? 5 : pitchMod;
  }, [tuneVal]);

  useEffect(() => {
    kit[selectedSound].durationMod = lengthVal * 0.01 + 0.01;
  }, [lengthVal]);

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
