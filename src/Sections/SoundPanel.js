import React, { useState, useEffect, useContext } from 'react';
import {
  CopyIcon,
  LengthIcon,
  MuteIcon,
  PitchIcon,
  SawIcon,
  SoloIcon,
  VelocityIcon,
} from '../icons';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';
import { useSoloAndMute } from './useSoloAndMute';
import { Slice, Copy } from './SliceAndCopy';
import { PitchVelocityLength } from './PitchVelocityLength';

export const SoundPanel = () => {
  const {
    selectedSound,
    setSelectedSound,
    slicing,
    setSlicing,
    copying,
    setCopying,
    cellMod,
    setCellMod,
  } = useContext(Pattern);
  const { kit } = useContext(Kit);
  const { solo, mute, handleSolo, handleMute } = useSoloAndMute();
  const [showEditMenu, setShowEditMenu] = useState(false);

  useEffect(() => {
    if (!showEditMenu) setSelectedSound(-1);
  }, [showEditMenu, setSelectedSound]);

  const handleSelect = (i) => {
    setSelectedSound(i === selectedSound ? -1 : i);
    setShowEditMenu(true);
  };

  const handleReturn = () => {
    if (slicing) {
      handleSlice();
    } else if (copying) {
      handleCopy();
    } else if (cellMod) {
      handleCellMod('return');
    } else {
      if (solo) handleSolo();
      if (mute) handleMute();
      setShowEditMenu(false);
    }
  };

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

  const handleCellMod = (type) => {
    const cells = document.querySelectorAll('.on');
    if (type === 'return') {
      cells.forEach((cell) => cell.classList.remove('flashing'));
      setCellMod('');
    } else {
      cells.forEach((cell) => cell.classList.add('flashing'));
      setCellMod(type);
    }
  };

  return showEditMenu ? (
    <div className='sound-edit'>
      <button className='sound-panel-return-btn' onClick={handleReturn}>
        {slicing || copying || cellMod ? 'Edit Menu' : 'Sound Menu'}
      </button>
      {slicing ? (
        <Slice />
      ) : copying ? (
        <Copy />
      ) : cellMod ? (
        <PitchVelocityLength type={cellMod} selectedSound={selectedSound} />
      ) : (
        <div className='sound-edit-menu'>
          <button className='sound-edit-btn' onClick={handleSolo}>
            <SoloIcon addClass={solo ? 'flashing' : mute ? 'dim' : ''} />
            <p className={solo ? 'flashing' : mute ? 'dim' : ''}>Solo</p>
          </button>
          <button className='sound-edit-btn' onClick={handleMute}>
            <MuteIcon addClass={mute ? 'flashing' : solo ? 'dim' : ''} />
            <p className={mute ? 'flashing' : solo ? 'dim' : ''}>Mute</p>
          </button>
          <button className='sound-edit-btn' onClick={handleSlice}>
            <SawIcon />
            <p>Slice</p>
          </button>
          <button className='sound-edit-btn' onClick={handleCopy}>
            <CopyIcon />
            <p>Copy</p>
          </button>
          <button
            className='sound-edit-btn'
            onClick={() => handleCellMod('velocity')}
          >
            <VelocityIcon />
            <p>Velocity</p>
          </button>
          <button
            className='sound-edit-btn'
            onClick={() => handleCellMod('length')}
          >
            <LengthIcon />
            <p>Length</p>
          </button>
          <button
            className='sound-edit-btn'
            onClick={() => handleCellMod('pitch')}
          >
            <PitchIcon />
            <p>Pitch</p>
          </button>
        </div>
      )}
    </div>
  ) : (
    <div id='sound-menu'>
      {kit.map((sound, i) => (
        <SoundBtn
          key={`sound-menu-${sound.name}`}
          i={i}
          sound={sound}
          selectedSound={selectedSound}
          handleSelect={handleSelect}
        />
      ))}
    </div>
  );
};

const SoundBtn = ({ i, sound, selectedSound, handleSelect }) => {
  let classes = `sound borderDefault`;
  if (i === selectedSound) classes += ` border${sound.color} `;
  return (
    <div className={classes} onClick={() => handleSelect(i)}>
      {sound.name}
    </div>
  );
};
