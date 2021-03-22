import React, { useContext } from 'react';
import { ChevronDownIcon } from '../../../../icons';
import * as kits from '../../defaults/defaultKits';
import { Kit } from '../../providers/Kit';
import { useDispatch, useSelector } from 'react-redux';
import { changeKit } from '../../reducers/sequencerSlice';

export const ChangeKit = () => {
  const dispatch = useDispatch();
  const kit = useSelector((state) => state.sequencer.present.kit);
  const { buffersLoaded } = useContext(Kit);

  const onChange = ({ target: { value } }) => {
    dispatch(changeKit({ kit: value }));
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
            onChange={onChange}
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