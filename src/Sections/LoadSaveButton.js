import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { OpenIcon, SaveIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';

export const LoadSaveButton = () => {
  //   const { setShowLoad } = useContext(Pattern);
  //   const handleLoad = () => {
  //     setShowLoad((showLoad) => !showLoad);
  //     window.scrollTo({
  //       top: 0,
  //       left: 0,
  //       behavior: 'smooth',
  //     });
  //   };

  return (
    <div className='menu-items'>
      <Link id='load-pattern' className='menu-btn' to='/sequencer/load'>
        <OpenIcon />
        <label htmlFor='load-pattern' className='menu-label'>
          load/save pattern
        </label>
        <SaveIcon />
      </Link>
    </div>
  );
};
