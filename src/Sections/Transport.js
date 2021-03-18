import React, { useContext } from 'react';
import { Button, NavLeft, NavRight } from '../Components/Button';
import { StopIcon, StartIcon } from '../icons';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';

export const Transport = () => {
  const { setBpm, start, stop } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);

  const handleChange = ({ target: { value } }) => {
    setBpm(value > 300 ? 300 : value);
  };

  return (
    <div className='menu-items transport'>
      <div className='transport-wrapper'>
        <Button id='stop' classes='menu-btn' onClick={stop}>
          <StopIcon />
          <label htmlFor='stop'>stop</label>
        </Button>
        <Button id='start' classes='menu-btn' onClick={start}>
          <StartIcon />
          <label htmlFor='start'>start</label>
        </Button>
        <div className='input'>
          <input id='bpm' type='number' value={bpm} onChange={handleChange} />
          <label htmlFor='bpm' id='bpm-label'>
            bpm
          </label>
        </div>
      </div>

      <NavLeft />
      <NavRight />
    </div>
  );
};
