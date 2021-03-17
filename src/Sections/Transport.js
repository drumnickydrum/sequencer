import React, { useContext } from 'react';
import {
  StopIcon,
  StartIcon,
  ChevronTripleRightIcon,
  ChevronRightIcon,
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
      <div className='chevron right' onClick={() => scroll('right')}>
        {/* <ChevronTripleRightIcon /> */}
        <ChevronRightIcon />
      </div>
    </div>
  );
};
