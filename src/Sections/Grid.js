import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Pattern } from '../Providers/Pattern';
import { Kit } from '../Providers/Kit';
import { SawIcon } from '../icons';

export const Grid = () => {
  const { events, prevCellRef } = useContext(Pattern);

  const handleDrag = (e) => {
    const touch = e.touches[0];
    const cell = document.elementFromPoint(touch.clientX, touch.clientY);
    if (cell) {
      const id = cell.id;
      if (!id.match(/cell/)) return;
      if (prevCellRef.current !== id) {
        document.dispatchEvent(events[id]);
        prevCellRef.current = id;
      }
    }
  };
  const cells = getCells();
  return (
    <div id='grid' onTouchMove={handleDrag}>
      {cells}
    </div>
  );
};

const getCells = (size = 64) => {
  let cells = [];
  for (let i = 0; i < size; i++) {
    const id = `cell-${i}`;
    cells.push(<Cell key={id} id={id} i={i} />);
  }
  return cells;
};

const Cell = ({ id, i }) => {
  const {
    pattern,
    toggleCell,
    setEvents,
    prevCellRef,
    selectedSound,
    slicingRef,
    sliceCell,
  } = useContext(Pattern);
  const { kit, refreshMods, setRefreshMods } = useContext(Kit);

  const cellRef = useRef(null);
  const [on, setOn] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const [length, setLength] = useState(1);
  const [color, setColor] = useState(-1);

  useEffect(() => {
    let newOn, newVelocity, newLength;
    if (selectedSound === -1) {
      newOn = false;
      newVelocity = 0;
      newLength = 1;
    } else {
      newOn = pattern[i][selectedSound].on;
      if (newOn) {
        newVelocity =
          pattern[i][selectedSound].notes[0].velocity *
          kit[selectedSound].velocityMod;
        newLength =
          pattern[i][selectedSound].notes[0].length *
          kit[selectedSound].lengthMod;
        console.log(newLength);
      }
    }
    setOn(newOn);
    setVelocity(newVelocity);
    setLength(newLength);
    setColor(selectedSound);
    setRefreshMods(false);
  }, [pattern[i][selectedSound], selectedSound, refreshMods]);

  const handleTouchStart = (e) => {
    e.stopPropagation();
    prevCellRef.current = id;
    handleToggle();
  };

  const handleTouchEnd = () => {
    prevCellRef.current = null;
  };

  const handleToggle = () => {
    if (selectedSound === -1) return;
    if (slicingRef.current) {
      if (on) sliceCell(i);
    } else {
      toggleCell(i);
    }
  };

  useEffect(() => {
    if (cellRef.current) {
      const event = new Event(id);
      document.addEventListener(id, handleToggle);
      setEvents((prev) => ({ ...prev, [id]: event }));
    }
    return () => document.removeEventListener(id, handleToggle);
  }, [cellRef, selectedSound, velocity]);

  const cellMemo = useMemo(() => {
    // console.log('rendering cell: ', i);
    const soundCells = getSoundCells(id, pattern[i]);
    const len = pattern[i][selectedSound]?.notes.length;
    const modStyle = {
      opacity: on ? velocity : 1,
      width: `${100 * length}%`,
    };
    return (
      <div className='cell-wrapper'>
        <div
          ref={cellRef}
          id={id}
          className={on ? 'cell on' : 'cell'}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className={on ? `cell-mods bg${color}` : ''} style={modStyle}>
            {on && len > 1 && (
              <div className={len === 2 ? 'slice' : 'slice slice-3'}>
                <SawIcon />
              </div>
            )}
            {on && len > 2 && (
              <div className='slice slice-2'>
                <SawIcon />
              </div>
            )}
          </div>
          <div className='sound-cells'>{soundCells}</div>
        </div>
      </div>
    );
  }, [color, velocity, length, pattern[i]]);

  return cellMemo;
};

const getSoundCells = (cellId, patternI, size = 9) => {
  let soundCells = [];
  for (let i = 0; i < size; i++) {
    const id = `${cellId}-${i}`;
    const color = patternI[i].on ? `bg${i}` : '';
    const velocity = patternI[i].notes[0];
    soundCells.push(
      <SoundCell key={id} id={id} color={color} velocity={velocity} />
    );
  }
  return soundCells;
};

const SoundCell = ({ id, color, velocity }) => {
  const soundCellMemo = useMemo(() => {
    // console.log('rendering soundCell: ', id);
    const classes = `sound-cell ${color}`;
    return <div id={id} className={classes} style={{ opacity: velocity }} />;
  }, [velocity]);

  return soundCellMemo;
};
