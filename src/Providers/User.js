import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const INITIAL_USER = {
  googleId: '',
  twitterId: '',
  facebookId: '',
  githubId: '',
  username: '',
  patterns: [],
};

export const User = React.createContext();
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(INITIAL_USER);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setFetching(true);
      try {
        const res = await axios.get(
          // 'https://drumnickydrum-sequencer.herokuapp.com/user',
          'http://localhost:4000/user',
          {
            withCredentials: true,
          }
        );
        if (res.data) setUser(res.data);
      } catch (e) {
        console.log('GET USER ERROR: \n');
        console.log(e.response?.data || e.message);
      } finally {
        setFetching(false);
      }
    };
    getUser();
  }, []);

  return (
    <User.Provider value={{ user, setUser, fetching }}>
      {children}
    </User.Provider>
  );
};
