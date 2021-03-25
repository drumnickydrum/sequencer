import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { eraseAll } from '../../reducers/sequencerSlice';
import { EraseAllIcon } from '../../../../icons';
import { Button } from '../../../../components/Button';
import { MODES, setMode } from '../../reducers/editModeSlice';

export const Erase = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.editMode.mode);
  const editing = mode && mode !== MODES.PAINTING;
  const disabled = useSelector(
    (state) => state.sequencer.present.noteTally.total.empty
  );

  const eraseMemo = useMemo(() => {
    const onClick = () => {
      dispatch(eraseAll());
      if (editing) {
        dispatch(setMode({ mode: MODES.PAINTING }));
      }
    };

    // console.log('rendering: Erase');
    return (
      <div className='menu-items'>
        <Button
          id='erase-all'
          classes='menu-btn'
          disabled={disabled}
          onClick={onClick}
        >
          <EraseAllIcon />
          <label htmlFor='erase-all' className='menu-label'>
            erase pattern
          </label>
        </Button>
      </div>
    );
  }, [disabled, dispatch, editing]);

  return eraseMemo;
};
