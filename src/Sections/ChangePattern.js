import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as patterns from '../defaults/defaultPatterns';
import { ChevronDownIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';

export const ChangePattern = () => {
  const { changePattern, patternName, patternRef } = useContext(Pattern);
  const { setBpm } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);

  const [name, setName] = useState('');

  const [status, setStatus] = useState('');

  const handleChange = ({ target: { value } }) => {
    const changeTempo = (newTempo) => setBpm(newTempo);
    changePattern(patterns[value], changeTempo, bpm);
  };

  useEffect(() => {
    console.log(patternName);
  }, [patternName]);

  const handleSave = async (e) => {
    e.preventDefault();
    const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '');
    const newPattern = {
      name: cleanName,
      bpm,
      pattern: patternRef.current,
    };
    try {
      const dbUser = await axios({
        url: 'http://localhost:4000/user/pattern',
        method: 'POST',
        data: newPattern,
        withCredentials: true,
      });
      console.log('Success! \n');
      console.log(dbUser);
    } catch (e) {
      console.log('FAIL ->\n', e);
    }
  };
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
      <form id='save-form' onSubmit={handleSave}>
        <h1>Save Pattern</h1>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type='submit'>Save</button>
      </form>
      {status}
    </div>
  );
};
