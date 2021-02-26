import React, { useContext } from 'react';
import { Info } from '../Providers/Info';

export const Information = () => {
  const {
    info: { h, p, i, show },
  } = useContext(Info);

  return (
    <div id='information' className={show ? 'show' : ''}>
      <div id='info'>
        <h1>{h}</h1>
        {i}
        <p>{p}</p>
      </div>
    </div>
  );
};
