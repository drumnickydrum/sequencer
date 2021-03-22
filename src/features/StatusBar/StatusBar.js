import React, { useContext } from 'react';
import { Status } from '../../providers/Status';

export const StatusBar = () => {
  const { status } = useContext(Status);
  const index = status.indexOf('#');
  const message = status.substr(index + 1);
  return (
    <div className='status-bar'>
      <p className='status' id='status'>
        {message}
      </p>
    </div>
  );
};
