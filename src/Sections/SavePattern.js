import axios from 'axios';
import React, { useState, useContext } from 'react';
import { Kit } from '../Providers/Kit';
import { Pattern } from '../Providers/Pattern';
import { Sequencer } from '../Providers/Sequencer';
import { User } from '../Providers/User';

export const SavePattern = () => {
  const { patternRef } = useContext(Pattern);
  const { bpm } = useContext(Sequencer);
  const { setUser } = useContext(User);
  const { currentKit } = useContext(Kit);

  const [newName, setNewName] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    const cleanName = newName.replace(/[^a-zA-Z0-9 ]/g, '');
    const newPattern = {
      name: cleanName,
      kit: currentKit,
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
    <div className='save-pattern'>
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
