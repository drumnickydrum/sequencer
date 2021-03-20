import React, { useContext } from 'react';
import { Button } from '../Components/Button';
import { ChevronLeftIcon, CopyIcon, EraserIcon, SawIcon } from '../icons';
import { PatternAction } from '../Providers/Actions/Pattern';
import { PatternState } from '../Providers/State/Pattern';

export const Erase = ({ handleReturn }) => {
  const { clearOneDisabled } = useContext(PatternState);
  const { clearPattern } = useContext(PatternAction);

  const handleAll = () => {
    clearPattern(true);
  };

  return (
    <div className='sound-edit-detail'>
      <Button classes='sound-edit-close' onClick={handleReturn}>
        <ChevronLeftIcon />
      </Button>
      <div className='sound-edit-dummy' />
      <div className='sound-edit-middle'>
        <p className=''>Click and drag to toggle cells off</p>
        <Button
          classes='sound-edit-btn mod-all'
          disabled={clearOneDisabled}
          onClick={handleAll}
        >
          Erase All
        </Button>
      </div>
      <EraserIcon />
    </div>
  );
};

export const Slice = ({ handleReturn }) => {
  return (
    <div className='sound-edit-detail'>
      <Button classes='sound-edit-close' onClick={handleReturn}>
        <ChevronLeftIcon />
      </Button>
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
      <Button classes='sound-edit-close' onClick={handleReturn}>
        <ChevronLeftIcon />
      </Button>
      <div className='sound-edit-dummy' />
      <p className='sound-edit-instructions'>
        Click to paste current sound's pattern
      </p>
      <CopyIcon />
    </div>
  );
};
