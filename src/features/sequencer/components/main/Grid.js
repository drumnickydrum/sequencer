import React, {
  useEffect,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { modCell } from '../../reducers/sequencerSlice';
import * as defaultKits from '../../defaults/defaultKits';
import { SawIcon } from '../../../../icons';
import { PatternRef } from '../../providers/PatternRef';
import { MIDI_NOTES } from '../../utils/MIDI_NOTES';

export const Grid = () => {
  const length = useSelector((state) => state.sequencer.present.length);
  const selectedSound = useSelector((state) => state.editMode.selectedSound);

  const { cellsRef } = useContext(PatternRef);
  const prevCellRef = useRef(null);

  const onTouchMove = (e) => {
    if (selectedSound === -1) return;
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (cell) {
      const id = cell.id;
      if (!id.match(/cell/)) return;
      if (prevCellRef.current !== id) {
        prevCellRef.current = id;
        document.dispatchEvent(cellsRef.current[id].events.tap);
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

  // console.log('rendering: Grid');
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
            cellsRef={cellsRef}
            prevCellRef={prevCellRef}
          />
        );
      })}
    </div>
  );
};

const Cell = ({ id, step, selectedSound, cellsRef, prevCellRef }) => {
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

  const tapCell = useCallback(() => {
    dispatch(modCell(step, noteOn));
  }, [dispatch, noteOn, step]);

  const cellRef = useRef(null);
  useEffect(() => {
    cellsRef.current[id] = { events: {} };
    cellsRef.current[id].cellRef = cellRef;
    const tapEvent = new Event(`tap-${id}`);
    document.addEventListener(`tap-${id}`, tapCell);
    cellsRef.current[id].events.tap = tapEvent;
    return () => {
      document.removeEventListener(`tap-${id}`, tapCell);
    };
  }, [id, cellsRef, tapCell]);

  const onTouchStart = useCallback(
    (e) => {
      e.stopPropagation();
      prevCellRef.current = id;
      tapCell();
    },
    [id, tapCell, prevCellRef]
  );

  const cellMemo = useMemo(() => {
    // console.log('rendering: Cell');
    const modStyle = {
      opacity: noteOn ? velocity : 0,
      width: length === 1 ? '100%' : `${100 * length * 3}%`,
    };
    const midiNote = MIDI_NOTES.indexOf(pitch);
    const pitchShift = midiNote - 24;
    return (
      <div className='cell-wrapper'>
        <div
          ref={cellRef}
          id={id}
          className={noteOn ? 'cell on' : 'cell'}
          onTouchStart={onTouchStart}
        >
          <div className={noteOn ? 'cell-mods' : ''}>
            <p
              className={noteOn && midiNote > 24 ? 'pitch-up show' : 'pitch-up'}
            >
              +{pitchShift}
            </p>
            <p
              className={
                noteOn && midiNote < 24 ? 'pitch-down show' : 'pitch-down'
              }
            >
              {pitchShift}
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
            style={modStyle}
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

  // console.log('rendering: SoundCells');
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
