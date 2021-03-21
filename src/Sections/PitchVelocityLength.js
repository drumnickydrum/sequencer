import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { MODES } from '../features/sequencer/editorSlice';
import { Button } from '../Components/Button';
import {
  PitchSwipe,
  VelocitySwipe,
  LengthSwipe,
  ChevronLeftIcon,
} from '../icons';
import { PatternAction } from '../Providers/Actions/Pattern';
import { Kit } from '../Providers/Kit';

export const PitchVelocityLength = ({ mode, selectedSound, onReturn }) => {
  const dispatch = useDispatch();

  const { kitRef } = useContext(Kit);
  const { modify, resetMods } = useContext(PatternAction);
  const [showModAll, setShowModAll] = useState(false);

  const [value, setValue] = useState(
    kitRef.current.sounds[selectedSound][`${mode}Mod`]
  );

  const onChange = ({ target: { value } }) => {
    setValue(parseFloat(value));
  };

  const editAllPitch = (change) => {
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
    const prevVal = kitRef.current.sounds[selectedSound][`${mode}Mod`];
    // if (value !== prevVal) dispatch(modifyAll({ selectedSound, mode, value }));
  };

  const handleReset = () => {
    setValue(mode === MODES.MOD_PITCH ? 0 : 1);
    resetMods(mode);
  };

  const label = mode && mode.substr(4).toLowerCase();
  return (
    <div className={`sound-edit-detail color${selectedSound}`}>
      <Button classes='sound-edit-close' onClick={onReturn}>
        <ChevronLeftIcon />
      </Button>
      <div className='sound-edit-dummy' />
      <div className='sound-edit-all'>
        <label htmlFor={`slider-${mode}`}>{label}</label>
        {showModAll ? (
          mode === MODES.MOD_PITCH ? (
            <div className='pitch-input'>
              <Button classes='pitch-dec' onClick={() => editAllPitch('dec')}>
                -
              </Button>
              <p className='pitch-val'>{value}</p>
              <Button classes='pitch-inc' onClick={() => editAllPitch('inc')}>
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
              onChange={onChange}
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
        {mode === MODES.MOD_PITCH ? (
          <PitchSwipe />
        ) : mode === MODES.MOD_VELOCITY ? (
          <VelocitySwipe />
        ) : (
          <LengthSwipe />
        )}
      </div>
    </div>
  );
};
