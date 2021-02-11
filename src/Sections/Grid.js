import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Editor } from '../Providers/Editor';
import { Instrument } from '../Providers/Instrument';
import { CellIcon, CircleIcon } from '../icons';

export const Grid = () => {
  const { pattern } = useContext(Editor);
  const { instrument } = useContext(Instrument);
  const [size, setSize] = useState(64);
  const [sampleSize, setSampleSize] = useState(9);

  useEffect(() => {
    if (pattern.length !== size) setSize(pattern.length);
  }, [pattern.length]);

  useEffect(() => {
    if (instrument.length !== sampleSize) setSampleSize(instrument.length);
  }, [instrument.length]);

  const getCells = useMemo(() => {
    console.log('rendering all cells');
    let cells = [];
    for (let i = 0; i < size; i++) {
      const id = `cell-${i}`;
      cells.push(
        <div key={id} className={`cell ${id}`}>
          <CellIcon />
          <Overview cell={i} size={sampleSize} />
        </div>
      );
    }
    return cells;
  }, [pattern.length, instrument.length]);

  return <div id='grid'>{getCells}</div>;
};

const Overview = ({ cell, size = 9 }) => {
  console.log('rendering overview cell');
  let overview = [];
  for (let i = 0; i < size; i++) {
    const id = `${cell}-${i}`;
    overview.push(
      <div key={id} id={id} className={`overview-sample color${i}`}>
        <CircleIcon />
      </div>
    );
  }
  return <div id='overview'>{overview}</div>;
};

// const grid64 = createGrid(64);
// const grid9 = createGrid(9);

// export const Grid = () => {
//   const { pattern, setPattern } = useContext(Pattern);
//   const { selectedSample, samples } = useContext(Samples);
//   const [cells, setCells] = useState();

//   const handleToggle = (newVol, i) => {
//     setPattern((pattern) => {
//       pattern[i][selectedSample] = newVol;
//       return pattern;
//     });
//   };

//   const Cell = ({ cell, i, handleToggle }) => {
//     const [vol, setVol] = useState(pattern[i][selectedSample]);

//     const toggleCell = () => {
//       const newVol = vol === 0 ? 1 : vol === 1 ? 0.5 : 0;
//       setVol(newVol);
//       handleToggle(newVol, i);
//     };

//     let classes = 'cell';
//     let current = cell[selectedSample] || null;
//     if (current) classes += ` on color${samples[selectedSample].color}`;
//     const iconStyle = { opacity: current ? vol : 1 };

//     console.log('rendering cell: ', i);

//     return (
//       <div className={classes} onMouseDown={() => toggleCell(i)}>
//         <CellIcon style={iconStyle} />
//         <div className='overview'>
//           <Overview cell={cell} i={i} />
//         </div>
//       </div>
//     );
//   };

//   const Overview = ({ cell, i }) =>
//     Object.entries(samples).map(([sample, { color }], index) => {
//       let sampleClass = 'overview-sample';
//       let currentSample = cell[sample] || null;
//       if (currentSample) sampleClass += ` color${color} full`;

//       console.log('rendering overview: ', index);
//       return (
//         <div key={i + index + sample} className={sampleClass}>
//           <CircleIcon />
//         </div>
//       );
//     });

//   const getCells = () => {
//     const newCells = pattern.map((cell, i) => {
//       const id = `cell-${i}`;
//       return <Cell key={id} cell={cell} i={i} handleToggle={handleToggle} />;
//     });
//     setCells(newCells);
//   };

//   useEffect(() => {
//     getCells();
//   }, [selectedSample]);

//   return <div id='grid'>{cells}</div>;
// };
