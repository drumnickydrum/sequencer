import React, { useContext, useEffect, useState } from 'react';
import { PitchSwipe, VelocitySwipe, LengthSwipe } from '../icons';
import { Kit } from '../Providers/Kit';
import { Undo } from '../Providers/UndoProvider';

export const PitchVelocityLength = ({ type, selectedSound }) => {
  const { addToModsUndo } = useContext(Undo);
  const { kit } = useContext(Kit);

  const [value, setValue] = useState(
    type === 'velocity'
      ? kit[selectedSound].velocityMod
      : type === 'length'
      ? kit[selectedSound].lengthMod
      : null
  );
  useEffect(() => {
    console.log(value);
    kit[selectedSound][`${type}Mod`] = value;
  }, [kit, selectedSound, type, value]);

  const handleChange = ({ target: { value } }) => {
    setValue(parseFloat(value));
  };

  return (
    <div className={`sound-edit-detail color${selectedSound}`}>
      {type === 'pitch' ? (
        <PitchSwipe />
      ) : type === 'velocity' ? (
        <VelocitySwipe />
      ) : (
        <LengthSwipe />
      )}
      <p className='sound-edit-instructions'>
        Drag a cell {type === 'length' ? ' horizontally ' : ' vertically '}
        to adjust <strong>{type}</strong>
      </p>
      <div className='sound-edit-all'>
        {type !== 'pitch' && (
          <>
            <label htmlFor={`slider-${type}`}>Modify All</label>
            <input
              type='range'
              min={0.1}
              max={1}
              step={0.01}
              value={value}
              onChange={handleChange}
            />
          </>
        )}
        <button className='sound-edit-btn reset'>reset</button>
      </div>
    </div>
  );
};
