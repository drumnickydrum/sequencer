import React, { useState, useEffect, useContext } from 'react';
import {
  ChevronTripleRightIcon,
  CloseIcon,
  CopyIcon,
  LengthIcon,
  MuteIcon,
  PaintIcon,
  PitchIcon,
  SawIcon,
  SoloIcon,
  VelocityIcon,
} from '../icons';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';
import { useSoloAndMute } from './useSoloAndMute';
import { Paint, Slice, Copy } from './PaintSliceCopy';
import { PitchVelocityLength } from './PitchVelocityLength';
import { ChangeKit } from './ChangeKit';
import { ChangePattern } from './ChangePattern';

export const SoundPanel = () => {
  const {
    selectedSound,
    setSelectedSound,
    painting,
    setPainting,
    slicing,
    setSlicing,
    copying,
    setCopying,
    mod,
    setMod,
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
    if (painting) {
      handlePaint();
    } else if (slicing) {
      handleSlice();
    } else if (copying) {
      handleCopy();
    } else if (mod) {
      handleCellMod('return');
    } else {
      if (solo) handleSolo();
      if (mute) handleMute();
      setShowEditMenu(false);
    }
  };

  const handlePaint = () => {
    setPainting((painting) => !painting);
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
      setMod('');
    } else {
      cells.forEach((cell) => cell.classList.add('flashing'));
      setMod(type);
    }
  };

  return showEditMenu ? (
    <div className='sound-edit'>
      {painting ? (
        <Paint handleReturn={handleReturn} />
      ) : slicing ? (
        <Slice handleReturn={handleReturn} />
      ) : copying ? (
        <Copy handleReturn={handleReturn} />
      ) : mod ? (
        <PitchVelocityLength
          type={mod}
          selectedSound={selectedSound}
          handleReturn={handleReturn}
        />
      ) : (
        <div className='sound-edit-menu'>
          <button className='sound-edit-btn' onClick={handleReturn}>
            <CloseIcon />
            <p>Sound Menu</p>
          </button>

          <button
            className={
              painting
                ? `sound-edit-btn color${selectedSound}`
                : 'sound-edit-btn'
            }
            onClick={handlePaint}
          >
            <PaintIcon />
            <p>Paint</p>
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
    <div className='scroll-container'>
      <div className='sound-menu'>
        {kit.sounds.map((sound, i) => (
          <SoundBtn
            key={`sound-menu-${sound.name}`}
            i={i}
            sound={sound}
            selectedSound={selectedSound}
            handleSelect={handleSelect}
          />
        ))}
        {/* <ChevronTripleRightIcon /> */}
      </div>
      <ChangeKit />
      <ChangePattern />
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
