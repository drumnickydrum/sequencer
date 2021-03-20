import React, { useContext } from 'react';
import { Button, NavLeft, NavRight } from '../Components/Button';
import { ClearAllIcon, RedoIcon, UndoIcon } from '../icons';
import { PatternAction } from '../Providers/Actions/Pattern';
import { Kit } from '../Providers/Kit';
import { PatternState } from '../Providers/State/Pattern';
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

      <NavLeft />
      <NavRight />
    </div>
  );
};

export const Clear = () => {
  const { clearAllDisabled } = useContext(PatternState);
  const { clearPattern } = useContext(PatternAction);

  return (
    <div className='menu-items'>
      <Button
        id='clear-all'
        classes='menu-btn'
        disabled={clearAllDisabled}
        onClick={() => clearPattern()}
      >
        <ClearAllIcon />
        <label htmlFor='clear-all' className='menu-label'>
          clear pattern
        </label>
      </Button>

      <NavLeft />
    </div>
  );
};
