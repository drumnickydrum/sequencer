import React, { useState, useContext } from 'react';
import { PitchSwipe, VelocitySwipe, LengthSwipe, CloseIcon } from '../icons';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';

export const PitchVelocityLength = ({ type, selectedSound, handleReturn }) => {
  const { kit } = useContext(Kit);
  const { modify, resetMods } = useContext(Pattern);
  const [showModAll, setShowModAll] = useState(false);

  const [value, setValue] = useState(
    type === 'velocity'
      ? kit.sounds[selectedSound].velocityMod
      : type === 'length'
      ? kit.sounds[selectedSound].lengthMod
      : kit.sounds[selectedSound].pitchMod
  );

  const handleChange = ({ target: { value } }) => {
    setValue(parseFloat(value));
  };

  const handlePitch = (change) => {
    if (change === 'inc') {
      if (value !== 12) {
        modify(value, value + 1);
        setValue((value) => value + 1);
      }
    }
    if (change === 'dec') {
      if (value !== -12) {
        modify(value, value - 1);
        setValue((value) => value - 1);
      }
    }
  };

  const sliderEnd = () => {
    const prevVal = kit.sounds[selectedSound][`${type}Mod`];
    if (value !== prevVal) modify(prevVal, value);
  };

  const handleReset = () => {
    setValue(type === 'pitch' ? 0 : 1);
    resetMods(type);
  };

  return (
    <div className={`sound-edit-detail color${selectedSound}`}>
      <div className='sound-edit-title' onClick={handleReturn}>
        <CloseIcon addClass='white' />
        <p>Menu</p>
      </div>
      <div className='sound-edit-all'>
        <label htmlFor={`slider-${type}`}>{type}</label>
        {showModAll ? (
          type === 'pitch' ? (
            <div className='pitch-input'>
              <button className='pitch-dec' onClick={() => handlePitch('dec')}>
                -
              </button>
              <p className='pitch-val'>{value}</p>
              <button className='pitch-inc' onClick={() => handlePitch('inc')}>
                +
              </button>
            </div>
          ) : (
            <input
              type='range'
              min={0.1}
              max={1}
              step={0.01}
              value={value}
              onChange={handleChange}
              onTouchEnd={sliderEnd}
            />
          )
        ) : (
          <button className='sound-edit-btn reset' onClick={handleReset}>
            reset
          </button>
        )}

        <button
          className='sound-edit-btn mod-all'
          onClick={() => setShowModAll((showModAll) => !showModAll)}
        >
          {showModAll ? 'show reset' : 'show mod all'}
        </button>
      </div>
      <div className='mod-animation'>
        {type === 'pitch' ? (
          <PitchSwipe />
        ) : type === 'velocity' ? (
          <VelocitySwipe />
        ) : (
          <LengthSwipe />
        )}
      </div>
    </div>
  );
};
