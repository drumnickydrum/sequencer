import React from 'react';
import { CopyIcon, SawIcon } from '../icons';

export const Slice = () => {
  return (
    <div className='sound-edit-detail'>
      <div className='sound-edit-title'>
        <SawIcon addClass='slicing' />
        <p>Slice</p>
      </div>
      <p className='sound-edit-instructions'>
        Click each cell to slice into halves or thirds
      </p>
    </div>
  );
};

export const Copy = () => {
  return (
    <div className='sound-edit-detail'>
      <div className='sound-edit-title'>
        <CopyIcon addClass='copying' />
        <p>Copy</p>
      </div>
      <p className='sound-edit-instructions'>
        Click to paste current sound's pattern
      </p>
    </div>
  );
};
