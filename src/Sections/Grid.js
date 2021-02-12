import React, { useContext, useMemo } from 'react';
import { CellIcon, CircleIcon } from '../icons';
import { Pattern, SelectedSound, SetPattern } from '../Providers/Pattern';

export const Grid = () => {
  const cells = getCells();
  return <div id='grid'>{cells}</div>;
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
  const pattern = useContext(Pattern);
  const setPattern = useContext(SetPattern);
  const selectedSound = useContext(SelectedSound);

  const handleClick = () => {
    setPattern((pattern) => {
      const newCell = [...pattern[i]];
      const vol = newCell[selectedSound];
      let newVol = vol === 1 ? 0.5 : vol === 0.5 ? 0 : 1;
      newCell[selectedSound] = newVol;
      const newPattern = [...pattern];
      newPattern[i] = newCell;
      return newPattern;
    });
  };

  const cellMemo = useMemo(() => {
    // console.log('rendering cell: ', i);
    const classes = `cell ${id} color${selectedSound}`;
    const vol = pattern[i][selectedSound];
    const soundCells = getSoundCells(id, pattern[i]);
    return (
      <div className={classes} onClick={handleClick}>
        <CellIcon style={{ opacity: vol }} />
        <div id='sound-cells'>{soundCells}</div>
      </div>
    );
  }, [pattern[i], selectedSound]);

  return cellMemo;
};

const getSoundCells = (cellId, patternI, size = 9) => {
  let soundCells = [];
  for (let i = 0; i < size; i++) {
    const id = `${cellId}-${i}`;
    const color = patternI[i] ? `color${i}` : '';
    const vol = patternI[i];
    soundCells.push(
      <SoundCell key={id} id={id} color={color} vol={vol} patternI={patternI} />
    );
  }
  return soundCells;
};

const SoundCell = ({ id, color, vol, patternI }) => {
  const soundCellMemo = useMemo(() => {
    // console.log('rendering soundCell: ', id);
    const classes = `sound-cell ${color}`;
    return (
      <div id={id} className={classes}>
        <CircleIcon style={{ opacity: vol }} />
      </div>
    );
  }, [patternI]);

  return soundCellMemo;
};
