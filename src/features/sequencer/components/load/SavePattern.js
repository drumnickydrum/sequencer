import React, { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setFetching } from '../../../../reducers/appSlice';
import { Transport } from '../../providers/Transport';
import { saveSequence } from '../../reducers/sequencerSlice';

export const SavePattern = () => {
  const dispatch = useDispatch();

  const bpm = useSelector((state) => state.sequencer.present.bpm);
  const pattern = useSelector((state) => state.sequencer.present.pattern);

  const { stop } = useContext(Transport);

  const user = useSelector((state) => state.app.user);
  const fetching = useSelector((state) => state.app.fetching);
  const kit = useSelector((state) => state.kit.name);

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

  const save = async (e) => {
    e.preventDefault();
    if (!newName) return setError('name required');
    const cleanName = newName.replace(/[^a-zA-Z0-9 ]/g, '');
    const newPattern = {
      name: cleanName,
      kit,
      bpm,
      pattern,
    };
    setNewName('');
    try {
      dispatch(setFetching(true));
      await dispatch(saveSequence(newPattern));
      setConfirmation('Pattern saved!');
    } catch (e) {
      console.log('Save Sequence ERROR ->\n', e);
      setError('Server error: please try again later.');
    } finally {
      dispatch(setFetching(false));
    }
  };

  console.log('rendering: SavePattern');
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
        <form id='save-form' onSubmit={save}>
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
