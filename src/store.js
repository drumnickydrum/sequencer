import { configureStore } from '@reduxjs/toolkit';
import sequencerReducer from './features/sequencer/sequencerSlice';
import editModeReducer from './features/sequencer/editModeSlice';

export default configureStore({
  reducer: {
    sequencer: sequencerReducer,
    editMode: editModeReducer,
  },
  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware({ immutableCheck: false });
  },
});
