// authActions.js

import axios from 'axios';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post('/api/login', credentials);
    if (response.status === 200) {
      dispatch(loginSuccess(response.data));
    } else {
      dispatch(loginFailure('Login failed'));
    }
  } catch (error) {
    dispatch(loginFailure('Login failed'));
  }
};

export const logout = () => async (dispatch) => {
  try {
    const response = await axios.post('/api/logout');
    if (response.status === 200) {
      dispatch(logoutSuccess());
    } else {
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Logout failed');
  }
};
