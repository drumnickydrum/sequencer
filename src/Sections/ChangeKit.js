import React, { useContext } from 'react';
import { ChevronDownIcon, ChevronTripleRightIcon } from '../icons';
import * as kits from '../defaults/defaultKits';
import { useChangeKit } from '../utils/useChangeKit';
import { Kit } from '../Providers/Kit';
import { Undo } from '../Providers/UndoProvider';

export const ChangeKit = ({ scroll }) => {
  const { addToUndo } = useContext(Undo);
  const { currentKit, buffersLoaded } = useContext(Kit);
  const { changeKit } = useChangeKit();

  const handleChange = ({ target: { value } }) => {
    const prevKit = currentKit;
    function change(kit) {
      changeKit(kit);
    }
    change(value);
    addToUndo(change, prevKit, value);
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
            value={currentKit}
            onChange={handleChange}
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
      <div className='chevron right' onClick={() => scroll('right')}>
        <ChevronTripleRightIcon />
      </div>
    </div>
  );
};
