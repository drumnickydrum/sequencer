import { useState, useEffect, useRef } from 'react';

export const useStateAndRef = (init = null, refFunc) => {
  const [state, setState] = useState(init);
  if (!refFunc) refFunc = (state) => state;
  const stateRef = useRef(refFunc(state));

  useEffect(() => {
    stateRef.current = refFunc(state);
  }, [state]);

  return [state, setState, stateRef];
};
