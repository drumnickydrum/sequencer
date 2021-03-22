import { configureStore } from '@reduxjs/toolkit';
import sequencerReducer from './features/sequencer/reducers/sequencerSlice';
import editModeReducer from './features/sequencer/reducers/editModeSlice';

export default configureStore({
  reducer: {
    sequencer: sequencerReducer,
    editMode: editModeReducer,
  },
  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware({ immutableCheck: false });
  },
});
