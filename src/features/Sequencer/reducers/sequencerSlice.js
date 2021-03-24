import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';
import undoable, { groupByActionTypes } from 'redux-undo';
import { analog } from '../defaults/defaultPatterns';
import { getLS } from '../../../utils/storage';
import { getNoteTally, inc, dec, initSoundStep } from '../utils';
import { setUser } from '../../../reducers/appSlice';
import { INITIAL_MODS, MODES, setSpAlert } from './editModeSlice';

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
    paintCell: (state, { payload: { step, selectedSound, noteOn } }) => {
      // const noteOn = !state.pattern[step][selectedSound].noteOn;
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
      state.noteTally.total.count +=
        state.noteTally[selectedSound].count - state.noteTally[sound].count;
      state.noteTally[sound] = { ...state.noteTally[selectedSound] };
    },
    eraseCell: (state, { payload: { step, selectedSound } }) => {
      initSoundStep(state.pattern[step][selectedSound]);
      dec(state.noteTally, selectedSound);
    },
    eraseSound: (state, { payload: { selectedSound } }) => {
      state.pattern.forEach((step) => {
        initSoundStep(step[selectedSound]);
      });
      state.noteTally.total.count -= state.noteTally[selectedSound].count;
      state.noteTally[selectedSound].count = 0;
      state.noteTally[selectedSound].empty = true;
    },
    eraseAll: (state) => {
      state.pattern.forEach((step) => {
        step.forEach((sound) => {
          initSoundStep(sound);
        });
      });
      Object.keys(state.noteTally).forEach((tally) => {
        state.noteTally[tally].count = 0;
      });
      state.noteTally.total.count = 0;
      state.noteTally.total.empty = true;
    },
    modCell: (state, { payload: { selectedSound, type, value, step } }) => {
      if (type === MODES.MOD_LENGTH && value < 1) value *= 0.25;
      state.pattern[step][selectedSound].notes.forEach((note) => {
        note[type] = value;
      });
    },
    modAll: (state, { payload: { selectedSound, type, value } }) => {
      if (type === MODES.MOD_LENGTH && value < 1) value *= 0.25;
      state.pattern.forEach((step) => {
        if (step[selectedSound].noteOn) {
          step[selectedSound].notes.forEach((note) => {
            note[type] = value;
          });
        }
      });
    },
    resetMods: (state, { payload: { selectedSound, type } }) => {
      state.pattern.forEach((step) => {
        step[selectedSound].notes.forEach((note) => {
          note[type] = INITIAL_MODS[type];
        });
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
    changeKit: (state, { payload }) => {
      state.kit = payload;
    },
    changeBpm: (state, { payload }) => {
      state.bpm = payload;
    },
  },
});

export const modCell = (step, noteOn) => (dispatch, getState) => {
  const selectedSound = getState().editMode.selectedSound;
  if (selectedSound === -1) {
    dispatch(setSpAlert('select a sound to edit'));
    return;
  }
  const mode = getState().editMode.mode;
  switch (mode) {
    case MODES.PAINTING:
      const toggleOn = getState().editMode.toggleOn;
      console.log(toggleOn);
      if ((toggleOn && !noteOn) || (!toggleOn && noteOn))
        dispatch(
          sequencerSlice.actions.paintCell({
            step,
            selectedSound,
            noteOn: toggleOn,
          })
        );
      break;
    case MODES.ERASING:
      if (noteOn)
        dispatch(sequencerSlice.actions.eraseCell({ step, selectedSound }));
      break;
    case MODES.SLICING:
      if (noteOn)
        dispatch(sequencerSlice.actions.sliceCell({ step, selectedSound }));
      break;
    case MODES.MOD_LENGTH:
    case MODES.MOD_PITCH:
    case MODES.MOD_VELOCITY:
      if (noteOn) {
        const value = getState().editMode.mods[mode];
        dispatch(
          sequencerSlice.actions.modCell({
            step,
            selectedSound,
            type: mode,
            value,
          })
        );
      }
      break;
    default:
      return null;
  }
};

export const saveSequence = async (sequence) => async (dispatch) => {
  const res = await axios({
    url: 'http://localhost:4000/user/pattern/add',
    method: 'POST',
    data: sequence,
    withCredentials: true,
  });
  dispatch(setUser(res.data));
};

export const deleteSequence = async (sequence) => async (dispatch) => {
  const res = await axios({
    url: 'http://localhost:4000/user/pattern/delete',
    method: 'POST',
    data: { _id: sequence },
    withCredentials: true,
  });
  dispatch(setUser(res.data));
};

export const {
  paintCell,
  sliceCell,
  paste,
  eraseCell,
  eraseSound,
  eraseAll,
  modAll,
  resetMods,
  loadSequence,
  loadSequenceFinally,
  changeKit,
  changeBpm,
} = sequencerSlice.actions;

const reducer = undoable(sequencerSlice.reducer, {
  groupBy: groupByActionTypes([
    'sequencer/paintCell',
    'sequencer/eraseCell',
    'sequencer/sliceCell',
    'sequencer/modCell',
  ]),
});

export default reducer;
