import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '../Components/Button';
import { eraseAll } from '../features/sequencer/sequencerSlice';
import { ClearAllIcon, RedoIcon, UndoIcon } from '../icons';
import { Kit } from '../Providers/Kit';
import { Undo } from '../Providers/UndoProvider';

export const UndoRedo = () => {
  const { undo, redo, undoDisabled, redoDisabled } = useContext(Undo);
  const { buffersLoaded } = useContext(Kit);

  return (
    <div className='menu-items'>
      <span className='menu-dummy' />
      <Button
        id='undo'
        classes='menu-btn'
        disabled={undoDisabled || !buffersLoaded}
        onClick={undo}
      >
        <UndoIcon />
        <label htmlFor='undo' className='menu-label'>
          undo
        </label>
      </Button>
      <Button
        id='redo'
        classes='menu-btn'
        disabled={redoDisabled || !buffersLoaded}
        onClick={redo}
      >
        <RedoIcon />
        <label htmlFor='redo' className='menu-label'>
          redo
        </label>
      </Button>
      <span className='menu-dummy' />
    </div>
  );
};

export const Clear = () => {
  const dispatch = useDispatch();
  const tally = useSelector((state) => state.sequencer.noteTally.total);

  const onClick = () => dispatch(eraseAll());

  return (
    <div className='menu-items'>
      <Button
        id='clear-all'
        classes='menu-btn'
        disabled={tally === 0}
        onClick={onClick}
      >
        <ClearAllIcon />
        <label htmlFor='clear-all' className='menu-label'>
          clear pattern
        </label>
      </Button>
    </div>
  );
};
