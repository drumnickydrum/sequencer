import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  show: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState: INITIAL_STATE,
  reducers: {
    setShow: (state, { payload }) => {
      state.show = payload;
    },
  },
});

export const { setShow } = appSlice.actions;

export default appSlice.reducer;
