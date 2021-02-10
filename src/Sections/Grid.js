import React, { useContext } from 'react';
import { Pattern } from '../Providers/Pattern';
import { Samples } from '../Providers/Samples';
import { CellIcon } from '../icons';

const createGrid = (size) => {
  let grid = [];
  for (let i = 0; i < size; i++) {
    grid.push(i);
  }
  return grid;
};
const grid64 = createGrid(64);
const grid9 = createGrid(9);

export const Grid = () => {
  const { pattern, setPattern } = useContext(Pattern);
  const { instrument, samples } = useContext(Samples);
  const toggleCell = (i) => {
    setPattern((prev) => ({
      ...prev,
      [i]: {
        ...prev[i],
        [instrument]:
          prev[i][instrument] === 0 ? 1 : prev[i][instrument] === 1 ? 0.5 : 0,
      },
    }));
  };

  const cells = grid64.map((i) => {
    let current = null;
    if (instrument && pattern[i] && pattern[i][instrument])
      current = pattern[i][instrument];
    const id = `cell-${i}`;
    let classes = 'cell';
    if (current) classes += current === 1 ? ' full' : ' half';
    return (
      <div key={id} id={id} className={classes}>
        <CellIcon />
      </div>
    );
  });

  return <div id='grid'>{cells}</div>;
};
