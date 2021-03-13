import React, { useContext } from 'react';
import { ChevronDownIcon } from '../icons';
import * as kits from '../defaults/defaultKits';
import { useChangeKit } from '../utils/useChangeKit';
import { Kit } from '../Providers/Kit';

export const ChangeKit = () => {
  const { currentKit } = useContext(Kit);
  const { changeKit } = useChangeKit();
  return (
    <div className='change-kit'>
      <h1>Change Kit</h1>
      <div className='custom-select'>
        <select
          className='kit-select'
          value={currentKit}
          onChange={(e) => changeKit(e.target.value)}
        >
          {Object.keys(kits).map((kit, i) => {
            return (
              <option key={`ck-${i}-${kit}`} value={kit}>
                {kit}
              </option>
            );
          })}
        </select>
        <ChevronDownIcon />
      </div>
    </div>
  );
};
