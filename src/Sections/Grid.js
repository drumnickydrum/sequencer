import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Pattern } from '../Providers/Pattern';
import { Kit } from '../Providers/Kit';
import { SawIcon } from '../icons';

export const Grid = () => {
  const { events, prevCellRef, cellModRef } = useContext(Pattern);

  const handleDrag = (e) => {
    if (cellModRef.current) return;
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
    cellModRef,
    modCell,
  } = useContext(Pattern);
  const { kit, refreshMods, setRefreshMods } = useContext(Kit);

  const cellRef = useRef(null);
  const [on, setOn] = useState(false);
  const [pitch, setPitch] = useState(pattern[i][selectedSound]?.notes[0].pitch);
  const [velocity, setVelocity] = useState(
    pattern[i][selectedSound]?.notes[0].velocity
  );
  const [length, setLength] = useState(
    pattern[i][selectedSound]?.notes[0].length
  );
  const [color, setColor] = useState(-1);

  useEffect(() => {
    console.log(pitch);
  }, [pitch]);

  useEffect(() => {
    let newOn, newPitch, newVelocity, newLength;
    if (selectedSound === -1) {
      newOn = false;
      newPitch = 0;
      newVelocity = 0;
      newLength = 1;
    } else {
      newOn = pattern[i][selectedSound].on;
      if (newOn) {
        newPitch =
          pattern[i][selectedSound]?.notes[0].pitch +
          kit[selectedSound].pitchMod;
        newVelocity =
          pattern[i][selectedSound]?.notes[0].velocity *
          kit[selectedSound].velocityMod;
        newLength =
          pattern[i][selectedSound]?.notes[0].length *
          kit[selectedSound].lengthMod;
      }
    }
    setOn(newOn);
    setPitch(newPitch);
    setVelocity(newVelocity);
    setLength(newLength);
    setColor(selectedSound);
    setRefreshMods(false);
  }, [pattern[i][selectedSound], selectedSound, refreshMods]);

  const handleTouchStart = (e) => {
    e.stopPropagation();
    if (cellModRef.current) {
      if (on) modStart(e);
    } else {
      prevCellRef.current = id;
      handleToggle();
    }
  };

  const handleTouchEnd = () => {
    if (cellModRef.current) {
      if (on) modEnd();
    } else {
      prevCellRef.current = null;
    }
  };

  const yRef = useRef(null);
  const xRef = useRef(null);
  const prevRef = useRef(null);
  const modStart = (e) => {
    yRef.current = e.changedTouches[0].clientY;
    xRef.current = e.changedTouches[0].clientX;
    prevRef.current =
      cellModRef.current === 'pitch'
        ? pitch
        : cellModRef.current === 'velocity'
        ? velocity
        : length;
  };

  const handleTouchMove = (e) => {
    if (cellModRef.current === 'pitch') {
      const newY = e.changedTouches[0].clientY;
      if (newY - yRef.current > 1) {
        setPitch((pitch) => pitch - 1);
      } else if (newY - yRef.current < -1) {
        setPitch((pitch) => pitch + 1);
      }
      yRef.current = newY;
    } else if (cellModRef.current === 'velocity') {
      const newY = e.changedTouches[0].clientY;
      if (newY - yRef.current > 1) {
        setVelocity((velocity) => velocity - 0.02);
      } else if (newY - yRef.current < -1) {
        setVelocity((velocity) => velocity + 0.02);
      }
      yRef.current = newY;
    } else {
      const newX = e.changedTouches[0].clientX;
      if (newX - xRef.current > 1) {
        setLength((length) => length + 0.02);
      } else if (newX - xRef.current < -1) {
        setLength((length) => length - 0.02);
      }
      xRef.current = newX;
    }
  };

  const modEnd = () => {
    let newVal;
    if (cellModRef.current === 'pitch') {
      yRef.current = null;
      newVal = pitch;
      if (newVal < 10) {
        newVal = 10;
        setPitch(newVal);
      } else if (newVal > 40) {
        newVal = 40;
        setPitch(newVal);
      }
      modCell(i, 'pitch', newVal);
    } else if (cellModRef.current === 'velocity') {
      yRef.current = null;
      newVal = velocity;
      if (newVal < 0) {
        newVal = 0.1;
        setVelocity(newVal);
      } else if (newVal > 1) {
        newVal = 1;
        setVelocity(newVal);
      }
      modCell(i, 'velocity', newVal);
    } else {
      xRef.current = null;
      newVal = length;
      if (newVal < 0) {
        newVal = 0.01;
        setLength(newVal);
      } else if (newVal > 1) {
        newVal = 1;
        setLength(newVal);
      }
      modCell(i, 'length', newVal);
    }
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
  }, [cellRef, selectedSound, on]);

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
          onTouchMove={cellModRef.current && on ? handleTouchMove : null}
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
  }, [color, pitch, velocity, length, pattern[i]]);

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
