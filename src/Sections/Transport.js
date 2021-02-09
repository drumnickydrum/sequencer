import React, { useContext } from 'react';
import { StopIcon, PlayIcon } from '../icons';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';

export const Transport = () => {
  const { setBpm, play, stop } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);

  const handleChange = ({ target: { value } }) => {
    if (value && !value[value.length - 1].match(/\d/)) return;
    setBpm(value > 300 ? 300 : value < 1 ? 1 : value);
  };

  return (
    <div id='transport'>
      <button id='stop' onClick={stop}>
        <StopIcon className='icon' />
      </button>
      <button id='play' onClick={play}>
        <PlayIcon className='icon' />
      </button>
      <input id='bpm' value={bpm} onChange={handleChange} />
      <label htmlFor='bpm' id='bpm-label'>
        bpm
      </label>
    </div>
  );
};
