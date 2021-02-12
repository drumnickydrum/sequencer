import React from 'react';
import { CellIcon, CircleIcon } from '../icons';

export const Grid = () => {
  const cells = getCells();
  return <div id='grid'>{cells}</div>;
};

const Cell = ({ id }) => {
  const soundCells = getSoundCells(id);
  return (
    <div className={`cell ${id}`}>
      <CellIcon />
      <div id='sound-cells'>{soundCells}</div>
    </div>
  );
};

const SoundCell = ({ id, classes }) => {
  return (
    <div id={id} className={classes}>
      <CircleIcon />
    </div>
  );
};

const getCells = (size = 64) => {
  let cells = [];
  for (let i = 0; i < size; i++) {
    const id = `cell-${i}`;
    cells.push(<Cell key={id} id={id} />);
  }
  return cells;
};

const getSoundCells = (id, size = 9) => {
  let soundCells = [];
  for (let i = 0; i < size; i++) {
    const soundId = `${id}-${i}`;
    const soundClasses = `sound-cell color${i}`;
    soundCells.push(
      <SoundCell key={soundId} id={soundId} classes={soundClasses} />
    );
  }
  return soundCells;
};
