import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import * as defaultPatterns from '../defaults/defaultPatterns';
import { DeleteIcon } from '../icons';
import { Pattern } from '../Providers/Pattern';
import { Sequencer, SetSequencer } from '../Providers/Sequencer';
import { User } from '../Providers/User';
import { useChangeKit } from '../utils/useChangeKit';

export const LoadPattern = () => {
  const { loadPattern, patternName } = useContext(Pattern);
  const { setBpm } = useContext(SetSequencer);
  const { bpm } = useContext(Sequencer);
  const { user } = useContext(User);
  const { changeKit } = useChangeKit();

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
      <div className='load-pattern-sub'>
        <p>Name</p>
        <p>Kit</p>
        <p>Bpm</p>
        <p>Delete</p>
      </div>
      <div className='pattern-select'>
        <p className='pattern-select-sub'>Default Patterns</p>
        {Object.keys(defaultPatterns).map((pattern, i) => (
          <div
            key={`dp-${i}-${pattern}`}
            className={
              pattern === patternName
                ? 'pattern select selected'
                : 'pattern select'
            }
            onClick={(e) => handleClick(e, 'dp', pattern)}
          >
            <p>{pattern}</p>
            <p>{defaultPatterns[pattern].kit}</p>
            <p>{defaultPatterns[pattern].bpm}</p>
            <p></p>
          </div>
        ))}
        {!user.username ? (
          <div className='login-div'>
            <p>Login to load/save user patterns</p>
            <Link className='login-btn' to='/login'>
              Login
            </Link>
          </div>
        ) : (
          <>
            <p className='pattern-select-sub'>User Patterns</p>
            {user.patterns.length === 0 ? (
              <p>No user patterns</p>
            ) : (
              user.patterns.map((pattern, i) => (
                <UserPattern
                  key={`up-${i}-${pattern.name}`}
                  pattern={pattern}
                  patternName={patternName}
                  handleClick={handleClick}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

const UserPattern = ({ pattern, patternName, handleClick }) => {
  const { setUser } = useContext(User);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleShowConfirm = (e, val) => {
    e.stopPropagation();
    setShowConfirm(val);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
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
    }
  };

  return showConfirm ? (
    <div className='confirm-delete'>
      <p>Are you sure?</p>
      <button className='red' onClick={handleDelete}>
        DELETE
      </button>
      <button className='purple' onClick={(e) => handleShowConfirm(e, false)}>
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
