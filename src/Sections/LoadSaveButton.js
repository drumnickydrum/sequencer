import React, { useContext } from 'react';
import {
  ChevronTripleLeftIcon,
  ChevronTripleRightIcon,
  OpenIcon,
  SaveIcon,
} from '../icons';
import { Pattern } from '../Providers/Pattern';

export const LoadSaveButton = ({ scroll }) => {
  const { setShow } = useContext(Pattern);
  const handleClick = (type) => {
    if (type === 'load') setShow('load');
    if (type === 'save') setShow('save');
    document.getElementById('root').scrollTop = 0;
  };

  return (
    <div className='menu-items'>
      <span className='menu-dummy' />
      <button
        id='load-pattern'
        className='menu-btn'
        onClick={() => handleClick('load')}
      >
        <OpenIcon />
        <label htmlFor='load-pattern' className='menu-label'>
          load
        </label>
      </button>
      <button
        id='save-pattern'
        className='menu-btn'
        onClick={() => handleClick('save')}
      >
        <SaveIcon />
        <label htmlFor='save-pattern' className='menu-label'>
          save
        </label>
      </button>
      <span className='menu-dummy' />
      <div className='chevron left' onClick={() => scroll('left')}>
        <ChevronTripleLeftIcon />
      </div>
      <div className='chevron right' onClick={() => scroll('right')}>
        <ChevronTripleRightIcon />
      </div>
    </div>
  );
};
