import React, { useContext } from 'react';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import { connect } from 'react-redux';
import { Button } from '../../../../components/Button';
import { RedoIcon, UndoIcon } from '../../../../icons';
import { Kit } from '../../providers/Kit';

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => {
  const { buffersLoaded } = useContext(Kit);

  return (
    <div className='menu-items'>
      <span className='menu-dummy' />
      <Button
        id='undo'
        classes='menu-btn'
        disabled={!canUndo || !buffersLoaded}
        onClick={onUndo}
      >
        <UndoIcon />
        <label htmlFor='undo' className='menu-label'>
          undo
        </label>
      </Button>
      <Button
        id='redo'
        classes='menu-btn'
        disabled={!canRedo || !buffersLoaded}
        onClick={onRedo}
      >
        <RedoIcon />
        <label htmlFor='redo' className='menu-label'>
          redo
        </label>
      </Button>
      <span className='menu-dummy' />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    canUndo: state.sequencer.past.length > 0,
    canRedo: state.sequencer.future.length > 0,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo()),
  };
};

UndoRedo = connect(mapStateToProps, mapDispatchToProps)(UndoRedo);

export { UndoRedo };
