// reducers.js
import { combineReducers } from 'redux';
import { FETCH_PROGRESS_SUCCESS, FETCH_PROGRESS_FAILURE } from '../actions/courseProgressActions';


const courseProgressReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_PROGRESS_SUCCESS:
      return {
        ...state,
        [action.payload.courseId]: action.payload.progress
      };
    case FETCH_PROGRESS_FAILURE:
      return {};
    default:
      return state;
  }
};



export default courseProgressReducer;
