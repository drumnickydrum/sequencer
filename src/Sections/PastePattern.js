import React, { useState, useContext } from 'react';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';

export const PastePattern = () => {
  const { kit } = useContext(Kit);
  const { selectedSound, pastePattern, copying } = useContext(Pattern);

  return (
    <div id='paste-pattern' className={copying ? 'show' : ''}>
      <div id='paste-pattern-sounds'>
        {kit.map((sound, i) => {
          const selected = i === selectedSound;
          return (
            <SoundBtn
              key={`paste-pattern-${sound.name}`}
              i={i}
              sound={sound}
              selected={selected}
              handleClick={selected ? null : () => pastePattern(i)}
            />
          );
        })}
      </div>
    </div>
  );
};

const SoundBtn = ({ i, sound, selected, handleClick }) => {
  const { pattern } = useContext(Pattern);
  let cells = [];
  for (let c = 0; c < 64; c++) {
    const classes = pattern[c].sounds[i].on ? `cell bg${i} on` : 'cell';
    cells.push(<div key={`paste-pattern-${i}-${c}`} className={classes} />);
  }
  let classes = `sound borderDefault`;
  if (selected) classes += ` border${sound.color} `;
  return (
    <div className={classes} onClick={() => handleClick(i)}>
      {selected ? <p className='flashing'>copying...</p> : <p>{sound.name}</p>}
      <div className={selected ? 'cells selected' : 'cells'}>{cells}</div>
    </div>
  );
};
