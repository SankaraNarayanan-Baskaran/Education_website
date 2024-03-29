import React from "react";

const parseJwt = (token) => {
  if(!token){
    return null;
  }
  if (typeof token !== "string") {
    if (typeof token.toString === "function") {
      token = token.toString();
    } else {
      console.error("Invalid token format:", token);
      return null;
    }
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
};

export default parseJwt;
