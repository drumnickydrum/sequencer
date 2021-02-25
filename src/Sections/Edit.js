import React, { useContext } from 'react';
import { ClearAllIcon, ClearOneIcon, RedoIcon, UndoIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';

export const Edit = () => {
  const { clearPattern } = useContext(Pattern);
  const { undo, redo } = useContext(Pattern);

  return (
    <div id='edit'>
      <button id='clear-one' onClick={() => clearPattern(true)}>
        <ClearOneIcon />
      </button>
      <button id='clear-all' onClick={() => clearPattern()}>
        <ClearAllIcon />
      </button>
      <button id='undo' onClick={undo}>
        <UndoIcon />
      </button>
      <button id='redo' onClick={redo}>
        <RedoIcon />
      </button>
    </div>
  );
};
