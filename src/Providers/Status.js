import React, { useEffect, useRef, useState } from 'react';

export const Status = React.createContext();
export const StatusProvider = ({ children }) => {
  const [status, setStatus] = useState('status: loading');
  const countRef = useRef(0);

  const changeStatus = (newStatus) => {
    // setStatus('');
    // setTimeout(() => setStatus(newStatus), 0);
    countRef.current++;
    setStatus(`${countRef.current}#${newStatus}`);
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

  return (
    <Status.Provider value={{ status, changeStatus }}>
      {children}
    </Status.Provider>
  );
};
