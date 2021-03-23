import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { PointDownIcon } from '../../../../icons';

export const SpAlert = () => {
  const message = useSelector((state) => state.editMode.spAlert.message);
  const ref = useRef(null);

  useEffect(() => {
    let onTimer;
    let fadeTimer;
    if (message) {
      if (ref.current) ref.current.classList.add('fade-out', 'fade-out-2');
      onTimer = setTimeout(() => {
        if (ref.current) ref.current.classList.remove('fade-out');
      }, 500);
      fadeTimer = setTimeout(() => {
        if (ref.current) ref.current.classList.remove('fade-out-2');
      }, 0);
    }
    return () => {
      clearTimeout(onTimer);
      clearTimeout(fadeTimer);
    };
  }, [message]);

  const index = message.indexOf('#');
  const spAlert = message.substr(index + 1);
  return (
    <div ref={ref} id='sp-alert' className='sp-alert'>
      <span className='menu-dummy' />
      <p className='alert'>{spAlert}</p>
      <PointDownIcon />
      <span className='menu-dummy' />
    </div>
  );
};
