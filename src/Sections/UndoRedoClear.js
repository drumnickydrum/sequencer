import React, { useContext } from 'react';
import {
  ChevronTripleLeftIcon,
  ChevronTripleRightIcon,
  ClearAllIcon,
  ClearOneIcon,
  RedoIcon,
  UndoIcon,
} from '../icons';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';
import { Undo } from '../Providers/UndoProvider';

export const UndoRedo = ({ scroll }) => {
  const { undo, redo, undoDisabled, redoDisabled } = useContext(Undo);
  const { buffersLoaded } = useContext(Kit);

  return (
    <div className='menu-items'>
      <span className='menu-dummy' />
      <button
        id='undo'
        className='menu-btn'
        disabled={undoDisabled || !buffersLoaded}
        onClick={undo}
      >
        <UndoIcon />
        <label htmlFor='undo' className='menu-label'>
          undo
        </label>
      </button>
      <button
        id='redo'
        className='menu-btn'
        disabled={redoDisabled || !buffersLoaded}
        onClick={redo}
      >
        <RedoIcon />
        <label htmlFor='redo' className='menu-label'>
          redo
        </label>
      </button>
      <span className='menu-dummy' />
      <div className='chevron left' onClick={() => scroll('left')}>
        <ChevronTripleLeftIcon />
      </div>
      <div className='chevron right' onClick={() => scroll('right')}>
        <ChevronTripleRightIcon />
      </div>
    </div>
  );
};

export const Clear = ({ scroll }) => {
  const { clearPattern, selectedSound } = useContext(Pattern);
  return (
    <div className='menu-items'>
      <span className='menu-dummy' />
      <button
        id='clear-one'
        className='menu-btn'
        disabled={selectedSound === -1}
        onClick={() => clearPattern(true)}
      >
        <ClearOneIcon />
        <label htmlFor='clear-one' className='menu-label'>
          clear one
        </label>
      </button>
      <button
        id='clear-all'
        className='menu-btn'
        onClick={() => clearPattern()}
      >
        <ClearAllIcon />
        <label htmlFor='clear-all' className='menu-label'>
          clear all
        </label>
      </button>
      <span className='menu-dummy' />
      <div className='chevron left' onClick={() => scroll('left')}>
        <ChevronTripleLeftIcon />
      </div>
    </div>
  );
};
