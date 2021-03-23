import React from 'react';
import { LoadPattern } from './LoadPattern';
import { SavePattern } from './SavePattern';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setShow } from '../../../../reducers/appSlice';

export const LoadSavePattern = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.app.user);

  const show = useSelector((state) => state.app.show);
  const fetching = useSelector((state) => state.app.fetching);

  const changeTab = (type) => {
    dispatch(setShow(type));
  };

  const onLogout = () => dispatch(logout());

  const onClose = () => dispatch(setShow(''));

  let loadStyle = 'load-save-tab';
  let saveStyle = loadStyle;
  if (show === 'load') loadStyle += ' selected';
  if (show === 'save') saveStyle += ' selected';

  //console.log('rendering: LoadSavePattern');
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
              <button disabled={fetching} onClick={onLogout}>
                logout
              </button>
            </div>
          </>
        )}
        {show === 'save' && <SavePattern />}
        {show === 'load' && <LoadPattern />}
      </div>
      <div className={show ? 'bottom-btn show' : 'bottom-btn'}>
        <button className='load-save-pattern-close' onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
};
