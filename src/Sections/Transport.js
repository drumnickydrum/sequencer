import React, { useContext } from 'react';
import {
  StopIcon,
  StartIcon,
  ChevronRightIcon,
  ChevronTripleRightIcon,
} from '../icons';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';

export const Transport = () => {
  const { setBpm, start, stop } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);

  const handleChange = ({ target: { value } }) => {
    if (value && !value[value.length - 1].match(/\d/)) return;
    setBpm(value > 300 ? 300 : value);
  };

  return (
    <div id='transport'>
      <button id='stop' onClick={stop}>
        <StopIcon />
      </button>
      <button id='start' onClick={start}>
        <StartIcon />
      </button>
      <div className='input'>
        <input id='bpm' value={bpm} onChange={handleChange} />
        <label htmlFor='bpm' id='bpm-label'>
          bpm
        </label>
      </div>
      {/* <ChevronTripleRightIcon /> */}
    </div>
  );
};
