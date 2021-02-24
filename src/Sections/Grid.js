import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Pattern } from '../Providers/Pattern';

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
  } = useContext(Pattern);
  const cellRef = useRef(null);
  const [vol, setVol] = useState(0);

  useEffect(() => {
    setVol(pattern[i][selectedSound]);
  }, [pattern[i][selectedSound], selectedSound]);

  const handleTouchStart = (e) => {
    e.stopPropagation();
    prevCellRef.current = id;
    toggleCell(i, vol);
  };

  const handleTouchEnd = () => {
    prevCellRef.current = null;
  };

  const handleToggle = () => {
    toggleCell(i, vol);
  };

  useEffect(() => {
    if (cellRef.current) {
      const event = new Event(id);
      document.addEventListener(id, handleToggle);
      setEvents((prev) => ({ ...prev, [id]: event }));
    }
    return () => document.removeEventListener(id, handleToggle);
  }, [cellRef, selectedSound, vol]);

  const cellMemo = useMemo(() => {
    // console.log('rendering cell: ', i);
    let classes = `cell`;
    classes += vol ? ` bg${selectedSound} on` : '';
    const soundCells = getSoundCells(id, pattern[i]);
    return (
      <div className='cell-wrapper'>
        <div
          ref={cellRef}
          id={id}
          className={classes}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className='sound-cells'>{soundCells}</div>
        </div>
      </div>
    );
  }, [selectedSound, vol, pattern[i]]);

  return cellMemo;
};

const getSoundCells = (cellId, patternI, size = 9) => {
  let soundCells = [];
  for (let i = 0; i < size; i++) {
    const id = `${cellId}-${i}`;
    const color = patternI[i] ? `bg${i}` : '';
    const vol = patternI[i];
    soundCells.push(<SoundCell key={id} id={id} color={color} vol={vol} />);
  }
  return soundCells;
};

const SoundCell = ({ id, color, vol }) => {
  const soundCellMemo = useMemo(() => {
    // console.log('rendering soundCell: ', id);
    const classes = `sound-cell ${color}`;
    return <div id={id} className={classes} style={{ opacity: vol }} />;
  }, [vol]);

  return soundCellMemo;
};
