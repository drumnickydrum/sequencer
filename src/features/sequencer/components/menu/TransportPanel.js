import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../components/Button';
import { StopIcon, StartIcon, PauseIcon } from '../../../../icons';
import { Transport } from '../../providers/Transport';
import { changeBpm } from '../../reducers/sequencerSlice';

export const TransportPanel = () => {
  const dispatch = useDispatch();
  const { start, stop } = useContext(Transport);

  const transportState = useSelector((state) => state.tone.transportState);
  const bpm = useSelector((state) => state.sequencer.present.bpm);

  const [tempBpm, setTempBpm] = useState(bpm);
  useEffect(() => {
    let timer;
    if (tempBpm !== bpm) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dispatch(changeBpm(tempBpm));
      }, 500);
    }
  }, [bpm, dispatch, tempBpm]);

  const onChange = ({ target: { value } }) => {
    if (value.match(/\D/)) return;
    // setPatternBpm(value > 300 ? 300 : value);
    setTempBpm(value > 300 ? 300 : value);
  };

  console.log('rendering: TransportPanel');
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
          <input id='bpm' type='tel' value={tempBpm} onChange={onChange} />
          <label htmlFor='bpm' id='bpm-label'>
            bpm
          </label>
        </div>
      </div>
    </div>
  );
};
