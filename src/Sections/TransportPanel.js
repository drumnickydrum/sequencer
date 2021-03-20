import React, { useContext } from 'react';
import { Button, NavLeft, NavRight } from '../Components/Button';
import { StopIcon, StartIcon, PauseIcon } from '../icons';
import { PatternState } from '../Providers/State/Pattern';
import { Transport } from '../Providers/Transport';

export const TransportPanel = () => {
  const { patternBpm, setPatternBpm } = useContext(PatternState);
  const { transportState, start, stop } = useContext(Transport);

  const handleChange = ({ target: { value } }) => {
    setPatternBpm(value > 300 ? 300 : value);
  };

  return (
    <div className='menu-items transport'>
      <div className='transport-wrapper'>
        <Button id='stop' classes='menu-btn' onClick={stop}>
          <StopIcon />
          <label htmlFor='stop'>stop</label>
        </Button>
        <Button id='start' classes='menu-btn' onClick={start}>
          {transportState === 'started' ? <PauseIcon /> : <StartIcon />}
          <label htmlFor='start'>start</label>
        </Button>
        <div className='input'>
          <input
            id='bpm'
            type='number'
            value={patternBpm}
            onChange={handleChange}
          />
          <label htmlFor='bpm' id='bpm-label'>
            bpm
          </label>
        </div>
      </div>

      {/* <NavLeft /> */}
      {/* <NavRight /> */}
    </div>
  );
};
