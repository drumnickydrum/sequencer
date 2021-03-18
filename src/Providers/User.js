import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Status } from './Status';

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
  const { changeStatus } = useContext(Status);

  useEffect(() => {
    const getUser = async () => {
      setFetching(true);
      let status;
      try {
        const res = await axios.get(
          // 'https://drumnickydrum-sequencer.herokuapp.com/user',
          'http://localhost:4000/user',
          {
            withCredentials: true,
          }
        );
        if (res.data) {
          setUser(res.data);
          status = 'User logged in';
        }
      } catch (e) {
        console.log('GET USER ERROR: \n');
        console.log(e.response?.data || e.message);
        status = 'User not logged in';
      } finally {
        setFetching(false);
        changeStatus(status);
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
