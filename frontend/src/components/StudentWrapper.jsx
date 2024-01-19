// StudentWrapper.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserData } from './UserContext';
import parseJwt from './Decode';

const StudentWrapper = ({ children }) => {
  const { token } = useUserData();

  // Redirect to login if the user is not authenticated
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Assuming you have a user role field in the token payload
  const userRole = parseJwt(token).type;
console.log(userRole)
  // Redirect to unauthorized page if the user's role is not a student
  if (!userRole.includes("student")) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default StudentWrapper;
