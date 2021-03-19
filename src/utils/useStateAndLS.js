import { useState, useEffect } from 'react';
import { getSS, setSS, getLS, setLS } from './storage';

export const useStateAndLS = (key, val) => {
  const [state, setState] = useState(getLS(key) || val);
  useEffect(() => {
    setLS(key, state);
  }, [key, state]);

  return [state, setState];
};

export const useStateAndSS = (key, val) => {
  const [state, setState] = useState(getSS(key) || val);
  useEffect(() => {
    setSS(key, state);
  }, [key, state]);

  return [state, setState];
};
