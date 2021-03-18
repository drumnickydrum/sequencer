import React, { useContext } from 'react';
import {
  StopIcon,
  StartIcon,
  ChevronTripleRightIcon,
  ChevronTripleLeftIcon,
} from '../icons';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';

export const Transport = ({ scroll }) => {
  const { setBpm, start, stop } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);

  const handleChange = ({ target: { value } }) => {
    setBpm(value > 300 ? 300 : value);
  };

  return (
    <div className='menu-items transport'>
      <div className='transport-wrapper'>
        <button id='stop' className='menu-btn' onClick={stop}>
          <StopIcon />
        </button>
        <button id='start' className='menu-btn' onClick={start}>
          <StartIcon />
        </button>
        <div className='input'>
          <input id='bpm' type='number' value={bpm} onChange={handleChange} />
          <label htmlFor='bpm' id='bpm-label'>
            bpm
          </label>
        </div>
      </div>

      <div className='chevron left' onClick={() => scroll('left')}>
        <ChevronTripleLeftIcon />
      </div>
      <div className='chevron right' onClick={() => scroll('right')}>
        <ChevronTripleRightIcon />
      </div>
    </div>
  );
};
