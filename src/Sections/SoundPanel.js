import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import {
  ClearOneIcon,
  CopyIcon,
  MuteIcon,
  SawIcon,
  SoloIcon,
  SwipeVerticalIcon,
} from '../icons';
import { Knob } from '../icons/Knob';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';
import { Info } from '../Providers/Info';

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
          <SoundEdit selectedSound={selectedSound} />
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

const SoloAndMute = ({ closeCbRef, selectedSound }) => {
  const { kit } = useContext(Kit);
  const [solo, setSolo] = useState(false);
  const [mute, setMute] = useState(false);
  closeCbRef.current.push(
    () => {
      if (solo) handleSolo();
    },
    () => {
      if (mute) handleMute();
    }
  );

  const handleSolo = () => {
    const soundCells = document.querySelectorAll('.sound-cells');
    if (solo) {
      soundCells.forEach((soundCell) => soundCell.classList.remove('off'));
      kit[selectedSound].channel.solo = false;
      setSolo(false);
    } else {
      if (mute) handleMute();
      soundCells.forEach((soundCell) => soundCell.classList.add('off'));
      kit[selectedSound].channel.solo = true;
      setSolo(true);
    }
  };

  const handleMute = () => {
    const cells = document.querySelectorAll('.on');
    if (mute) {
      cells.forEach((cell) => cell.classList.remove('dim'));
      kit[selectedSound].channel.mute = false;
      setMute(false);
    } else {
      if (solo) handleSolo();
      cells.forEach((cell) => cell.classList.add('dim'));
      kit[selectedSound].channel.mute = true;
      setMute(true);
    }
  };

  return (
    <div className='sound-edit'>
      <div className='sound-channel-edit'>
        <div className='sound-channel-edit-btn' onClick={handleSolo}>
          <SoloIcon addClass={mute ? 'dim' : ''} />
          <p className={mute ? 'dim' : ''}>Solo</p>
        </div>
        <div className='sound-channel-edit-btn' onClick={handleMute}>
          <MuteIcon addClass={solo ? 'dim' : ''} />
          <p className={solo ? 'dim' : ''}>Mute</p>
        </div>
      </div>
    </div>
  );
};

const SliceAndCopy = ({ closeCbRef }) => {
  const { slicing, setSlicing, copying, setCopying } = useContext(Pattern);
  closeCbRef.current.push(
    () => {
      setSlicing(false);
    },
    () => {
      setCopying(false);
    }
  );

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
            <CopyIcon addClass={copying ? 'copying' : ''} />
            <p>{copying ? 'Finish' : 'Copy'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SoundEdit = ({ selectedSound }) => {
  const { setInfo } = useContext(Info);
  const { kit, setRefreshMods } = useContext(Kit);

  const [velocityVal, setVelocityVal] = useState(
    kit[selectedSound].velocityMod * 100
  );
  const [pitchVal, setPitchVal] = useState(
    Math.round(kit[selectedSound].pitchMod / 0.1) + 50
  );
  const [lengthVal, setLengthVal] = useState(
    kit[selectedSound].lengthMod * 100 + 0.1
  );

  useEffect(() => {
    kit[selectedSound].velocityMod = velocityVal * 0.01;
  }, [velocityVal]);

  useEffect(() => {
    let pitchMod = Math.round((pitchVal - 50) * 0.1);
    kit[selectedSound].pitchMod =
      pitchMod < -5 ? -5 : pitchMod > 5 ? 5 : pitchMod;
  }, [pitchVal]);

  useEffect(() => {
    kit[selectedSound].lengthMod = lengthVal * 0.01 + 0.01;
  }, [lengthVal]);

  const [y, setY] = useState(null);
  const prevRef = useRef(null);
  const handleTouchStart = (e, type) => {
    setInfo({
      h: '',
      i: <SwipeVerticalIcon />,
      p: 'Swipe vertically to adjust',
      show: true,
    });
    setY(e.changedTouches[0].clientY);
    prevRef.current =
      type === 'velocity'
        ? velocityVal
        : type === 'pitch'
        ? pitchVal
        : lengthVal;
  };

  const handleTouchMove = (e, type) => {
    const newY = e.changedTouches[0].clientY;
    if (newY - y > 1) {
      switch (type) {
        case 'velocity':
          setVelocityVal((val) => (val - 6 < 0 ? 0 : val - 6));
          break;
        case 'pitch':
          setPitchVal((val) => (val - 6 < 0 ? 0 : val - 6));
          break;
        case 'length':
          setLengthVal((val) => (val - 6 < 0 ? 0 : val - 6));
          break;
        default:
          return;
      }
    } else if (newY - y < -1) {
      switch (type) {
        case 'velocity':
          setVelocityVal((val) => (val + 6 > 100 ? 100 : val + 6));
          break;
        case 'pitch':
          setPitchVal((val) => (val + 6 > 100 ? 100 : val + 6));
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

  const handleTouchEnd = (type) => {
    setInfo({ h: '', i: null, p: '', show: false });
    setY(null);
    const newVal =
      type === 'velocity'
        ? velocityVal
        : type === 'pitch'
        ? pitchVal
        : lengthVal;
    setRefreshMods(true);
  };

  return (
    <div className='sound-edit'>
      <div className={`sample-edit color${selectedSound}`}>
        <div className='knob-wrapper'>
          <div
            className='knob'
            id='velocity-knob'
            onTouchStart={(e) => handleTouchStart(e, 'velocity')}
            onTouchMove={(e) => handleTouchMove(e, 'velocity')}
            onTouchEnd={() => handleTouchEnd('velocity')}
          >
            <label htmlFor='velocity-knob'>velocity</label>
            <Knob value={velocityVal} />
          </div>
          <p onClick={() => setVelocityVal(100)}>reset</p>
        </div>
        <div className='knob-wrapper'>
          <div
            className='knob'
            id='pitch-knob'
            onTouchStart={(e) => handleTouchStart(e, 'pitch')}
            onTouchMove={(e) => handleTouchMove(e, 'pitch')}
            onTouchEnd={() => handleTouchEnd('pitch')}
          >
            <label htmlFor='pitch-knob'>pitch</label>

            <Knob value={pitchVal} />
          </div>
          <p onClick={() => setPitchVal(50)}>reset</p>
        </div>
        <div className='knob-wrapper'>
          <div
            className='knob'
            id='length-knob'
            onTouchStart={(e) => handleTouchStart(e, 'length')}
            onTouchMove={(e) => handleTouchMove(e, 'length')}
            onTouchEnd={() => handleTouchEnd('length')}
          >
            <label htmlFor='length-knob'>length</label>
            <Knob value={lengthVal} />
          </div>
          <p onClick={() => setLengthVal(100)}>reset</p>
        </div>
      </div>
    </div>
  );
};

const CellEdit = ({ closeCbRef, selectedSound }) => {
  const { cellMod, setCellMod } = useContext(Pattern);
  closeCbRef.current.push(() => {
    setCellMod('');
  });

  return (
    <div className='sound-edit'>
      <div className={`sample-edit color${selectedSound}`}>
        <div onClick={() => setCellMod('')}>cancel</div>
        <div onClick={() => setCellMod('velocity')}>
          <p>velocity</p>
          {cellMod === 'velocity' && 'editing'}
        </div>
        <div onClick={() => setCellMod('length')}>
          <p>length</p>
          {cellMod === 'length' && 'editing'}
        </div>
      </div>
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
