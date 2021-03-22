import React, { useContext } from 'react';
import { ChevronDownIcon } from '../icons';
import * as kits from '../defaults/defaultKits';
import { Kit } from '../Providers/Kit';
import { useDispatch, useSelector } from 'react-redux';
import { loadKit } from '../features/sequencer/kitSlice';

export const ChangeKit = () => {
  const dispatch = useDispatch();
  const kit = useSelector((state) => state.kit.present.name);
  const { buffersLoaded } = useContext(Kit);

  const handleChange = ({ target: { value } }) => {
    dispatch(loadKit({ kit: value }));
  };

  return (
    <div className='menu-items change-kit'>
      <div className='change-kit-wrapper'>
        <label htmlFor='kit-select'>Select Kit: </label>
        <div
          className={buffersLoaded ? 'custom-select' : 'custom-select disabled'}
        >
          <select
            id='kit-select'
            className='kit-select'
            value={kit}
            onChange={handleChange}
          >
            {Object.keys(kits).map((kitName, i) => {
              return (
                <option key={`ck-${i}-${kitName}`} value={kitName}>
                  {kitName}
                </option>
              );
            })}
          </select>
          <ChevronDownIcon />
        </div>
      </div>

      {/* <NavRight /> */}
    </div>
  );
};
