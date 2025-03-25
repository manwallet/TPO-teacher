import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Reducers
import authReducer from './reducers/authReducer';
import settingsReducer from './reducers/settingsReducer';
import examReducer from './reducers/examReducer';
import vocabularyReducer from './reducers/vocabularyReducer';
import progressReducer from './reducers/progressReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  exam: examReducer,
  vocabulary: vocabularyReducer,
  progress: progressReducer
});

// Create store with middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
