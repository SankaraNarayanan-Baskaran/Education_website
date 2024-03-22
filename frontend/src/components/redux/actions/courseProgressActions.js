export const FETCH_PROGRESS_SUCCESS = 'FETCH_PROGRESS_SUCCESS';
export const FETCH_PROGRESS_FAILURE = 'FETCH_PROGRESS_FAILURE';


export const fetchProgressSuccess = (courseId, progress) => ({
  type: FETCH_PROGRESS_SUCCESS,
  payload: { courseId, progress }
});

export const fetchProgressFailure = (error) => ({
  type: FETCH_PROGRESS_FAILURE,
  payload: error
});