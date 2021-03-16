import React, { useContext } from 'react';
import { Status } from '../Providers/Status';

export const StatusBar = () => {
  const { status } = useContext(Status);

  return (
    <div className='status-bar'>
      <p className='status' id='status'>
        {status}
      </p>
    </div>
  );
};
