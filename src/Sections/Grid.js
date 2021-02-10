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
  const { selectedSample, samples } = useContext(Samples);
  const toggleCell = (i) => {
    setPattern((prev) => ({
      ...prev,
      [i]: {
        ...prev[i],
        [selectedSample]:
          prev[i][selectedSample] === 0
            ? 1
            : prev[i][selectedSample] === 1
            ? 0.5
            : 0,
      },
    }));
  };

  const cells = grid64.map((i) => {
    const id = `cell-${i}`;
    let current = null;
    if (selectedSample && pattern[i] && pattern[i][selectedSample])
      current = pattern[i][selectedSample];
    let classes = 'cell';
    if (current) classes += current === 1 ? ' full' : ' half';
    return (
      <div key={id} id={id} className={classes}>
        <CellIcon />
        <div id={id + '-overview'} className='overview'>
          {Object.keys(samples).map((sample, index) => {
            const sampleId = `${id}-${sample}`;
            let sampleClass = 'overview-sample';
            let currentSample = null;
            if (sample && pattern[i] && pattern[i][sample])
              currentSample = pattern[i][sample];
            if (currentSample) sampleClass += ` o${index} full`;
            return (
              <div key={sampleId} id={sampleId} className={sampleClass}></div>
            );
          })}
        </div>
      </div>
    );
  });

  return <div id='grid'>{cells}</div>;
};
