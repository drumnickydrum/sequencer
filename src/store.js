import { configureStore } from '@reduxjs/toolkit';
import sequencerReducer from './features/sequencer/sequencerSlice';
import editModeReducer from './features/sequencer/editModeSlice';
import kitReducer from './features/sequencer/kitSlice';

export default configureStore({
  reducer: {
    sequencer: sequencerReducer,
    editMode: editModeReducer,
    kit: kitReducer,
  },
  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware({ immutableCheck: false });
  },
});
