// PrivateRoute.js
import React from 'react';
import { Route, Navigate, useNavigate } from 'react-router-dom';
import { useUserData } from './UserContext';
import parseJwt from './Decode';

const PrivateRoute = ({ element, role, ...props }) => {
  const { token } = useUserData();
  const navigate=useNavigate();
 const decodedToken=parseJwt(token);
  if (!token) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" />;
  }

  // Assuming you have a user role field in the token payload
  const userRole = decodedToken.type;
  if (!userRole.includes(role)) {
    // Redirect to unauthorized page if the user's role doesn't match any role in the array
    return <Navigate to="/unauthorized" />;
  }
 

  return <Route element={element} {...props} />;
};

export default PrivateRoute;
