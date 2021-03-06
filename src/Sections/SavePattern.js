import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
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

  const [confirmation, setConfirmation] = useState('');
  useEffect(() => {
    let timeout = setTimeout(() => setConfirmation(''), 3000);
    return () => clearTimeout(timeout);
  }, [confirmation]);

  const [error, setError] = useState('');
  useEffect(() => {
    let timeout = setTimeout(() => setError(''), 3000);
    return () => clearTimeout(timeout);
  }, [error]);

  const handleSave = async (e) => {
    if (!newName) return;
    e.preventDefault();
    const cleanName = newName.replace(/[^a-zA-Z0-9 ]/g, '');
    const newPattern = {
      name: cleanName,
      kit: currentKit,
      bpm,
      pattern: patternRef.current,
    };
    setNewName('');
    try {
      const res = await axios({
        url: 'http://localhost:4000/user/pattern/add',
        method: 'POST',
        data: newPattern,
        withCredentials: true,
      });
      setConfirmation('Pattern saved!');
      setUser(res.data);
    } catch (e) {
      console.log('FAIL ->\n', e);
      setError('Server error: please try again later.');
    }
  };

  return (
    <div className='save-pattern'>
      <form id='save-form' onSubmit={handleSave}>
        <h1 className='pattern-title'>Save Pattern</h1>
        <div className='save-pattern-input'>
          <input
            type='text'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type='submit' disabled={!newName}>
            Save
          </button>
        </div>
      </form>
      <p className={error ? 'error' : 'confirmation'}>
        {error ? error : confirmation}
      </p>
    </div>
  );
};
