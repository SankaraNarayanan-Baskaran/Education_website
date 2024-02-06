import React, { createContext, useContext, useState } from "react";
import {Cookies} from "react-cookie"
const UsernameContext = createContext();
export const UsernameDataProvider = ({children}) => {
  const cookies=new Cookies();
 const [token,setToken]=useState(cookies.get("jwtToken")||'');
  return <UsernameContext.Provider value={{token,setToken}}>
    {children}
  </UsernameContext.Provider>;
};


export const useUserData = () => {
    return useContext(UsernameContext);
  };
