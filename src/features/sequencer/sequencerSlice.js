import { createSlice } from '@reduxjs/toolkit';
import undoable from 'redux-undo';
import { analog } from '../../defaults/defaultPatterns';

const deepCopyStep = (step) => {
  return step.map((sound) => {
    let newNotes = sound.notes.map((note) => {
      return { ...note };
    });
    return { noteOn: sound.noteOn, notes: newNotes };
  });
};

const deepCopyPattern = (pattern) => {
  return pattern.map((step) => {
    return deepCopyStep(step);
  });
};

const getNoteTally = (pattern) => {
  let noteTally = { total: 0 };
  pattern[0].forEach((_, i) => {
    noteTally[i] = 0;
  });
  pattern.forEach((step) => {
    step.forEach((sound, i) => {
      if (sound.noteOn) {
        noteTally[i]++;
        noteTally.total++;
      }
    });
  });
  return noteTally;
};

const INITIAL_STATE = { ...analog, noteTally: getNoteTally(analog.pattern) };

const initSoundStep = (sound) => {
  sound.noteOn = false;
  sound.notes.length = 0;
  sound.notes.push({ pitch: 24, velocity: 1, length: 1 });
};

export const sequencerSlice = createSlice({
  name: 'sequencer',
  initialState: INITIAL_STATE,
  reducers: {
    toggleCell: (state, { payload: { step, selectedSound } }) => {
      const noteOn = !state.pattern[step][selectedSound].noteOn;
      state.pattern[step][selectedSound].noteOn = noteOn;
      if (noteOn) {
        state.noteTally[selectedSound]++;
        state.noteTally.total++;
      } else {
        state.noteTally[selectedSound]--;
        state.noteTally.total--;
      }
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
      state.noteTally[selectedSound]--;
      state.noteTally.total--;
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
  eraseCell,
  eraseSound,
  eraseAll,
} = sequencerSlice.actions;

const undoableReducer = undoable(sequencerSlice.reducer);
export default undoableReducer;
