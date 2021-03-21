import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { eraseAll } from '../features/sequencer/sequencerSlice';
import { ClearAllIcon } from '../icons';
import { Button } from '../Components/Button';

export const Clear = () => {
  const dispatch = useDispatch();
  const tally = useSelector((state) => state.sequencer.present.noteTally.total);

  const onClick = () => dispatch(eraseAll());

  return (
    <div className='menu-items'>
      <Button
        id='clear-all'
        classes='menu-btn'
        disabled={tally === 0}
        onClick={onClick}
      >
        <ClearAllIcon />
        <label htmlFor='clear-all' className='menu-label'>
          clear pattern
        </label>
      </Button>
    </div>
  );
};
