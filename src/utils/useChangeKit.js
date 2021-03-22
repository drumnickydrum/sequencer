import { useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as Tone from 'tone';
import { loadKit } from '../features/sequencer/kitSlice';
import { Kit } from '../Providers/Kit';
import { Transport } from '../Providers/Transport';

export const useChangeKit = () => {
  const { stop, restart, setRestart } = useContext(Transport);
  const { setBuffersLoaded } = useContext(Kit);
  const dispatch = useDispatch();

  const restartKitRef = useRef(null);
  useEffect(() => {
    if (restart && restartKitRef.current) {
      dispatch(loadKit({ kit: restartKitRef.current }));
      restartKitRef.current = null;
    }
  }, [dispatch, restart]);

  const changeKit = (kit) => {
    setBuffersLoaded(false);
    if (Tone.Transport.state === 'started') {
      stop();
      restartKitRef.current = kit;
      setRestart(true);
    } else {
      dispatch(loadKit({ kit }));
    }
  };

  return { changeKit };
};
