import React, { useContext } from 'react';
import { ClearAllIcon, ClearOneIcon, RedoIcon, UndoIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';
import { Undo } from '../Providers/UndoProvider';

export const UndoRedo = () => {
  const { undo, redo, undoDisabled, redoDisabled } = useContext(Undo);

  return (
    <div className='undo-redo-clear'>
      <button
        id='undo'
        className='bottom'
        disabled={undoDisabled}
        onClick={undo}
      >
        <UndoIcon />
        <label htmlFor='undo'>undo</label>
      </button>
      <button
        id='redo'
        className='bottom'
        disabled={redoDisabled}
        onClick={redo}
      >
        <RedoIcon />
        <label htmlFor='redo'>redo</label>
      </button>
      {/* <ChevronTripleRightIcon /> */}
    </div>
  );
};

export const Clear = () => {
  const { clearPattern, selectedSound } = useContext(Pattern);
  return (
    <div className='undo-redo-clear'>
      {/* <ChevronTripleLeftIcon /> */}
      <button
        id='clear-one'
        className='bottom'
        disabled={selectedSound === -1}
        onClick={() => clearPattern(true)}
      >
        <ClearOneIcon />
        <label htmlFor='clear-one'>clear one</label>
      </button>
      <button id='clear-all' className='bottom' onClick={() => clearPattern()}>
        <ClearAllIcon />
        <label htmlFor='clear-all'>clear all</label>
      </button>
    </div>
  );
};
