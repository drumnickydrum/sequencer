import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { CellIcon, CircleIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';

export const Grid = () => {
  const { events } = useContext(Pattern);

  let prevCellRef = useRef(null);
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
  const { pattern, toggleCell, setEvents, selectedSound } = useContext(Pattern);
  const vol = pattern[i][selectedSound];
  const cellRef = useRef(null);

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
          onMouseDown={handleToggle}
        >
          <div className='sound-cells'>{soundCells}</div>
        </div>
      </div>
    );
  }, [pattern[i], selectedSound, vol]);

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
