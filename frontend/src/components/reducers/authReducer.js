// authReducer.js

const initialState = {
  type: 'Student', // Initial type
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TYPE':
      console.log(action.type)
      return {
        ...state,
        type: action.payload
      };
    default:
      return state;
  }
};

export default authReducer;
