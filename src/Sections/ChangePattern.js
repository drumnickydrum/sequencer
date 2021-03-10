import React, { useContext } from 'react';
import * as patterns from '../defaults/defaultPatterns';
import { ChevronDownIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';
import { SetSequencer } from '../Providers/Sequencer';

export const ChangePattern = () => {
  const { changePattern } = useContext(Pattern);
  const { setBpm } = useContext(SetSequencer);
  const handleChange = ({ target: { value } }) => {
    changePattern(patterns[value].pattern);
    setBpm(patterns[value].bpm);
  };
  return (
    <div className='change-pattern'>
      <h1>Change Pattern</h1>
      <div className='custom-select'>
        <select className='pattern-select' onChange={handleChange}>
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
