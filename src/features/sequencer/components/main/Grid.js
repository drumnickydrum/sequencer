import React, {
  useEffect,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MODES, setSpAlert } from '../../reducers/editModeSlice';
import {
  toggleCell,
  sliceCell,
  eraseCell,
} from '../../reducers/sequencerSlice';
import * as defaultKits from '../../defaults/defaultKits';
import { SawIcon } from '../../../../icons';
import { PatternRef } from '../../providers/PatternRef';

export const Grid = () => {
  const length = useSelector((state) => state.sequencer.present.length);
  const selectedSound = useSelector((state) => state.editMode.selectedSound);
  const mode = useSelector((state) => state.editMode.mode);

  const { cellsRef } = useContext(PatternRef);
  const prevCellRef = useRef(null);

  const onTouchMove = (e) => {
    if (
      mode !== MODES.PAINTING &&
      mode !== MODES.ERASING &&
      mode !== MODES.SLICING
    )
      return;
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (cell) {
      const id = cell.id;
      if (!id.match(/cell/)) return;
      if (prevCellRef.current !== id) {
        prevCellRef.current = id;
        if (cell.classList.contains('on')) {
          if (mode === MODES.ERASING || mode === MODES.SLICING) {
            document.dispatchEvent(cellsRef.current[id].events.tap);
          }
        } else {
          if (mode === MODES.PAINTING) {
            document.dispatchEvent(cellsRef.current[id].events.tap);
          }
        }
      }
    }
  };

  let grid = useMemo(() => {
    let grid = [];
    for (let i = 0; i < length; i++) {
      grid.push(i);
    }
    return grid;
  }, [length]);

  console.log('rendering: Grid');
  return (
    <div
      id='grid'
      className={selectedSound === -1 ? '' : 'no-drag'}
      onTouchMove={onTouchMove}
    >
      {grid.map((step) => {
        const id = `cell-${step}`;
        return (
          <Cell
            key={id}
            id={id}
            step={step}
            selectedSound={selectedSound}
            mode={mode}
            cellsRef={cellsRef}
            prevCellRef={prevCellRef}
          />
        );
      })}
    </div>
  );
};

const Cell = ({ id, step, selectedSound, mode, cellsRef, prevCellRef }) => {
  const dispatch = useDispatch();

  const noteOn = useSelector((state) =>
    selectedSound !== -1
      ? state.sequencer.present.pattern[step][selectedSound].noteOn
      : false
  );
  const slice = useSelector((state) =>
    selectedSound !== -1
      ? state.sequencer.present.pattern[step][selectedSound].notes.length
      : 1
  );
  const pitch = useSelector((state) =>
    selectedSound !== -1
      ? state.sequencer.present.pattern[step][selectedSound].notes[0].pitch
      : 24
  );
  const length = useSelector((state) =>
    selectedSound !== -1
      ? state.sequencer.present.pattern[step][selectedSound].notes[0].length
      : 1
  );
  const velocity = useSelector((state) =>
    selectedSound !== -1
      ? state.sequencer.present.pattern[step][selectedSound].notes[0].velocity
      : 1
  );

  const onTap = useCallback(() => {
    if (selectedSound !== -1) {
      if (mode === MODES.SLICING) {
        if (noteOn) {
          dispatch(sliceCell({ step, selectedSound }));
        }
      } else if (mode === MODES.ERASING) {
        if (noteOn) {
          dispatch(eraseCell({ step, selectedSound }));
        }
      } else {
        dispatch(toggleCell({ step, selectedSound }));
      }
    }
  }, [dispatch, mode, noteOn, selectedSound, step]);

  const cellRef = useRef(null);
  useEffect(() => {
    cellsRef.current[id] = { events: {} };
    cellsRef.current[id].cellRef = cellRef;
    const tapEvent = new Event(`tap-${id}`);
    document.addEventListener(`tap-${id}`, onTap);
    cellsRef.current[id].events.tap = tapEvent;
    return () => {
      document.removeEventListener(`tap-${id}`, onTap);
    };
  }, [id, cellsRef, onTap]);

  const onTouchStart = useCallback(
    (e) => {
      e.stopPropagation();
      if (selectedSound === -1) dispatch(setSpAlert('select a sound to edit'));
      // if (modRef.current) {
      // if (on) modStart(e);
      prevCellRef.current = id;
      if (!(mode === MODES.ERASING && !noteOn)) onTap();
    },
    [dispatch, id, mode, noteOn, onTap, prevCellRef, selectedSound]
  );

  const cellMemo = useMemo(() => {
    // console.log('rendering: Cell');
    const modStyle = {
      opacity: noteOn ? velocity : 1,
      width: `${100 * length}%`,
    };
    return (
      <div className='cell-wrapper'>
        <div
          ref={cellRef}
          id={id}
          className={noteOn ? 'cell on' : 'cell'}
          onTouchStart={onTouchStart}
          // onTouchMove={handleTouchMove}
          // onTouchEnd={handleTouchEnd}
        >
          <div className={noteOn ? 'cell-mods' : ''} style={modStyle}>
            <p className={noteOn && pitch > 24 ? 'pitch-up show' : 'pitch-up'}>
              +{pitch - 24}
            </p>
            <p
              className={
                noteOn && pitch < 24 ? 'pitch-down show' : 'pitch-down'
              }
            >
              {pitch - 24}
            </p>
            <div
              className={
                noteOn && slice === 2
                  ? 'slice slice-2'
                  : noteOn && slice === 3
                  ? 'slice slice-3'
                  : 'slice'
              }
            >
              <SawIcon />
            </div>
            <div className={noteOn && slice > 2 ? 'slice slice-2' : 'slice'}>
              <SawIcon />
            </div>
          </div>
          <div className='bg' />
          <div
            className={
              noteOn
                ? `bg-color bg${selectedSound} show`
                : `bg-color bg${selectedSound}`
            }
          />
          <div className='cursor' />
          <div className='border-flashing' />
          <SoundCells id={id} step={step} />
        </div>
      </div>
    );
  }, [
    noteOn,
    velocity,
    length,
    id,
    onTouchStart,
    pitch,
    slice,
    selectedSound,
    step,
  ]);

  return cellMemo;
};

const SoundCells = ({ id, step }) => {
  const kit = useSelector((state) => state.sequencer.present.kit);
  const sounds = defaultKits[kit].sounds;

  let grid = [];
  for (let i = 0; i < sounds.length; i++) {
    grid.push(i);
  }

  console.log('rendering: SoundCells');
  return (
    <div className='sound-cells'>
      {grid.map((i) => {
        const scId = `${id}-sound-${i}`;
        return <SoundCell key={scId} id={scId} step={step} i={i} />;
      })}
    </div>
  );
};

const SoundCell = ({ id, step, i }) => {
  const noteOn = useSelector(
    (state) => state.sequencer.present.pattern[step][i].noteOn
  );
  const velocity = useSelector(
    (state) => state.sequencer.present.pattern[step][i].notes[0].velocity
  );
  const scMemo = useMemo(() => {
    // console.log('rendering: SoundCell');
    const classes = `sound-cell bg${i}`;
    return (
      <div
        id={id}
        className={classes}
        style={{ opacity: noteOn ? velocity : 0 }}
      />
    );
  }, [i, id, noteOn, velocity]);
  return scMemo;
};
