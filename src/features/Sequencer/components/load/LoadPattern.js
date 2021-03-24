import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as defaultPatterns from '../../defaults/defaultPatterns';
import { deleteSequence, loadSequence } from '../../reducers/sequencerSlice';
import { DeleteIcon } from '../../../../icons';
import { setFetching } from '../../../../reducers/appSlice';

export const LoadPattern = ({ stopSequencer }) => {
  const dispatch = useDispatch();
  const _id = useSelector((state) => state.sequencer.present._id);

  const user = useSelector((state) => state.app.user);
  const fetching = useSelector((state) => state.app.fetching);

  const [error, setError] = useState('');
  useEffect(() => {
    let timeout = setTimeout(() => setError(''), 3000);
    return () => clearTimeout(timeout);
  }, [error]);

  const selectPattern = (e, type, id) => {
    e.stopPropagation();
    let sequence;
    if (type === 'dp')
      sequence = Object.values(defaultPatterns).find(
        (pattern) => pattern._id === id
      );
    if (type === 'up')
      sequence = user.patterns.find((pattern) => pattern._id === id);
    dispatch(loadSequence({ sequence }));
  };

  // console.log('rendering: LoadPattern');
  return (
    <div className='load-pattern'>
      <h1 className='pattern-title'>Load Pattern</h1>
      <div className='pattern-select'>
        <div className='pattern-select-group'>
          {!user.username ? (
            <div className='login-div'>
              <p className='pattern-select-sub'>
                {fetching ? 'Logging in...' : 'Login to load user patterns'}
              </p>
              <Link
                className='login-btn'
                onTouchStart={stopSequencer}
                to='/login'
                disabled={fetching}
              >
                {fetching ? 'x' : 'Login'}
              </Link>
            </div>
          ) : (
            <>
              <p className='pattern-select-sub'>User Patterns</p>
              {error && <p className='error'>{error}</p>}
              {user.patterns.length === 0 ? (
                <p>No user patterns</p>
              ) : (
                <>
                  <div className='load-pattern-sub'>
                    <p>Name</p>
                    <p>Kit</p>
                    <p>Bpm</p>
                    <p>Delete</p>
                  </div>
                  {user.patterns.map((pattern, i) => (
                    <UserPattern
                      key={`up-${_id}-${i}`}
                      pattern={pattern}
                      _id={_id}
                      selectPattern={selectPattern}
                      setError={setError}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
        <div className='pattern-select-group'>
          <p className='pattern-select-sub'>Default Patterns</p>
          <div className='load-pattern-sub'>
            <p>Name</p>
            <p>Kit</p>
            <p>Bpm</p>
            <p></p>
          </div>
          {Object.keys(defaultPatterns).map((pattern) => {
            const id = defaultPatterns[pattern]._id;
            return (
              <div
                key={`dp-${id}`}
                className={id === _id ? 'pattern selected' : 'pattern'}
                onClick={(e) => selectPattern(e, 'dp', id)}
              >
                <p>{pattern}</p>
                <p>{defaultPatterns[pattern].kit}</p>
                <p>{defaultPatterns[pattern].bpm}</p>
                <p></p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const UserPattern = ({ pattern, _id, selectPattern, setError }) => {
  const dispatch = useDispatch();

  const fetching = useSelector((state) => state.app.fetching);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleShowConfirm = (e, val) => {
    e.stopPropagation();
    setShowConfirm(val);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      dispatch(setFetching(true));
      dispatch(deleteSequence(pattern._id));
    } catch (e) {
      console.log('Delete Sequence ERROR ->\n', e);
      setError('Server error: please try again later.');
    } finally {
      dispatch(setFetching(false));
    }
  };

  // console.log('rendering: UserPattern');
  return showConfirm ? (
    <div className='confirm-delete'>
      <p>Are you sure?</p>
      <button className='red' onClick={handleDelete} disabled={fetching}>
        DELETE
      </button>
      <button
        className='purple'
        onClick={(e) => handleShowConfirm(e, false)}
        disabled={fetching}
      >
        CANCEL
      </button>
    </div>
  ) : (
    <div
      className={
        pattern._id === _id ? 'pattern select selected' : 'pattern select'
      }
      onClick={(e) => selectPattern(e, 'up', pattern._id)}
    >
      <p>{pattern.name}</p>
      <p>{pattern.kit}</p>
      <p>{pattern.bpm}</p>
      <div className='delete-btn' onClick={(e) => handleShowConfirm(e, true)}>
        <DeleteIcon />
      </div>
    </div>
  );
};
