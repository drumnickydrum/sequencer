import React, { useContext, useEffect } from 'react';
import * as patterns from '../defaults/defaultPatterns';
import { ChevronDownIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';

export const ChangePattern = () => {
  const { changePattern, patternName } = useContext(Pattern);
  const { setBpm } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);
  const handleChange = ({ target: { value } }) => {
    const changeTempo = (newTempo) => setBpm(newTempo);
    changePattern(patterns[value], changeTempo, bpm);
  };

  useEffect(() => {
    console.log(patternName);
  }, [patternName]);
  return (
    <div className='change-pattern'>
      <h1>Change Pattern</h1>
      <div className='custom-select'>
        <select
          className='pattern-select'
          value={patternName}
          onChange={handleChange}
        >
          {Object.keys(patterns).map((pattern) => {
            return (
              <option key={`cp-${pattern}`} value={pattern}>
                {pattern}
              </option>
            );
          })}
        </select>
        <ChevronDownIcon />
      </div>
    </div>
  );
};
