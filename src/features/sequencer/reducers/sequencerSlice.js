import { createSlice } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { analog } from '../defaults/defaultPatterns';
import { getLS } from '../../../utils/storage';
import { getNoteTally, inc, dec, initSoundStep } from '../utils';

// const INITIAL_PATTERN = getLS('pattern') || analog.pattern;
const INITIAL_PATTERN = analog.pattern;

const INITIAL_STATE = {
  ...analog,
  pattern: INITIAL_PATTERN,
  noteTally: getNoteTally(analog.pattern),
};

export const sequencerSlice = createSlice({
  name: 'sequencer',
  initialState: INITIAL_STATE,
  reducers: {
    toggleCell: (state, { payload: { step, selectedSound } }) => {
      const noteOn = !state.pattern[step][selectedSound].noteOn;
      state.pattern[step][selectedSound].noteOn = noteOn;
      if (noteOn) inc(state.noteTally, selectedSound);
      else dec(state.noteTally, selectedSound);
    },
    sliceCell: (state, { payload: { step, selectedSound } }) => {
      let notes = state.pattern[step][selectedSound].notes;
      const len = notes.length;
      const note = notes[0];
      if (len === 3) notes.length = 0;
      notes.push(note);
    },
    paste: (state, { payload: { sound, selectedSound } }) => {
      state.pattern.forEach((step) => {
        step[sound].noteOn = step[selectedSound].noteOn;
        step[sound].notes = step[selectedSound].notes.map((note) => ({
          ...note,
        }));
      });
      state.noteTally.total +=
        state.noteTally[selectedSound] - state.noteTally[sound];
      state.noteTally[sound] = state.noteTally[selectedSound];
    },
    eraseCell: (state, { payload: { step, selectedSound } }) => {
      initSoundStep(state.pattern[step][selectedSound]);
      dec(state.noteTally, selectedSound);
    },
    eraseSound: (state, { payload: { selectedSound } }) => {
      state.pattern.forEach((step) => {
        initSoundStep(step[selectedSound]);
      });
      state.noteTally.total -= state.noteTally[selectedSound];
      state.noteTally[selectedSound] = 0;
    },
    eraseAll: (state) => {
      state.pattern.forEach((step) => {
        step.forEach((sound) => {
          initSoundStep(sound);
        });
      });
      Object.keys(state.noteTally).forEach((tally) => {
        state.noteTally[tally] = 0;
      });
    },
    loadSequence: (state, { payload: { sequence } }) => {
      state._id = sequence._id;
      state.name = sequence.name;
      state.kit = sequence.kit;
      state.bpm = sequence.bpm;
      state.length = sequence.length;
      state.pattern = sequence.pattern;
      state.noteTally = getNoteTally(state.pattern);
    },
    changeKit: (state, { payload: { kit } }) => {
      state.kit = kit;
    },
  },
});

export const {
  toggleCell,
  sliceCell,
  paste,
  eraseCell,
  eraseSound,
  eraseAll,
  loadSequence,
  loadSequenceFinally,
  changeKit,
} = sequencerSlice.actions;

const reducer = undoable(sequencerSlice.reducer);
export default reducer;
