import { createSlice } from '@reduxjs/toolkit';
import { analog } from '../../defaults/defaultPatterns';

// const INIT_CELL = () => ({
//   on: false,
//   color: -1,
//   velocity: 1,
//   pitch: 24,
//   length: 1,
//   slice: 1,
// });

// export const INIT_GRID = () => {
//   let grid = [];
//   for (let i = 0; i < 64; i++) {
//     grid.push(INIT_CELL());
//   }
//   return grid;
// };

export const initSoundStep = (sound) => {
  sound.noteOn = false;
  sound.notes.length = 0;
  sound.notes.push({ pitch: 24, velocity: 1, length: 1 });
};

export const sequencerSlice = createSlice({
  name: 'sequencer',
  initialState: analog,
  reducers: {
    toggleCell: (state, { step, selectedSound }) => {
      state.pattern[step][selectedSound].noteOn = !state.pattern[step][
        selectedSound
      ].noteOn;
    },
    slice: (state, { step, selectedSound }) => {
      let notes = state.pattern[step][selectedSound].notes;
      const len = notes.length;
      const note = notes[0];
      if (len === 3) notes.length = 0;
      notes.push(note);
    },
    paste: (state, { sound, selectedSound }) => {
      state.pattern.forEach((step, i) => {
        step[sound].noteOn = step[selectedSound].noteOn;
        step[sound].notes = step[selectedSound].notes.map((note) => ({
          ...note,
        }));
      });
    },
    clearSound: (state, { selectedSound }) => {
      state.pattern.forEach((step, i) => {
        initSoundStep(step[selectedSound]);
      });
    },
    clearAll: (state) => {
      state.pattern.forEach((step) => {
        step.forEach((sound) => {
          initSoundStep(sound);
        });
      });
    },
  },
});

export const {
  toggleCell,
  slice,
  paste,
  clearSound,
  clearAll,
} = sequencerSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount) => (dispatch) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectCount = (state) => state.counter.value;

export default sequencerSlice.reducer;
