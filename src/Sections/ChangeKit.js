import React from 'react';
import { ChevronDownIcon } from '../icons';

export const ChangeKit = () => {
  const handleChange = ({ target: { value } }) => {
    console.log(value);
  };
  return (
    <div className='change-kit'>
      <h1>Change Kit</h1>
      <div className='custom-select'>
        <select className='kit-select' onChange={handleChange}>
          <option value='analog'>Analog</option>
          <option value='house'>House</option>
          <option value='lush'>Lush</option>
          <option value='vinyl'>Vinyl</option>
        </select>
        <ChevronDownIcon />
      </div>
    </div>
  );
};
