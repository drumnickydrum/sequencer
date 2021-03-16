import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as defaultPatterns from '../defaults/defaultPatterns';
import { DeleteIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';
import { User } from '../Providers/User';
import { useChangeKit } from '../utils/useChangeKit';

export const LoadPattern = () => {
  const { loadPattern, patternName } = useContext(Pattern);
  const { setBpm, stop } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);
  const { user } = useContext(User);
  const { changeKit } = useChangeKit();

  const [error, setError] = useState('');
  useEffect(() => {
    let timeout = setTimeout(() => setError(''), 3000);
    return () => clearTimeout(timeout);
  }, [error]);

  const handleClick = (e, type, name) => {
    e.stopPropagation();
    const changeTempo = (newTempo) => setBpm(newTempo);
    let newPattern;
    if (type === 'dp') newPattern = defaultPatterns[name];
    else newPattern = user.patterns.find((pattern) => pattern.name === name);
    loadPattern(newPattern, changeTempo, bpm, changeKit);
  };

  return (
    <div className='load-pattern'>
      <h1 className='pattern-title'>Load Pattern</h1>
      <div className='pattern-select'>
        <div className='pattern-select-group'>
          {!user.username ? (
            <div className='login-div'>
              <p className='pattern-select-sub'>
                Login to load/save user patterns
              </p>
              <Link className='login-btn' onClick={stop} to='/login'>
                Login
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
                      key={`up-${i}-${pattern.name}`}
                      pattern={pattern}
                      patternName={patternName}
                      handleClick={handleClick}
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
          {Object.keys(defaultPatterns).map((pattern, i) => (
            <div
              key={`dp-${i}-${pattern}`}
              className={
                pattern === patternName ? 'pattern selected' : 'pattern'
              }
              onClick={(e) => handleClick(e, 'dp', pattern)}
            >
              <p>{pattern}</p>
              <p>{defaultPatterns[pattern].kit}</p>
              <p>{defaultPatterns[pattern].bpm}</p>
              <p></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const UserPattern = ({ pattern, patternName, handleClick, setError }) => {
  const { setUser } = useContext(User);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowConfirm = (e, val) => {
    e.stopPropagation();
    setShowConfirm(val);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await axios({
        url: 'http://localhost:4000/user/pattern/delete',
        method: 'POST',
        data: { _id: pattern._id },
        withCredentials: true,
      });
      console.log('success!\n');
      setUser(res.data);
    } catch (e) {
      console.log('FAIL ->\n', e);
      setError('Server error: please try again later.');
      setLoading(false);
    }
  };

  return showConfirm ? (
    <div className='confirm-delete'>
      <p>Are you sure?</p>
      <button className='red' onClick={handleDelete} disabled={loading}>
        DELETE
      </button>
      <button
        className='purple'
        onClick={(e) => handleShowConfirm(e, false)}
        disabled={loading}
      >
        CANCEL
      </button>
    </div>
  ) : (
    <div
      className={
        pattern.name === patternName
          ? 'pattern select selected'
          : 'pattern select'
      }
      onClick={(e) => handleClick(e, 'up', pattern.name)}
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
