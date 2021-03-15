import React, { useContext } from 'react';
import { OpenIcon, SaveIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';

export const LoadSaveButton = () => {
  const { setShowLoad } = useContext(Pattern);
  const handleLoad = () => {
    setShowLoad((showLoad) => !showLoad);
  };

  return (
    <div className='undo-redo-clear'>
      <button id='load-pattern' className='bottom' onClick={handleLoad}>
        <OpenIcon />
        <label htmlFor='load-pattern'>load/save pattern</label>
        <SaveIcon />
      </button>
      {/* <button id='save-pattern' className='bottom' onClick={handleSave}>
        <SaveIcon />
        <label htmlFor='save-pattern'>save pattern</label>
      </button> */}
    </div>
  );
};
