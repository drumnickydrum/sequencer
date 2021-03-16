import React, { useState, useEffect, useRef, useContext } from 'react';
import * as Tone from 'tone';
import { init, analog } from '../defaults/defaultPatterns';
import { Pattern } from './Pattern';
import { MIDI_NOTES } from '../utils/MIDI_NOTES';
import { Kit } from './Kit';

export const Sequencer = React.createContext();
export const SetSequencer = React.createContext();
export const SequencerProvider = ({ children }) => {
  const { patternRef } = useContext(Pattern);
  const { kitRef, buffersLoaded } = useContext(Kit);
  const [bpm, setBpm] = useState(analog.bpm);
  const stepRef = useRef(0);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const start = () => {
    if (Tone.Transport.state === 'started') return;
    const flashingCells = document.querySelectorAll('.flashing');
    flashingCells.forEach((cell) => cell.classList.add('pause'));
    schedulePattern();
    Tone.Transport.start();
  };

  const stop = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    stepRef.current = 0;
    const flashingCells = document.querySelectorAll('.flashing');
    flashingCells.forEach((cell) => cell.classList.remove('pause'));
  };

  const [restart, setRestart] = useState(false);
  useEffect(() => {
    if (buffersLoaded && restart) {
      setRestart(false);
      start();
    }
  }, [buffersLoaded, restart, start]);

  const schedulePattern = () => {
    Tone.Transport.cancel(0);
    console.log(Tone.Transport._repeatedEvents);
    const cells = document.querySelectorAll(`.cell`);
    Tone.Transport.scheduleRepeat((time) => {
      // console.log(`time: ${time}, stepRef.current: ${stepRef.current}`);
      animateCell(time, cells[stepRef.current]);
      scheduleCell(time);
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

  const scheduleCell = (time) => {
    for (const [sound, { noteOn, notes }] of Object.entries(
      patternRef.current[stepRef.current]
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
    stepRef.current =
      stepRef.current === patternRef.current.length - 1
        ? 0
        : stepRef.current + 1;
  };

  return (
    <SetSequencer.Provider value={{ setBpm, start, stop, setRestart }}>
      <Sequencer.Provider value={{ bpm }}>{children}</Sequencer.Provider>
    </SetSequencer.Provider>
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
