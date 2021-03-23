import React, { useState, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { close, edit, setMode, MODES } from '../../reducers/editModeSlice';
import {
  CloseIcon,
  CopyIcon,
  LengthIcon,
  EraserIcon,
  PitchIcon,
  SawIcon,
  VelocityIcon,
} from '../../../../icons';
import * as defaultKits from '../../defaults/defaultKits';
import * as icons from '../../../../icons/kit';
import { Kit } from '../../providers/Kit';
import { Erase, Slice, Copy } from './EraseSliceCopy';
import { PitchVelocityLength } from './PitchVelocityLength';
import { SpAlert } from './SpAlert';
import { Button } from '../../../../components/Button';

export const SoundPanel = () => {
  const dispatch = useDispatch();

  const selectedSound = useSelector((state) => state.editMode.selectedSound);
  const mode = useSelector((state) => state.editMode.mode);

  const disabled = useSelector(
    (state) => state.sequencer.present.noteTally[selectedSound].empty
  );

  const [showEditMenu, setShowEditMenu] = useState(false);

  const spMemo = useMemo(() => {
    console.log('rendering: SoundPanel');

    const onClose = () => {
      dispatch(close());
      setShowEditMenu(false);
    };

    const onReturn = () => {
      if (mode !== MODES.ERASING || mode !== MODES.COPYING) {
        const cells = document.querySelectorAll('.on');
        cells.forEach((cell) => cell.classList.remove('flashing'));
      }
      dispatch(setMode({ mode: MODES.PAINTING }));
    };

    const selectMode = (mode) => {
      if (mode !== MODES.ERASING && mode !== MODES.COPYING) {
        const cells = document.querySelectorAll('.on');
        cells.forEach((cell) => cell.classList.add('flashing'));
      }
      dispatch(setMode({ mode }));
    };

    return (
      <>
        <SpAlert />
        <div className={showEditMenu ? 'sound-edit show' : 'sound-edit'}>
          {mode === MODES.ERASING ? (
            <Erase onReturn={onReturn} selectedSound={selectedSound} />
          ) : mode === MODES.SLICING ? (
            <Slice onReturn={onReturn} />
          ) : mode === MODES.COPYING ? (
            <Copy onReturn={onReturn} />
          ) : (
            <div className='sound-edit-menu'>
              <Button classes='sound-edit-close' onClick={onClose}>
                <CloseIcon />
              </Button>
              <div className='sound-edit-dummy' />
              <Button
                classes={'sound-edit-btn'}
                disabled={disabled}
                onClick={() => selectMode(MODES.ERASING)}
              >
                <div className='sound-edit-icon-div'>
                  <EraserIcon />
                  <p>Erase</p>
                </div>
              </Button>
              <Button
                classes='sound-edit-btn'
                disabled={disabled}
                onClick={() => selectMode(MODES.SLICING)}
              >
                <div className='sound-edit-icon-div'>
                  <SawIcon />
                  <p>Slice</p>
                </div>
              </Button>
              <Button
                classes='sound-edit-btn'
                onClick={() => selectMode(MODES.COPYING)}
              >
                <div className='sound-edit-icon-div'>
                  <CopyIcon />
                  <p>Copy</p>
                </div>
              </Button>
              <Button
                classes='sound-edit-btn'
                onClick={() => selectMode(MODES.MOD_VELOCITY)}
              >
                <div className='sound-edit-icon-div'>
                  <VelocityIcon />
                  <p>Velocity</p>
                </div>
              </Button>
              <Button
                classes='sound-edit-btn'
                onClick={() => selectMode(MODES.MOD_LENGTH)}
              >
                <div className='sound-edit-icon-div'>
                  <LengthIcon />
                  <p>Length</p>
                </div>
              </Button>
              <Button
                classes='sound-edit-btn'
                onClick={() => selectMode(MODES.MOD_PITCH)}
              >
                <div className='sound-edit-icon-div'>
                  <PitchIcon />
                  <p>Pitch</p>
                </div>
              </Button>
            </div>
          )}
        </div>
        <SoundBtns setShowEditMenu={setShowEditMenu} />
      </>
    );
  }, [disabled, dispatch, mode, selectedSound, showEditMenu]);

  return spMemo;
};

const SoundBtns = ({ setShowEditMenu }) => {
  const dispatch = useDispatch();
  const kit = useSelector((state) => state.sequencer.present.kit);

  const soundBtnsMemo = useMemo(() => {
    console.log('rendering: SoundBtns');

    const selectSound = (i) => {
      dispatch(edit({ sound: i }));
      setShowEditMenu(true);
    };

    return (
      <div className='sound-menu'>
        {defaultKits[kit] &&
          defaultKits[kit].sounds.map((sound, i) => (
            <SoundBtn
              key={`sound-menu-${sound.name}`}
              i={i}
              sound={sound}
              selectSound={selectSound}
            />
          ))}
      </div>
    );
  }, [dispatch, kit, setShowEditMenu]);
  return soundBtnsMemo;
};

const SoundBtn = ({ i, sound, selectSound }) => {
  return (
    <Button
      classes={`sound sound-btn color${i}`}
      onClick={() => selectSound(i)}
    >
      {icons[sound.icon](sound.color)}
      <label className='sound-name'>{sound.name}</label>
      <div className='border' />
      <div className={`border-pulse border${i}`} />
    </Button>
  );
};

/* ) : mode !== MODES.PAINTING ? (
          <PitchVelocityLength
            mode={mode}
            selectedSound={selectedSound}
            onReturn={onReturn}
          /> */
