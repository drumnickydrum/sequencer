import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { eraseAll } from '../features/sequencer/sequencerSlice';
import { ClearAllIcon } from '../icons';
import { Button } from '../Components/Button';
import { MODES, setMode } from '../features/sequencer/editModeSlice';

export const Clear = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.editMode.mode);
  const tally = useSelector((state) => state.sequencer.present.noteTally.total);

  const onClick = () => {
    dispatch(eraseAll());
    if (mode && mode !== MODES.PAINTING) {
      dispatch(setMode({ mode: MODES.PAINTING }));
    }
  };

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
