// src/redux/reducers/index.js

import { combineReducers } from 'redux';
import courseReducer from './courseReducer';
import courseProgressReducer from './courseProgressReducer';
const rootReducer = combineReducers({
  courseReducer,
  courseProgressReducer
});

export default rootReducer;
