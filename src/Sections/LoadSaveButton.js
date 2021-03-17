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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
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
