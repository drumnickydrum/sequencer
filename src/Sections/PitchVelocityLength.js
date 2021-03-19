import React, { useState, useContext } from 'react';
import { Button } from '../Components/Button';
import {
  PitchSwipe,
  VelocitySwipe,
  LengthSwipe,
  ChevronLeftIcon,
} from '../icons';
import { PatternAction } from '../Providers/Actions/Pattern';
import { Kit } from '../Providers/Kit';

export const PitchVelocityLength = ({ type, selectedSound, handleReturn }) => {
  const { kitRef } = useContext(Kit);
  const { modify, resetMods } = useContext(PatternAction);
  const [showModAll, setShowModAll] = useState(false);

  const [value, setValue] = useState(
    type === 'velocity'
      ? kitRef.current.sounds[selectedSound].velocityMod
      : type === 'length'
      ? kitRef.current.sounds[selectedSound].lengthMod
      : kitRef.current.sounds[selectedSound].pitchMod
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
    const prevVal = kitRef.current.sounds[selectedSound][`${type}Mod`];
    if (value !== prevVal) modify(prevVal, value);
  };

  const handleReset = () => {
    setValue(type === 'pitch' ? 0 : 1);
    resetMods(type);
  };

  return (
    <div className={`sound-edit-detail color${selectedSound}`}>
      <Button classes='sound-edit-close' onClick={handleReturn}>
        <ChevronLeftIcon />
      </Button>
      <div className='sound-edit-dummy' />
      <div className='sound-edit-all'>
        <label htmlFor={`slider-${type}`}>{type}</label>
        {showModAll ? (
          type === 'pitch' ? (
            <div className='pitch-input'>
              <Button classes='pitch-dec' onClick={() => handlePitch('dec')}>
                -
              </Button>
              <p className='pitch-val'>{value}</p>
              <Button classes='pitch-inc' onClick={() => handlePitch('inc')}>
                +
              </Button>
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
          <Button classes='sound-edit-btn reset' onClick={handleReset}>
            reset
          </Button>
        )}

        <Button
          classes='sound-edit-btn mod-all'
          onClick={() => setShowModAll((showModAll) => !showModAll)}
        >
          {showModAll ? 'show reset' : 'show mod all'}
        </Button>
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
