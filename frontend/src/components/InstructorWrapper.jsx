import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserData } from './UserContext';
import parseJwt from './Decode';

const InstructorWrapper = ({ children }) => {
  const { token } = useUserData();

  // Redirect to login if the user is not authenticated
  if (!token) {
    return <Navigate to="/login" />;
  }

  const userRole = parseJwt(token).type;
console.log(userRole)
  // Redirect to unauthorized page if the user's role is not an instructor
  if (!userRole.includes("instructor")) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default InstructorWrapper;