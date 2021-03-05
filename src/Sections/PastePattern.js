import React, { useState, useContext } from 'react';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';

export const PastePattern = () => {
  const { kit } = useContext(Kit);
  const { selectedSound, copying } = useContext(Pattern);

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
            />
          );
        })}
      </div>
    </div>
  );
};

const SoundBtn = ({ i, sound, selected }) => {
  const { patternRef, pastePattern } = useContext(Pattern);
  const [pasted, setPasted] = useState(false);

  const handleClick = () => {
    if (!pasted) {
      pastePattern(i);
      setPasted(true);
    }
  };

  let classes = `sound borderDefault`;
  if (selected) classes += ` border${sound.color} `;
  return (
    <div className={classes} onClick={handleClick}>
      {selected ? <p className='flashing'>copying...</p> : <p>{sound.name}</p>}
      <div className={selected ? 'cells selected' : 'cells'}>
        {patternRef.current.map((_, step) => {
          const classes = patternRef.current[step][i].on
            ? `cell bg${i} on`
            : 'cell';
          return <div key={`paste-pattern-${step}-${i}`} className={classes} />;
        })}
      </div>
    </div>
  );
};
