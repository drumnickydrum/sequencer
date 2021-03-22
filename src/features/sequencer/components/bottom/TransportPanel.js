import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '../../../../components/Button';
import { StopIcon, StartIcon, PauseIcon } from '../../../../icons';
import { Transport } from '../../providers/Transport';

export const TransportPanel = () => {
  const { transportState, start, stop } = useContext(Transport);

  const bpm = useSelector((state) => state.sequencer.present.bpm);

  const handleChange = ({ target: { value } }) => {
    if (value.match(/\D/)) return;
    // setPatternBpm(value > 300 ? 300 : value);
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
          <input id='bpm' type='tel' value={bpm} onChange={handleChange} />
          <label htmlFor='bpm' id='bpm-label'>
            bpm
          </label>
        </div>
      </div>
    </div>
  );
};
