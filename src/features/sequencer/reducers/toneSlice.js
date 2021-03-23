import { createSlice } from '@reduxjs/toolkit';
import * as Tone from 'tone';
import { stopAndCancelEvents } from '../providers/Transport';

const INITIAL_STATE = {
  buffersLoaded: false,
  transportState: Tone.Transport.state,
  restart: false,
};

export const toneSlice = createSlice({
  name: 'tone',
  initialState: INITIAL_STATE,
  reducers: {
    setBuffersLoaded: (state, { payload }) => {
      state.buffersLoaded = payload;
    },
    setTransportState: (state, { payload }) => {
      state.transportState = payload;
    },
    setRestart: (state, { payload }) => {
      state.restart = payload;
    },
    prepRestart: (state) => {
      stopAndCancelEvents();
      state.transportState = 'paused';
      state.buffersLoaded = false;
      state.restart = true;
      console.log('done prepping');
    },
  },
});

export const {
  setBuffersLoaded,
  setTransportState,
  setRestart,
  prepRestart,
} = toneSlice.actions;

export default toneSlice.reducer;
