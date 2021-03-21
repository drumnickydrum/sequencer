import { configureStore } from '@reduxjs/toolkit';
import sequencerReducer from './features/sequencer/sequencerSlice';
import editorReducer from './features/sequencer/editorSlice';

export default configureStore({
  reducer: {
    sequencer: sequencerReducer,
    editor: editorReducer,
  },
  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware({ immutableCheck: false });
  },
});
