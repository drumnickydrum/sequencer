import React, { useEffect, useRef, useContext, useCallback } from 'react';
import * as Tone from 'tone';
import { PatternRef } from './PatternRef';
import { MIDI_NOTES } from '../utils/MIDI_NOTES';
import { Kit } from './Kit';
import { useDispatch, useSelector } from 'react-redux';
import { setRestart, setTransportState } from '../reducers/toneSlice';

export const Transport = React.createContext();
export const TransportProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { patternRef, cellsRef } = useContext(PatternRef);
  const { kitRef } = useContext(Kit);

  const transportState = useSelector((state) => state.tone.transportState);
  const buffersLoaded = useSelector((state) => state.tone.buffersLoaded);

  const stepRef = useRef(0);

  const bpm = useSelector((state) => state.sequencer.present.bpm);
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const start = () => {
    removeCursor();
    if (transportState !== 'started') {
      pauseFlashing();
      if (transportState === 'stopped') schedulePattern();
      dispatch(setTransportState('started'));
      Tone.Transport.start();
    } else {
      pause();
    }
  };

  const pause = () => {
    dispatch(setTransportState('paused'));
    Tone.Transport.pause();
    addCursor();
    startFlashing();
  };

  const startFlashing = () => {
    const flashingCells = document.querySelectorAll('.flashing');
    flashingCells.forEach((cell) => cell.classList.remove('pause'));
  };

  const pauseFlashing = () => {
    const flashingCells = document.querySelectorAll('.flashing');
    flashingCells.forEach((cell) => cell.classList.add('pause'));
  };

  const addCursor = () => {
    cellsRef.current[`cell-${stepRef.current}`].cellRef.current.dataset.cursor =
      'true';
  };

  const removeCursor = useCallback(() => {
    const len = patternRef.current.length;
    const step = stepRef.current;
    const prevStep = step - 1 > 0 ? step - 1 : len - 1;
    const nextStep = (step + 1) % len;
    cellsRef.current[`cell-${step}`].cellRef.current.dataset.cursor = false;
    cellsRef.current[`cell-${prevStep}`].cellRef.current.dataset.cursor = false;
    cellsRef.current[`cell-${nextStep}`].cellRef.current.dataset.cursor = false;
  }, [cellsRef, patternRef]);

  const stop = useCallback(() => {
    dispatch(setTransportState('stopped'));
    stopAndCancelEvents();
    removeCursor();
    startFlashing();
    stepRef.current = 0;
  }, [dispatch, removeCursor]);

  // just in case
  useEffect(() => {
    if (!buffersLoaded && transportState === 'started') {
      stop();
    }
  }, [buffersLoaded, stop, transportState]);

  const restart = useSelector((state) => state.tone.restart);
  useEffect(() => {
    if (restart) {
      if (buffersLoaded) {
        dispatch(setRestart(false));
        stepRef.current = 0;
        start();
      }
    }
  }, [buffersLoaded, dispatch, restart, start]);

  const schedulePattern = () => {
    Tone.Transport.scheduleRepeat((time) => {
      if (!buffersLoaded) return;
      try {
        scheduleCell(time, stepRef.current);
        animateCell(
          time,
          cellsRef.current[`cell-${stepRef.current}`].cellRef.current
        );
        animateSound(time, stepRef.current);
      } catch (e) {
        console.log('schedulePattern ERROR ->\n', e);
      }
      stepRef.current = (stepRef.current + 1) % patternRef.current.length;
    }, '16n');
  };

  const animateCell = (time, cell) => {
    Tone.Draw.schedule(() => {
      if (cell.classList.contains('on')) {
        cell.classList.add('pulse');
        setTimeout(() => cell.classList.remove('pulse'), 0);
      } else {
        cell.classList.add('flash');
        setTimeout(() => cell.classList.remove('flash'), 0);
      }
    }, time);
  };

  const animateSound = (time, step) => {
    const soundBtns = document.querySelectorAll('.sound-btn');
    Tone.Draw.schedule(() => {
      patternRef.current[step].forEach((sound, i) => {
        if (sound.noteOn) {
          soundBtns[i].classList.add('pulse');
          setTimeout(() => soundBtns[i].classList.remove('pulse'), 0);
        }
      });
    }, time);
  };

  const scheduleCell = (time, step) => {
    for (const [sound, { noteOn, notes }] of Object.entries(
      patternRef.current[step]
    )) {
      if (noteOn) {
        // console.time('schedule note');
        let slice = notes.length;
        kitRef.current.sounds[sound].sampler.triggerAttackRelease(
          MIDI_NOTES[notes[0].pitch],
          notes[0].length,
          time,
          notes[0].velocity
        );
        if (slice === 2) {
          kitRef.current.sounds[sound].sampler.triggerAttackRelease(
            MIDI_NOTES[notes[1].pitch],
            notes[1].length,
            time + Tone.Time('32n'),
            notes[1].velocity
          );
        } else if (slice === 3) {
          kitRef.current.sounds[sound].sampler.triggerAttackRelease(
            MIDI_NOTES[notes[1].pitch],
            notes[1].length,
            time + Tone.Time('32t'),
            notes[1].velocity
          );
          kitRef.current.sounds[sound].sampler.triggerAttackRelease(
            MIDI_NOTES[notes[2].pitch],
            notes[2].length,
            time + Tone.Time('32t') + Tone.Time('32t'),
            notes[2].velocity
          );
        }
        // console.timeEnd('schedule note');
      }
    }
  };

  return (
    <Transport.Provider value={{ start, stop, pauseFlashing, startFlashing }}>
      {children}
    </Transport.Provider>
  );
};

export const stopAndCancelEvents = () => {
  Tone.Transport.stop();
  Tone.Transport.position = 0;
  Tone.Transport.cancel(0);
  const scheduledEvents = Tone.Transport._scheduledEvents;
  Object.keys(scheduledEvents).forEach((id) => Tone.Transport.clear(id));
};

const initialClick = async () => {
  await Tone.start();
  console.log('audio ready');
  document.removeEventListener('click', initialClick);
};
document.addEventListener('click', initialClick);

Tone.getDestination().volume.value = -12;
