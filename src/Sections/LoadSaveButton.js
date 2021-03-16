import React, { useContext } from 'react';
import { OpenIcon, SaveIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';

export const LoadSaveButton = () => {
  const { setShowLoad } = useContext(Pattern);
  const handleLoad = () => {
    setShowLoad((showLoad) => !showLoad);
  };

  return (
    <div className='menu-items'>
      <button id='load-pattern' className='menu-btn' onClick={handleLoad}>
        <OpenIcon />
        <label htmlFor='load-pattern' className='menu-label'>
          load/save pattern
        </label>
        <SaveIcon />
      </button>
    </div>
  );
};
