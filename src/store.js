import { configureStore } from '@reduxjs/toolkit';
import sequencerReducer from './features/Sequencer/reducers/sequencerSlice';
import editModeReducer from './features/Sequencer/reducers/editModeSlice';
import toneReducer from './features/Sequencer/reducers/toneSlice';

export default configureStore({
  reducer: {
    sequencer: sequencerReducer,
    editMode: editModeReducer,
    tone: toneReducer,
  },
  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware({ immutableCheck: false });
  },
});
