import { createSlice } from '@reduxjs/toolkit';
import { analog } from '../../defaults/defaultPatterns';

const INITIAL_STATE = { ...analog };
INITIAL_STATE.eraseOneDisabled = false;
INITIAL_STATE.eraseAllDisabled = false;

const initSoundStep = (sound) => {
  sound.noteOn = false;
  sound.notes.length = 0;
  sound.notes.push({ pitch: 24, velocity: 1, length: 1 });
};

export const sequencerSlice = createSlice({
  name: 'sequencer',
  initialState: analog,
  reducers: {
    toggleCell: (state, { payload: { step, selectedSound } }) => {
      state.pattern[step][selectedSound].noteOn = !state.pattern[step][
        selectedSound
      ].noteOn;
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
    },
    eraseSound: (state, { payload: { selectedSound } }) => {
      state.pattern.forEach((step) => {
        initSoundStep(step[selectedSound]);
      });
    },
    eraseAll: (state) => {
      state.pattern.forEach((step) => {
        step.forEach((sound) => {
          initSoundStep(sound);
        });
      });
    },
    //   modify: (state, { payload: { selectedSound, step, mode, value } }) => {
    //     // state.pattern[step][selectedSound].notes.forEach(note=>{
    //     //   note
    //     // })
    //   },
    //   modifyAll: (state, { payload: { selectedSound, mode, value } }) => {
    //     state.pattern.forEach((step) => {
    //       let newVal = step[selectedSound].notes[0][mode]
    //       switch(mode) {
    //         case MODES.MOD_VELOCITY:
    //           note[mode] += value;
    //           break;
    //         case MODES.MOD_LENGTH:
    //           note[mode] *= value *
    //       step[selectedSound].notes.forEach((note) => {

    //       });
    //     });
    //   },
    //   resetMods: (state, { payload: { mode, selectedSound } }) => {
    //     state.pattern.forEach((step) => {
    //       step[selectedSound].notes.forEach((note) => {
    //         note[mode] = INITIAL_MODS[mode];
    //       });
    //     });
    //   },
  },
});

export const {
  toggleCell,
  sliceCell,
  paste,
  eraseSound,
  eraseAll,
} = sequencerSlice.actions;

export default sequencerSlice.reducer;
