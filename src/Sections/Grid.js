import React, { useState, useContext, useEffect } from 'react';
import { Pattern } from '../Providers/Pattern';
import { Samples } from '../Providers/Samples';
import { CellIcon, CircleIcon } from '../icons';

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
  const { selectedSample, samples } = useContext(Samples);
  const [cells, setCells] = useState();

  const Cell = ({ cell, i }) => {
    let classes = 'cell';
    let current = cell[selectedSample] || null;
    if (current) classes += ` on color${samples[selectedSample].color}`;
    const iconStyle = { opacity: cell[selectedSample] };
    console.log('rendering cell: ', i);
    return (
      <div className={classes} onMouseDown={() => toggleCell(i)}>
        <CellIcon style={iconStyle} />
        <div className='overview'>
          <Overview cell={cell} i={i} />
        </div>
      </div>
    );
  };

  const Overview = ({ cell, i }) =>
    Object.entries(samples).map(([sample, { color }], index) => {
      let sampleClass = 'overview-sample';
      let currentSample = cell[sample] || null;
      if (currentSample) sampleClass += ` color${color} full`;
      return (
        <div key={i + index + sample} className={sampleClass}>
          <CircleIcon />
        </div>
      );
    });

  const getCells = () => {
    const newCells = pattern.map((cell, i) => {
      const id = `cell-${i}`;
      return <Cell key={id} cell={cell} i={i} />;
    });
    setCells(newCells);
  };

  const toggleCell = (i) => {
    const newPattern = [...pattern];
    newPattern[i] = {
      ...pattern[i],
      [selectedSample]:
        pattern[i][selectedSample] === 0
          ? 1
          : pattern[i][selectedSample] === 1
          ? 0.5
          : 0,
    };
    setPattern(newPattern);
  };

  useEffect(() => {
    getCells();
  }, [pattern, selectedSample]);

  return <div id='grid'>{cells}</div>;
};
