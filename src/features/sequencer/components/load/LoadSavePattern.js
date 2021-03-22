import axios from 'axios';
import React, { useContext, useState } from 'react';
import { LoadPattern } from './LoadPattern';
import { SavePattern } from './SavePattern';
import { User, INITIAL_USER } from '../../../../Providers/User';

export const LoadSavePattern = () => {
  const { user, setUser } = useContext(User);

  // const { show, setShow } = useContext(PatternState);
  const show = '';
  const setShow = () => {};

  const [fetching, setFetching] = useState(false);

  const logout = async () => {
    try {
      setFetching(true);
      await axios({
        url: 'http://localhost:4000/user/logout',
        method: 'GET',
        withCredentials: true,
      });
      console.log('Success! \n');
      setUser(INITIAL_USER);
    } catch (e) {
      console.log('FAIL ->\n', e);
    } finally {
      setFetching(false);
    }
  };

  const changeTab = (type) => {
    setShow(type);
  };

  let loadStyle = 'load-save-tab';
  let saveStyle = loadStyle;
  if (show === 'load') loadStyle += ' selected';
  if (show === 'save') saveStyle += ' selected';
  return (
    <>
      <div className={show ? 'load-save-pattern show' : 'load-save-pattern'}>
        <div className='load-save-tabs'>
          <button
            id='load-tab'
            className={loadStyle}
            onClick={() => changeTab('load')}
          >
            <label htmlFor='load-tab'>Load</label>
          </button>
          <button
            id='save-tab'
            className={saveStyle}
            onClick={() => changeTab('save')}
          >
            <label htmlFor='save-tab'>Save</label>
          </button>
        </div>
        {user.username && (
          <>
            <div className='login-status'>
              {fetching ? (
                <p>Logging out...</p>
              ) : (
                <p>Logged in as: {user.username}</p>
              )}
              <button disabled={fetching} onClick={logout}>
                logout
              </button>
            </div>
          </>
        )}
        {show === 'save' && <SavePattern />}
        {show === 'load' && <LoadPattern />}
      </div>
      <div className={show ? 'bottom-btn show' : 'bottom-btn'}>
        <button className='load-save-pattern-close' onClick={() => setShow('')}>
          Close
        </button>
      </div>
    </>
  );
};
