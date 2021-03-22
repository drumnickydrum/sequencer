import React, { useState, useEffect, useRef, useContext } from 'react';
import * as Tone from 'tone';
import { loadKit } from '../features/sequencer/kitSlice';
import { PatternRef } from './PatternRef';
import { MIDI_NOTES } from '../utils/MIDI_NOTES';
import { Kit } from './Kit';
import { useDispatch, useSelector } from 'react-redux';

export const Transport = React.createContext();
export const TransportProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { patternRef, cellsRef } = useContext(PatternRef);
  const { kitRef, buffersLoaded, soundsRef, loadSamples } = useContext(Kit);
  const stepRef = useRef(0);

  const bpm = useSelector((state) => state.sequencer.present.bpm);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const [transportState, setTransportState] = useState(Tone.Transport.state);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const start = () => {
    removeCursor();
    if (transportState !== 'started') {
      pauseFlashing();
      if (transportState === 'stopped') schedulePattern();
      setTransportState('started');
      Tone.Transport.start();
    } else {
      pause();
    }
  };

  const stop = () => {
    setTransportState('stopped');
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.cancel(0);
    const scheduledEvents = Tone.Transport._scheduledEvents;
    Object.keys(scheduledEvents).forEach((id) => Tone.Transport.clear(id));
    removeCursor();
    startFlashing();
    stepRef.current = 0;
  };

  const pause = () => {
    setTransportState('paused');
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

  const removeCursor = () => {
    const len = patternRef.current.length;
    const step = stepRef.current;
    const prevStep = step - 1 > 0 ? step - 1 : len - 1;
    const nextStep = (step + 1) % len;
    cellsRef.current[`cell-${step}`].cellRef.current.dataset.cursor = false;
    cellsRef.current[`cell-${prevStep}`].cellRef.current.dataset.cursor = false;
    cellsRef.current[`cell-${nextStep}`].cellRef.current.dataset.cursor = false;
  };

  const [restart, setRestart] = useState(false);
  useEffect(() => {
    if (restart) {
      if (buffersLoaded) {
        setRestart(false);
        start();
      } else {
        console.log('load samples from transport');
        loadSamples(kitRef.current.name);
      }
    }
  }, [buffersLoaded, kitRef, loadSamples, restart, start]);

  const prepRestart = (e) => {
    e.stopImmediatePropagation();
    console.log('prepping restart');
    stop();
    setRestart(true);
  };
  document.addEventListener('prepRestart', prepRestart);

  const schedulePattern = () => {
    Tone.Transport.scheduleRepeat((time) => {
      if (!buffersLoaded) return;
      scheduleCell(time, stepRef.current);
      animateCell(
        time,
        cellsRef.current[`cell-${stepRef.current}`].cellRef.current
      );
      animateSound(time, stepRef.current);
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
    Tone.Draw.schedule(() => {
      patternRef.current[step].forEach((sound, i) => {
        if (sound.noteOn) {
          if (soundsRef.current[i].current) {
            soundsRef.current[i].current.classList.add('pulse');
            setTimeout(
              () => soundsRef.current[i].current.classList.remove('pulse'),
              0
            );
          }
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
        let [pitch, velocity, length] = getModdedValues(
          kitRef.current.sounds[sound],
          notes[0]
        );
        kitRef.current.sounds[sound].sampler.triggerAttackRelease(
          pitch,
          length,
          time,
          velocity
        );
        if (slice === 2) {
          let [pitch2, velocity2, length2] = getModdedValues(
            kitRef.current.sounds[sound],
            notes[1]
          );
          kitRef.current.sounds[sound].sampler.triggerAttackRelease(
            pitch2,
            length2,
            time + Tone.Time('32n'),
            velocity2
          );
        } else if (slice === 3) {
          let [pitch2, velocity2, length2] = getModdedValues(
            kitRef.current.sounds[sound],
            notes[1]
          );
          let [pitch3, velocity3, length3] = getModdedValues(
            kitRef.current.sounds[sound],
            notes[2]
          );
          kitRef.current.sounds[sound].sampler.triggerAttackRelease(
            pitch2,
            length2,
            time + Tone.Time('32t'),
            velocity2
          );
          kitRef.current.sounds[sound].sampler.triggerAttackRelease(
            pitch3,
            length3,
            time + Tone.Time('32t') + Tone.Time('32t'),
            velocity3
          );
        }
        // console.timeEnd('schedule note');
      }
    }
  };

  return (
    <Transport.Provider
      value={{
        transportState,
        start,
        stop,
        restart,
        setRestart,
      }}
    >
      {children}
    </Transport.Provider>
  );
};

const getModdedValues = (sound, { pitch, velocity, length }) => {
  pitch += sound.pitchMod;
  pitch = MIDI_NOTES[pitch];
  velocity *= sound.velocityMod;
  length *= sound.lengthMod * sound.duration;
  return [pitch, velocity, length];
};

const initialClick = async () => {
  await Tone.start();
  console.log('audio ready');
  document.removeEventListener('click', initialClick);
};
document.addEventListener('click', initialClick);

Tone.getDestination().volume.value = -12;
