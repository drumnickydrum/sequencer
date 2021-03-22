import { configureStore } from '@reduxjs/toolkit';
import sequencerReducer from './features/Sequencer/reducers/sequencerSlice';
import editModeReducer from './features/Sequencer/reducers/editModeSlice';

export default configureStore({
  reducer: {
    sequencer: sequencerReducer,
    editMode: editModeReducer,
  },
  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware({ immutableCheck: false });
  },
});
