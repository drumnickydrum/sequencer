import React, { useState, useContext } from 'react';
import { MuteIcon, SoloIcon } from '../icons';
import { Kit } from '../Providers/Kit';

export const SoloAndMute = ({ closeCbRef, selectedSound }) => {
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
