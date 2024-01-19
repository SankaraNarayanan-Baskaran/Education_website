// PrivateWrapper.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useUserData } from "./UserContext";
import parseJwt from "./Decode";

const PrivateWrapper = ({ roles, children }) => {
  const { token } = useUserData();

  if (!token) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/login" />;
  }

  // Assuming you have a user role field in the token payload
  const decodedToken = parseJwt(token);
  const userRole = decodedToken.type;
  console.log(roles, userRole);
  if (roles && !userRole.includes(roles)) {
    // Redirect to unauthorized page if the user's role doesn't match any allowed roles
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default PrivateWrapper;
