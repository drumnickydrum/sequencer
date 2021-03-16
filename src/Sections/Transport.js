import React, { useContext } from 'react';
import { StopIcon, StartIcon } from '../icons';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';
import { Status } from '../Providers/Status';

export const Transport = () => {
  const { setBpm, start, stop } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);
  const { changeStatus } = useContext(Status);

  const handleChange = ({ target: { value } }) => {
    let newBpm = value > 300 ? 300 : value;
    setBpm(newBpm);
    changeStatus(`bpm changed to ${newBpm}`);
  };

  const handleStart = () => {
    changeStatus('start');
    start();
  };

  const handleStop = () => {
    changeStatus('stop');
    stop();
  };

  return (
    <div className='menu-items transport'>
      <button id='stop' onClick={handleStop}>
        <StopIcon />
      </button>
      <button id='start' onClick={handleStart}>
        <StartIcon />
      </button>
      <div className='input'>
        <input id='bpm' type='number' value={bpm} onChange={handleChange} />
        <label htmlFor='bpm' id='bpm-label'>
          bpm
        </label>
      </div>
    </div>
  );
};
