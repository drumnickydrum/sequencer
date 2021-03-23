import { configureStore } from '@reduxjs/toolkit';
import sequencerReducer from './features/Sequencer/reducers/sequencerSlice';
import editModeReducer from './features/Sequencer/reducers/editModeSlice';
import toneReducer from './features/Sequencer/reducers/toneSlice';
import appReducer from './reducers/appSlice';

export default configureStore({
  reducer: {
    sequencer: sequencerReducer,
    editMode: editModeReducer,
    tone: toneReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware({ immutableCheck: false });
  },
});
