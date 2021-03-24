import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { eraseAll } from '../../reducers/sequencerSlice';
import { ClearAllIcon } from '../../../../icons';
import { Button } from '../../../../components/Button';
import { MODES, setMode } from '../../reducers/editModeSlice';

export const Clear = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.editMode.mode);
  const editing = mode && mode !== MODES.PAINTING;
  const disabled = useSelector(
    (state) => state.sequencer.present.noteTally.total.empty
  );

  const clearMemo = useMemo(() => {
    const onClick = () => {
      dispatch(eraseAll());
      if (editing) {
        dispatch(setMode({ mode: MODES.PAINTING }));
      }
    };

    // console.log('rendering: Clear');
    return (
      <div className='menu-items'>
        <Button
          id='clear-all'
          classes='menu-btn'
          disabled={disabled}
          onClick={onClick}
        >
          <ClearAllIcon />
          <label htmlFor='clear-all' className='menu-label'>
            clear pattern
          </label>
        </Button>
      </div>
    );
  }, [disabled, dispatch, editing]);

  return clearMemo;
};
