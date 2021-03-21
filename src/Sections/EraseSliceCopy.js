import React from 'react';
import { useDispatch } from 'react-redux';
import { eraseSound } from '../features/sequencer/sequencerSlice';
import { Button } from '../Components/Button';
import { ChevronLeftIcon, CopyIcon, EraserIcon, SawIcon } from '../icons';

export const Erase = ({ onReturn, selectedSound }) => {
  const dispatch = useDispatch();

  const onEraseAll = () => {
    dispatch(eraseSound({ selectedSound }));
  };

  return (
    <div className='sound-edit-detail'>
      <Button classes='sound-edit-close' onClick={onReturn}>
        <ChevronLeftIcon />
      </Button>
      <div className='sound-edit-dummy' />
      <div className='sound-edit-middle'>
        <p className=''>Click and drag to erase cells</p>
        <Button classes='sound-edit-btn mod-all' onClick={onEraseAll}>
          Erase All
        </Button>
      </div>
      <EraserIcon />
    </div>
  );
};

export const Slice = ({ onReturn }) => {
  return (
    <div className='sound-edit-detail'>
      <Button classes='sound-edit-close' onClick={onReturn}>
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

export const Copy = ({ onReturn }) => {
  return (
    <div className='sound-edit-detail'>
      <Button classes='sound-edit-close' onClick={onReturn}>
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
