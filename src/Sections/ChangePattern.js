import React, { useContext, useState } from 'react';
import axios from 'axios';
import * as defaultPatterns from '../defaults/defaultPatterns';
import { ChevronDownIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';
import { User } from '../Providers/User';

export const ChangePattern = () => {
  const { user, setUser } = useContext(User);
  const { changePattern, patternName, patternRef } = useContext(Pattern);
  const { setBpm } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);

  const [newName, setNewName] = useState('');

  const [status, setStatus] = useState('');

  const handleChange = ({ target: { value } }) => {
    const changeTempo = (newTempo) => setBpm(newTempo);
    const patternType = value.substr(0, 2);
    const patternName = value.substr(3);
    let newPattern;
    if (patternType === 'dp') newPattern = defaultPatterns[patternName];
    else
      newPattern = user.patterns.find(
        (pattern) => pattern.name === patternName
      );
    console.log('newPattern: ', newPattern);
    changePattern(newPattern, changeTempo, bpm);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const cleanName = newName.replace(/[^a-zA-Z0-9 ]/g, '');
    const newPattern = {
      name: cleanName,
      bpm,
      pattern: patternRef.current,
    };
    try {
      const res = await axios({
        url: 'http://localhost:4000/user/pattern',
        method: 'POST',
        data: newPattern,
        withCredentials: true,
      });
      console.log('Success! \n');
      console.log(res.data);
      setUser(res.data);
    } catch (e) {
      console.log('FAIL ->\n', e);
    }
  };
  return (
    <div className='change-pattern'>
      <p className='pattern-name'>current pattern: {patternName}</p>
      <div className='custom-select'>
        <select
          name='pattern-select'
          id='pattern-select'
          className='pattern-select'
          defaultValue='Load Pattern'
          onChange={handleChange}
        >
          <option disabled>Load Pattern</option>
          <optgroup label='default patterns'>
            {Object.keys(defaultPatterns).map((pattern, i) => {
              return (
                <option key={`dp-${i}-${pattern}`} value={`dp-${pattern}`}>
                  {pattern}
                </option>
              );
            })}
          </optgroup>
          <optgroup label='user patterns'>
            {user &&
              user.patterns.map((pattern, i) => {
                return (
                  <option
                    key={`up-${i}-${pattern.name}`}
                    value={`up-${pattern.name}`}
                  >
                    {pattern.name}
                  </option>
                );
              })}
          </optgroup>
        </select>
        <ChevronDownIcon />
      </div>
      <form id='save-form' onSubmit={handleSave}>
        <h1>Save Pattern</h1>
        <input
          type='text'
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type='submit'>Save</button>
      </form>
      {status}
    </div>
  );
};
