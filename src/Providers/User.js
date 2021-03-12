import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const User = React.createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    const getUser = async (e) => {
      if (e.code !== 'KeyG') return;
      try {
        const sessionUser = await axios.get(
          // 'https://drumnickydrum-sequencer.herokuapp.com/user',
          'http://localhost:4000/user',
          {
            withCredentials: true,
          }
        );
        setUser(sessionUser);
      } catch (e) {
        console.log('GET USER ERROR: \n');
        console.log(e.response?.data || e.message);
      }
    };
    getUser({ code: 'KeyG' });
    document.addEventListener('keydown', getUser);
    return () => document.removeEventListener('keydown', getUser);
  }, []);

  return <User.Provider value={{ user, setUser }}>{children}</User.Provider>;
};
