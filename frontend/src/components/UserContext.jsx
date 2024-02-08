import React, { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import parseJwt from "./Decode";

const UsernameContext = createContext();

export const UsernameDataProvider = ({ children }) => {
  const [cookies, setCookies] = useCookies(["jwtToken", "role"]);
  const [token,setToken] = useState(cookies['jwtToken'] || "");
  const [role, setRole] = useState(cookies['role'] || '');

  useEffect(() => {
    if (token !== '') {
      const decodedToken = parseJwt(token);
      setRole(decodedToken.type);
      setCookies("role", decodedToken.type);
    }
  }, [token, setCookies]);

  return (
    <UsernameContext.Provider value={{ role, setRole,token,setToken }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUserData = () => {
  return useContext(UsernameContext);
};
