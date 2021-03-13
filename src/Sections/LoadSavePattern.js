import React from 'react';
import { OpenIcon, SaveIcon } from '../icons';

export const LoadSavePattern = () => {
  const handleLoad = () => {};
  const handleSave = () => {};

  return (
    <div className='undo-redo-clear'>
      <button id='load-pattern' className='bottom' onClick={handleLoad}>
        <OpenIcon />
        <label htmlFor='load-pattern'>load pattern</label>
      </button>
      <button id='save-pattern' className='bottom' onClick={handleSave}>
        <SaveIcon />
        <label htmlFor='save-pattern'>save pattern</label>
      </button>
    </div>
  );
};
