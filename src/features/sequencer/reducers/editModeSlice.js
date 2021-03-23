import { createSlice } from '@reduxjs/toolkit';

export const MODES = {
  PAINTING: 'PAINTING',
  ERASING: 'ERASING',
  SLICING: 'SLICING',
  COPYING: 'COPYING',
  MOD_VELOCITY: 'velocity',
  MOD_LENGTH: 'length',
  MOD_PITCH: 'pitch',
};

export const INITIAL_MODS = {
  MOD_VELOCITY: 1,
  MOD_LENGTH: 1,
  MOD_PITCH: 24,
};

const INITIAL_STATE = {
  selectedSound: -1,
  mode: null,
  spAlert: { count: 0, message: '' },
};

export const editModeSlice = createSlice({
  name: 'editMode',
  initialState: INITIAL_STATE,
  reducers: {
    close: (state) => {
      state.selectedSound = INITIAL_STATE.selectedSound;
      state.mode = INITIAL_STATE.mode;
    },
    edit: (state, { payload: { sound } }) => {
      state.selectedSound = sound;
      state.mode = MODES.PAINTING;
      state.spAlert = { ...INITIAL_STATE.spAlert };
    },
    setMode: (state, { payload: { mode } }) => {
      state.mode = mode;
    },
    setSpAlert: (state, { payload }) => {
      state.spAlert.count++;
      state.spAlert.message = `${state.spAlert.count}#${payload}`;
    },
  },
});

export const { close, edit, setMode, setSpAlert } = editModeSlice.actions;

export default editModeSlice.reducer;
