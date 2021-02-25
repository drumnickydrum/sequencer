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
      </button>
      <button id='clear-all' className='bottom' onClick={() => clearPattern()}>
        <ClearAllIcon />
      </button>
      <button id='undo' className='bottom' onClick={undo}>
        <UndoIcon />
      </button>
      <button id='redo' className='bottom' onClick={redo}>
        <RedoIcon />
      </button>
    </div>
  );
};
