import React, { useContext, useRef } from 'react';
import { PatternAction } from '../Providers/Actions/Pattern';
import { Kit } from '../Providers/Kit';
import { PatternState } from '../Providers/Pattern';

export const PastePattern = () => {
  const { kitRef } = useContext(Kit);
  const { selectedSound, copying } = useContext(PatternState);

  return (
    <div id='paste-pattern' className={copying ? 'show' : ''}>
      <div id='paste-pattern-sounds'>
        {kitRef.current.sounds.map((sound, i) => {
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
  const { patternRef } = useContext(PatternState);
  const { pastePattern } = useContext(PatternAction);

  const ref = useRef(null);

  const handleClick = () => {
    pastePattern(i);
    if (ref.current) {
      ref.current.classList.add('selected');
      setTimeout(() => ref.current.classList.remove('selected'));
    }
  };

  let classes = `sound borderDefault`;
  if (selected) classes += ` border${sound.color} flashing`;
  return (
    <div className={classes} onClick={handleClick}>
      {selected ? <p className='flashing'>copying...</p> : <p>{sound.name}</p>}
      <div ref={ref} className={selected ? 'cells selected' : 'cells'}>
        {patternRef.current.map((_, step) => {
          const classes = patternRef.current[step][i].noteOn
            ? `cell bg${i} on`
            : 'cell';
          return <div key={`paste-pattern-${step}-${i}`} className={classes} />;
        })}
      </div>
      <div className='border-flashing' />
    </div>
  );
};
