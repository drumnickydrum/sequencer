import React, { useContext } from 'react';
import { ChevronDownIcon } from '../icons';
import * as kits from '../defaults/defaultKits';
import { useChangeKit } from '../utils/useChangeKit';
import { Kit } from '../Providers/Kit';
import { Undo } from '../Providers/UndoProvider';

export const ChangeKit = () => {
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
    <div className='change-kit'>
      <h1>Change Kit</h1>
      <div
        className={buffersLoaded ? 'custom-select' : 'custom-select disabled'}
      >
        <select
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
  );
};
