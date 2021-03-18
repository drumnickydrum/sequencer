import React, { useContext, useRef } from 'react';
import { NavLeft, NavRight } from '../Components/Button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClearAllIcon,
  RedoIcon,
  UndoIcon,
} from '../icons';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';
import { Undo } from '../Providers/UndoProvider';
import { pressDown, pressUp } from '../utils/press';

export const UndoRedo = ({ scroll }) => {
  const { undo, redo, undoDisabled, redoDisabled } = useContext(Undo);
  const { buffersLoaded } = useContext(Kit);

  const undoBtnRef = useRef(null);
  const redoBtnRef = useRef(null);

  return (
    <div className='menu-items'>
      <span className='menu-dummy' />
      <button
        ref={undoBtnRef}
        id='undo'
        className='menu-btn'
        disabled={undoDisabled || !buffersLoaded}
        onTouchStart={() => pressDown(undoBtnRef)}
        onTouchEnd={() => pressUp(undoBtnRef)}
        onClick={undo}
      >
        <UndoIcon />
        <label htmlFor='undo' className='menu-label'>
          undo
        </label>
      </button>
      <button
        ref={redoBtnRef}
        id='redo'
        className='menu-btn'
        disabled={redoDisabled || !buffersLoaded}
        onTouchStart={() => pressDown(redoBtnRef)}
        onTouchEnd={() => pressUp(redoBtnRef)}
        onClick={redo}
      >
        <RedoIcon />
        <label htmlFor='redo' className='menu-label'>
          redo
        </label>
      </button>
      <span className='menu-dummy' />

      <NavLeft />
      <NavRight />
    </div>
  );
};

export const Clear = ({ scroll }) => {
  const { clearPattern } = useContext(Pattern);

  const clearAllBtnRef = useRef(null);

  const leftRef = useRef(null);

  return (
    <div className='menu-items'>
      <button
        ref={clearAllBtnRef}
        id='clear-all'
        className='menu-btn'
        onTouchStart={() => pressDown(clearAllBtnRef)}
        onTouchEnd={() => pressUp(clearAllBtnRef)}
        onClick={() => clearPattern()}
      >
        <ClearAllIcon />
        <label htmlFor='clear-all' className='menu-label'>
          clear pattern
        </label>
      </button>
      <div
        ref={leftRef}
        className='chevron left'
        onTouchStart={() => pressDown(leftRef)}
        onTouchEnd={() => pressUp(leftRef)}
        onClick={() => scroll('left')}
      >
        <ChevronLeftIcon />
      </div>

      <NavLeft />
    </div>
  );
};
