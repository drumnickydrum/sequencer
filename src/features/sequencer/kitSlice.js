import * as Tone from 'tone';
import { createSlice } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import * as defaultKits from '../../defaults/defaultKits';
import { getLS } from '../../utils/storage';

const loadedKit = getLS('kit') || 'analog';
const INITIAL_SOUNDS = defaultKits[loadedKit].sounds.map((sound) => ({
  ...sound,
}));
const INITIAL_STATE = {
  name: defaultKits[loadedKit].name,
  sounds: INITIAL_SOUNDS,
};

export const kitSlice = createSlice({
  name: 'kit',
  initialState: INITIAL_STATE,
  reducers: {
    loadKit: (state, { payload: { kit } }) => {
      const newSounds = defaultKits[kit].sounds.map((sound) => ({
        ...sound,
      }));
      state.name = kit;
      state.sounds = newSounds;
    },
  },
});

export const { loadKit } = kitSlice.actions;

const undoableReducer = undoable(kitSlice.reducer);
export default undoableReducer;
