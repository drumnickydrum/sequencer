import React, { useState, useEffect, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  close,
  edit,
  setMode,
  MODES,
} from '../features/sequencer/editModeSlice';
import {
  CloseIcon,
  CopyIcon,
  LengthIcon,
  EraserIcon,
  PitchIcon,
  SawIcon,
  VelocityIcon,
  PointDownIcon,
} from '../icons';
import * as icons from '../icons/kit';
import { Kit } from '../Providers/Kit';
import { Erase, Slice, Copy } from './EraseSliceCopy';
import { PitchVelocityLength } from './PitchVelocityLength';
import { Status } from '../Providers/Status';
import { Button } from '../Components/Button';

export const SoundPanel = () => {
  const dispatch = useDispatch();

  const selectedSound = useSelector((state) => state.editMode.selectedSound);
  const mode = useSelector((state) => state.editMode.mode);
  const tally = useSelector(
    (state) => state.sequencer.present.noteTally[selectedSound]
  );

  const { kitRef } = useContext(Kit);

  const [showEditMenu, setShowEditMenu] = useState(false);

  const onClose = () => {
    dispatch(close());
    setShowEditMenu(false);
  };

  const selectSound = (i) => {
    dispatch(edit({ sound: i }));
    setShowEditMenu(true);
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

  const { spAlert } = useContext(Status);
  const index = spAlert.indexOf('#');
  const alert = spAlert.substr(index + 1);

  return (
    <>
      <div id='sp-alert' className='sp-alert'>
        <span className='menu-dummy' />
        <p className='alert'>{alert}</p>
        <PointDownIcon />
        <span className='menu-dummy' />
      </div>
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
              disabled={tally === 0}
              onClick={() => selectMode(MODES.ERASING)}
            >
              <div className='sound-edit-icon-div'>
                <EraserIcon />
                <p>Erase</p>
              </div>
            </Button>
            <Button
              classes='sound-edit-btn'
              disabled={tally === 0}
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
      <div className='sound-menu'>
        {kitRef.current.sounds.map((sound, i) => (
          <SoundBtn
            key={`sound-menu-${sound.name}`}
            i={i}
            sound={sound}
            selectSound={selectSound}
          />
        ))}
      </div>
    </>
  );
};

const SoundBtn = ({ i, sound, selectSound }) => {
  const { soundsRef } = useContext(Kit);

  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) soundsRef.current[i] = ref;
  });

  return (
    <Button
      fwdRef={ref}
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
