import React, { useContext, useEffect, useState } from 'react';
import {
  PitchSwipe,
  VelocitySwipe,
  LengthSwipe,
  PitchIcon,
  VelocityIcon,
  LengthIcon,
} from '../icons';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';

export const PitchVelocityLength = ({ type, selectedSound, handleReturn }) => {
  const { kit } = useContext(Kit);
  const { modify, resetMods } = useContext(Pattern);

  const [value, setValue] = useState(
    type === 'velocity'
      ? kit[selectedSound].velocityMod
      : type === 'length'
      ? kit[selectedSound].lengthMod
      : kit[selectedSound].pitchMod
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
    const prevVal = kit[selectedSound][`${type}Mod`];
    if (value !== prevVal) modify(prevVal, value);
  };

  const handleReset = () => {
    setValue(type === 'pitch' ? 0 : 1);
    resetMods(type);
  };

  return (
    <div className={`sound-edit-detail color${selectedSound}`}>
      <div className='sound-edit-title' onClick={handleReturn}>
        {type === 'pitch' ? (
          <PitchIcon />
        ) : type === 'velocity' ? (
          <VelocityIcon />
        ) : (
          <LengthIcon />
        )}
        <p>Go Back</p>
      </div>
      <div className='sound-edit-all'>
        <label htmlFor={`slider-${type}`}>{type}</label>
        {type === 'pitch' ? (
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
        )}
        <button className='sound-edit-btn reset' onClick={handleReset}>
          reset
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
