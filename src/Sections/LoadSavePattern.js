import axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Pattern } from '../Providers/Pattern';
import { User } from '../Providers/User';
import { LoadPattern } from './LoadPattern';
import { SavePattern } from './SavePattern';
import { INITIAL_USER } from '../Providers/User';

export const LoadSavePattern = () => {
  const { user, setUser } = useContext(User);
  const { showLoad, setShowLoad } = useContext(Pattern);

  const handleLogout = async () => {
    try {
      await axios({
        url: 'http://localhost:4000/user/logout',
        method: 'GET',
        withCredentials: true,
      });
      console.log('Success! \n');
      setUser(INITIAL_USER);
    } catch (e) {
      console.log('FAIL ->\n', e);
    }
  };

  return (
    <div className={showLoad ? 'load-save-pattern show' : 'load-save-pattern'}>
      {user.username && (
        <>
          <div className='login-status'>
            <p>Logged in as: {user.username}</p>
            <button onClick={handleLogout}>logout</button>
          </div>
          <SavePattern />
        </>
      )}
      <LoadPattern />
      <button
        className='load-save-pattern-close'
        onClick={() => setShowLoad(false)}
      >
        Close
      </button>
    </div>
  );
};
