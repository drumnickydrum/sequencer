import React from 'react';
import { CloseIcon, CopyIcon, EraserIcon, SawIcon } from '../icons';

export const Erase = ({ handleReturn }) => {
  return (
    <div className='sound-edit-detail'>
      <button className='sound-edit-btn' onClick={handleReturn}>
        <CloseIcon />
        <p>Menu</p>
      </button>
      <p className='sound-edit-instructions'>
        Click and drag to toggle cells off
      </p>
      <EraserIcon />
    </div>
  );
};

export const Slice = ({ handleReturn }) => {
  return (
    <div className='sound-edit-detail'>
      <button className='sound-edit-btn' onClick={handleReturn}>
        <CloseIcon />
        <p>Menu</p>
      </button>
      <p className='sound-edit-instructions'>
        Click each cell to slice into halves or thirds
      </p>
      <SawIcon addClass='slicing' />
    </div>
  );
};

export const Copy = ({ handleReturn }) => {
  return (
    <div className='sound-edit-detail'>
      <button className='sound-edit-btn' onClick={handleReturn}>
        <CloseIcon />
        <p>Menu</p>
      </button>
      <p className='sound-edit-instructions'>
        Click to paste current sound's pattern
      </p>
      <CopyIcon />
    </div>
  );
};
