import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useSelector } from 'react-redux';
import { SawIcon } from '../../icons';
import { Kit } from '../../Providers/Kit';
import { PatternState } from '../../Providers/State/Pattern';

export const Grid = () => {
  const { selectedSound } = useContext(PatternState);
  const { kitRef } = useContext(Kit);
  const length = useSelector((state) => state.sequencer.length);
  const grid = [];
  for (let i = 0; i < length; i++) {
    grid.push(1);
  }
  return (
    <div
      // ref={gridRef}
      id='grid'
      // className={selectedSound === -1 ? '' : 'no-drag'}
      // onTouchMove={handleDrag}
    >
      {/* {patternRef.current.map((_, step) => { */}
      {grid.map((_, step) => {
        const id = `cell-${step}`;
        return (
          <Cell
            key={id}
            id={id}
            step={step}
            selectedSound={selectedSound}
            kitRef={kitRef}
          />
        );
      })}
    </div>
  );
};

const Cell = ({ id, step, selectedSound, kitRef }) => {
  const noteOn = useSelector((state) =>
    selectedSound !== -1
      ? state.sequencer.pattern[step][selectedSound].noteOn
      : false
  );
  const slice = useSelector((state) =>
    selectedSound !== -1
      ? state.sequencer.pattern[step][selectedSound].notes.length
      : 1
  );
  const pitch = useSelector((state) =>
    selectedSound !== -1
      ? state.sequencer.pattern[step][selectedSound].notes[0].pitch
      : 24
  );
  const length = useSelector((state) =>
    selectedSound !== -1
      ? state.sequencer.pattern[step][selectedSound].notes[0].length
      : 1
  );
  const velocity = useSelector((state) =>
    selectedSound !== -1
      ? state.sequencer.pattern[step][selectedSound].notes[0].velocity
      : 1
  );

  const cellRef = useRef(null);

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
        // onTouchStart={handleTouchStart}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchEnd}
      >
        <div className={noteOn ? 'cell-mods' : ''} style={modStyle}>
          <p className={noteOn && pitch > 24 ? 'pitch-up show' : 'pitch-up'}>
            +{pitch - 24}
          </p>
          <p
            className={noteOn && pitch < 24 ? 'pitch-down show' : 'pitch-down'}
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
        <div className='sound-cells'>
          {kitRef.current.sounds.map((sound, i) => {
            const scId = `${id}-sound-${i}`;
            return (
              <SoundCell key={scId} id={scId} step={step} i={i} sound={sound} />
            );
          })}
        </div>
      </div>
    </div>
  );
  // }, [color, on, pitch, velocity, length, pattern[step].updated]);

  // return cellMemo;
};

const SoundCell = ({ id, step, i, sound }) => {
  const noteOn = useSelector(
    (state) => state.sequencer.pattern[step][i].noteOn
  );
  const velocity = useSelector(
    (state) => state.sequencer.pattern[step][i].notes[0].velocity
  );
  const classes = `sound-cell bg${sound.color}`;
  return (
    <div
      id={id}
      className={classes}
      style={{ opacity: noteOn ? velocity : 0 }}
    />
  );
};
