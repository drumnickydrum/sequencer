import React, { useContext } from 'react';
import * as defaultPatterns from '../defaults/defaultPatterns';
import { Pattern } from '../Providers/Pattern';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';
import { User } from '../Providers/User';
import { useChangeKit } from '../utils/useChangeKit';

export const LoadPattern = () => {
  const { loadPattern, patternName } = useContext(Pattern);
  const { setBpm } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);
  const { user } = useContext(User);
  const { changeKit } = useChangeKit();

  const handleClick = (type, name) => {
    const changeTempo = (newTempo) => setBpm(newTempo);
    let newPattern;
    if (type === 'dp') newPattern = defaultPatterns[name];
    else newPattern = user.patterns.find((pattern) => pattern.name === name);
    console.log('newPattern: ', newPattern);
    loadPattern(newPattern, changeTempo, bpm, changeKit);
  };

  return (
    <div className='load-pattern show'>
      <h1 className='load-pattern-title'>Load Pattern</h1>
      <div className='load-pattern-sub'>
        <p>Name</p>
        <p>Kit</p>
        <p>Bpm</p>
      </div>
      <div className='pattern-select'>
        <p className='pattern-select-sub'>Default Patterns</p>
        {Object.keys(defaultPatterns).map((pattern, i) => (
          <div
            key={`dp-${i}-${pattern}`}
            className={
              pattern === patternName
                ? 'pattern select selected'
                : 'pattern select'
            }
            onClick={() => handleClick('dp', pattern)}
          >
            <p>{pattern}</p>
            <p>{defaultPatterns[pattern].kit}</p>
            <p>{defaultPatterns[pattern].bpm}</p>
          </div>
        ))}
        <p className='pattern-select-sub'>User Patterns</p>
        {user.patterns.length === 0 && <p>No user patterns</p>}
        {user.patterns.map((pattern, i) => (
          <div
            key={`up-${i}-${pattern.name}`}
            className={
              pattern.name === patternName
                ? 'pattern select selected'
                : 'pattern select'
            }
            onClick={() => handleClick('up', pattern.name)}
          >
            <p>{pattern.name}</p>
            <p>{pattern.kit}</p>
            <p>{pattern.bpm}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
