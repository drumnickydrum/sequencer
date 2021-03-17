import React, { useContext } from 'react';
import {
  ChevronLeftIcon,
  ChevronTripleLeftIcon,
  OpenIcon,
  SaveIcon,
} from '../icons';
import { Pattern } from '../Providers/Pattern';

export const LoadSaveButton = ({ scroll }) => {
  const { setShowLoad } = useContext(Pattern);
  const handleLoad = () => {
    setShowLoad((showLoad) => !showLoad);
    console.log('scroll to top');
    document.getElementById('root').scrollTop = 0;
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
      <div className='chevron left' onClick={() => scroll('left')}>
        {/* <ChevronTripleLeftIcon /> */}
        <ChevronLeftIcon />
      </div>
    </div>
  );
};
