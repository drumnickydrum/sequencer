import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { eraseSound } from '../../reducers/sequenceSlice';
import { Button } from '../../../../components/Button';
import {
  ChevronLeftIcon,
  CopyIcon,
  EraserIcon,
  SawIcon,
} from '../../../../icons';

export const Erase = ({ onReturn }) => {
  const dispatch = useDispatch();
  const selectedSound = useSelector((state) => state.editor.selectedSound);
  const disabled = useSelector(
    (state) => state.sequence.present.noteTally[selectedSound].empty
  );

  useEffect(() => {
    if (disabled) onReturn();
  }, [onReturn, disabled]);

  const onEraseAll = () => {
    dispatch(eraseSound({ selectedSound }));
  };

  // console.log('rendering: Erase');
  return (
    <div className='sound-edit-detail'>
      <Button classes='sound-edit-close' onClick={onReturn}>
        <ChevronLeftIcon />
      </Button>
      <div className='sound-edit-dummy' />
      <div className='sound-edit-middle'>
        <p className=''>Click and drag to erase cells</p>
        <Button
          classes='sound-edit-btn mod-all'
          disabled={disabled}
          onClick={onEraseAll}
        >
          Erase All
        </Button>
      </div>
      <EraserIcon />
    </div>
  );
};

export const Slice = ({ onReturn }) => {
  // console.log('rendering: Slice');
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
  // console.log('rendering: Copy');
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
