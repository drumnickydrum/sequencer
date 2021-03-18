import React, { useEffect, useRef, useState } from 'react';

export const Status = React.createContext();
export const StatusProvider = ({ children }) => {
  const [status, setStatus] = useState('loading');
  const statusCountRef = useRef(0);

  const changeStatus = (newStatus = 'loading') => {
    statusCountRef.current++;
    setStatus(`${statusCountRef.current}#${newStatus}`);
  };

  useEffect(() => {
    let onTimer;
    let fadeTimer;
    if (status) {
      const element = document.getElementById('status');
      element.classList.add('fade-out', 'fade-out-2');
      onTimer = setTimeout(() => element.classList.remove('fade-out'), 500);
      fadeTimer = setTimeout(() => element.classList.remove('fade-out-2'), 0);
    }
    return () => {
      clearTimeout(onTimer);
      clearTimeout(fadeTimer);
    };
  }, [status]);

  const [spAlert, setSpAlert] = useState('');
  const spAlertRef = useRef('');
  const spAlertCountRef = useRef(0);

  const alertSelectSound = (e, newAlert = 'select a sound') => {
    spAlertCountRef.current++;
    setSpAlert(`${spAlertCountRef.current}#${newAlert}`);
  };

  useEffect(() => {
    let onTimer;
    let fadeTimer;
    if (spAlert) {
      const index = spAlert.indexOf('#');
      const message = spAlert.substr(index + 1);
      spAlertRef.current = message;
      const element = document.getElementById('sp-alert');
      element.classList.add('fade-out', 'fade-out-2');
      onTimer = setTimeout(() => element.classList.remove('fade-out'), 500);
      fadeTimer = setTimeout(() => element.classList.remove('fade-out-2'), 0);
    }
    return () => {
      clearTimeout(onTimer);
      clearTimeout(fadeTimer);
    };
  }, [spAlert]);

  return (
    <Status.Provider
      value={{ status, changeStatus, alertSelectSound, spAlert }}
    >
      {children}
    </Status.Provider>
  );
};
