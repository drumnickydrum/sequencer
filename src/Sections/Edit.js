import React, { useContext } from 'react';
import { ClearAllIcon, ClearOneIcon, RedoIcon, UndoIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';

export const Edit = () => {
  const { clearPattern } = useContext(Pattern);
  const { undo, redo } = useContext(Pattern);

  return (
    <div id='edit'>
      <button
        id='clear-one'
        className='bottom'
        onClick={() => clearPattern(true)}
      >
        <ClearOneIcon />
        <label htmlFor='clear-one'>clear one</label>
      </button>
      <button id='clear-all' className='bottom' onClick={() => clearPattern()}>
        <ClearAllIcon />
        <label htmlFor='clear-all'>clear all</label>
      </button>
      <button id='undo' className='bottom' onClick={undo}>
        <UndoIcon />
        <label htmlFor='undo'>undo</label>
      </button>
      <button id='redo' className='bottom' onClick={redo}>
        <RedoIcon />
        <label htmlFor='redo'>redo</label>
      </button>
    </div>
  );
};
