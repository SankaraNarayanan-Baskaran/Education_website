import React, { createContext, useContext, useState } from "react";
const UsernameContext = createContext();
export const UsernameDataProvider = () => {
  const username = localStorage.getItem("username");
  return <UsernameContext.Provider value={username}></UsernameContext.Provider>;
};


export const useUserData = () => {
    return useContext(UsernameContext);
  };
