import React, { useState, useEffect, useContext } from 'react';
import {
  CloseIcon,
  CopyIcon,
  LengthIcon,
  EraserIcon,
  PitchIcon,
  SawIcon,
  VelocityIcon,
  PointDownIcon,
} from '../icons';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';
import { useSoloAndMute } from './useSoloAndMute';
import { Erase, Slice, Copy } from './EraseSliceCopy';
import { PitchVelocityLength } from './PitchVelocityLength';
import { Status } from '../Providers/Status';

export const SoundPanel = () => {
  const { spAlert } = useContext(Status);
  const {
    selectedSound,
    setSelectedSound,
    erasing,
    setErasing,
    slicing,
    setSlicing,
    copying,
    setCopying,
    mod,
    setMod,
  } = useContext(Pattern);
  const { kitRef } = useContext(Kit);
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
    if (erasing) {
      handleErase();
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

  const handleErase = () => {
    setErasing((erasing) => !erasing);
  };

  const handleSlice = () => {
    const cells = document.querySelectorAll('.noteOn');
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
    const cells = document.querySelectorAll('.noteOn');
    if (type === 'return') {
      cells.forEach((cell) => cell.classList.remove('flashing'));
      setMod('');
    } else {
      cells.forEach((cell) => cell.classList.add('flashing'));
      setMod(type);
    }
  };

  const index = spAlert.indexOf('#');
  const alert = spAlert.substr(index + 1);

  return (
    <>
      <div id='sp-alert' className='sp-alert'>
        <span className='menu-dummy' />
        <p className='alert'>{alert}</p>
        <PointDownIcon />
        <span className='menu-dummy' />
      </div>
      {showEditMenu ? (
        <div className='sound-edit'>
          {erasing ? (
            <Erase handleReturn={handleReturn} />
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
              <button className='sound-edit-close' onClick={handleReturn}>
                <CloseIcon />
              </button>
              <div className='sound-edit-dummy' />
              <button
                className={
                  erasing
                    ? `sound-edit-btn color${selectedSound}`
                    : 'sound-edit-btn'
                }
                onClick={handleErase}
              >
                <div className='sound-edit-icon-div'>
                  <EraserIcon />
                  <p>Erase</p>
                </div>
              </button>
              <button className='sound-edit-btn' onClick={handleSlice}>
                <div className='sound-edit-icon-div'>
                  <SawIcon />
                  <p>Slice</p>
                </div>
              </button>
              <button className='sound-edit-btn' onClick={handleCopy}>
                <div className='sound-edit-icon-div'>
                  <CopyIcon />
                  <p>Copy</p>
                </div>
              </button>
              <button
                className='sound-edit-btn'
                onClick={() => handleCellMod('velocity')}
              >
                <div className='sound-edit-icon-div'>
                  <VelocityIcon />
                  <p>Velocity</p>
                </div>
              </button>
              <button
                className='sound-edit-btn'
                onClick={() => handleCellMod('length')}
              >
                <div className='sound-edit-icon-div'>
                  <LengthIcon />
                  <p>Length</p>
                </div>
              </button>
              <button
                className='sound-edit-btn'
                onClick={() => handleCellMod('pitch')}
              >
                <div className='sound-edit-icon-div'>
                  <PitchIcon />
                  <p>Pitch</p>
                </div>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className='sound-menu'>
          {kitRef.current.sounds.map((sound, i) => (
            <SoundBtn
              key={`sound-menu-${sound.name}`}
              i={i}
              sound={sound}
              selectedSound={selectedSound}
              handleSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </>
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
