import React, { useContext } from 'react';
import { ChevronLeftIcon, CopyIcon, EraserIcon, SawIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';

export const Erase = ({ handleReturn }) => {
  const { clearPattern } = useContext(Pattern);

  const handleAll = () => {
    clearPattern(true);
  };

  return (
    <div className='sound-edit-detail'>
      <button className='sound-edit-close' onClick={handleReturn}>
        <ChevronLeftIcon />
      </button>
      <div className='sound-edit-dummy' />
      <div className='sound-edit-middle'>
        {/* <div className='sound-edit-dummy' /> */}
        <p className=''>Click and drag to toggle cells off</p>
        <button className='btn' onClick={handleAll}>
          Erase All
        </button>
      </div>
      <EraserIcon />
    </div>
  );
};

export const Slice = ({ handleReturn }) => {
  return (
    <div className='sound-edit-detail'>
      <button className='sound-edit-close' onClick={handleReturn}>
        <ChevronLeftIcon />
      </button>
      <div className='sound-edit-dummy' />
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
      <button className='sound-edit-close' onClick={handleReturn}>
        <ChevronLeftIcon />
      </button>
      <div className='sound-edit-dummy' />
      <p className='sound-edit-instructions'>
        Click to paste current sound's pattern
      </p>
      <CopyIcon />
    </div>
  );
};
