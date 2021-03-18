import React, { useState, useEffect, useRef, useContext } from 'react';
import * as Tone from 'tone';
import { Pattern } from './Pattern';
import { MIDI_NOTES } from '../utils/MIDI_NOTES';
import { Kit } from './Kit';

export const Sequencer = React.createContext();
export const SequencerProvider = ({ children }) => {
  const { patternRef, cellsRef, patternBpm } = useContext(Pattern);
  const { kitRef, buffersLoaded, soundsRef } = useContext(Kit);
  const stepRef = useRef(0);

  useEffect(() => {
    Tone.Transport.bpm.value = patternBpm;
  }, [patternBpm]);

  const [transportState, setTransportState] = useState(Tone.Transport.state);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const start = () => {
    removeCursor();
    if (transportState !== 'started') {
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
    stepRef.current = 0;
    removeCursor();
  };

  const pause = () => {
    setTransportState('paused');
    Tone.Transport.pause();
    addCursor();
  };

  const addCursor = () => {
    cellsRef.current[`cell-${stepRef.current}`].cellRef.current.classList.add(
      'cursor-flashing'
    );
  };

  const removeCursor = () => {
    const len = patternRef.current.length;
    const step = stepRef.current;
    const prevStep = step - 1 > 0 ? step - 1 : len - 1;
    const nextStep = (step + 1) % len;
    cellsRef.current[`cell-${step}`].cellRef.current.classList.remove(
      'cursor-flashing'
    );
    cellsRef.current[`cell-${prevStep}`].cellRef.current.classList.remove(
      'cursor-flashing'
    );
    cellsRef.current[`cell-${nextStep}`].cellRef.current.classList.remove(
      'cursor-flashing'
    );
  };

  const [restart, setRestart] = useState(false);
  useEffect(() => {
    if (buffersLoaded && restart) {
      setRestart(false);
      start();
    }
  }, [buffersLoaded, restart, start]);

  const schedulePattern = () => {
    Tone.Transport.scheduleRepeat((time) => {
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
          soundsRef.current[i].current.classList.add('pulse');
          setTimeout(
            () => soundsRef.current[i].current.classList.remove('pulse'),
            0
          );
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
    <Sequencer.Provider value={{ transportState, start, stop, setRestart }}>
      {children}
    </Sequencer.Provider>
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
