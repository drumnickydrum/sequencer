import React from 'react';
import { CopyIcon, PaintIcon, SawIcon } from '../icons';

export const Paint = ({ handleReturn }) => {
  return (
    <div className='sound-edit-detail'>
      <div className='sound-edit-title' onClick={handleReturn}>
        <PaintIcon />
        <p>Go Back</p>
      </div>
      <p className='sound-edit-instructions'>Click and drag to toggle cells</p>
    </div>
  );
};

export const Slice = ({ handleReturn }) => {
  return (
    <div className='sound-edit-detail'>
      <div className='sound-edit-title' onClick={handleReturn}>
        <SawIcon addClass='slicing' />
        <p>Go Back</p>
      </div>
      <p className='sound-edit-instructions'>
        Click each cell to slice into halves or thirds
      </p>
    </div>
  );
};

export const Copy = ({ handleReturn }) => {
  return (
    <div className='sound-edit-detail'>
      <div className='sound-edit-title' onClick={handleReturn}>
        <CopyIcon addClass='copying' />
        <p>Go Back</p>
      </div>
      <p className='sound-edit-instructions'>
        Click to paste current sound's pattern
      </p>
    </div>
  );
};
