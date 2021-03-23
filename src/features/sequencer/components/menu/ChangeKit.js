import React from 'react';
import { ChevronDownIcon } from '../../../../icons';
import * as kits from '../../defaults/defaultKits';
import { useDispatch, useSelector } from 'react-redux';
import { changeKit } from '../../reducers/sequencerSlice';

export const ChangeKit = () => {
  const dispatch = useDispatch();
  const kit = useSelector((state) => state.sequencer.present.kit);
  const buffersLoaded = useSelector((state) => state.tone.buffersLoaded);

  const onChange = ({ target: { value } }) => {
    dispatch(changeKit({ kit: value }));
  };

  console.log('rendering: ChangeKit');
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
