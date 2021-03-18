import React, { useContext } from 'react';
import { Button, NavLeft, NavRight } from '../Components/Button';
import { OpenIcon, SaveIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';

export const LoadSaveButton = () => {
  const { setShow } = useContext(Pattern);
  const handleClick = (type) => {
    if (type === 'load') setShow('load');
    if (type === 'save') setShow('save');
    document.getElementById('root').scrollTop = 0;
  };

  return (
    <div className='menu-items'>
      <span className='menu-dummy' />
      <Button
        id='load-pattern'
        classes='menu-btn'
        onClick={() => handleClick('load')}
      >
        <OpenIcon />
        <label htmlFor='load-pattern' className='menu-label'>
          load
        </label>
      </Button>
      <Button
        id='save-pattern'
        classes='menu-btn'
        onClick={() => handleClick('save')}
      >
        <SaveIcon />
        <label htmlFor='save-pattern' className='menu-label'>
          save
        </label>
      </Button>
      <span className='menu-dummy' />

      <NavLeft />
      <NavRight />
    </div>
  );
};
