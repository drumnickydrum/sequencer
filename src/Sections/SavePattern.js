import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Kit } from '../Providers/Kit';
import { PatternState } from '../Providers/Pattern';
import { Transport } from '../Providers/Transport';
import { User } from '../Providers/User';

export const SavePattern = () => {
  const { patternRef, patternBpm } = useContext(PatternState);
  const { stop } = useContext(Transport);
  const { user, setUser, fetching } = useContext(User);
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
      patternBpm,
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
      {!user.username ? (
        <div className='pattern-select-group'>
          <div className='login-div'>
            <p className='pattern-select-sub'>
              {fetching ? 'Logging in...' : 'Login to save user patterns'}
            </p>
            <Link
              className='login-btn'
              onTouchStart={stop}
              to='/login'
              disabled={fetching}
            >
              {fetching ? 'x' : 'Login'}
            </Link>
          </div>
        </div>
      ) : (
        <form id='save-form' onSubmit={handleSave}>
          <h1 className='pattern-title'>Save Pattern</h1>

          <div className='save-pattern-input'>
            <input
              type='text'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder='Enter pattern name'
            />
            <button type='submit' disabled={!newName}>
              Save
            </button>
          </div>
        </form>
      )}
      {user.username && (
        <p className={error ? 'error' : 'confirmation'}>
          {error ? error : confirmation}
        </p>
      )}
    </div>
  );
};
