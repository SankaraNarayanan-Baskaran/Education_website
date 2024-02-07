import React, { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";
import parseJwt from "./Decode";
const UsernameContext = createContext();
export const UsernameDataProvider = ({ children }) => {
  const [cookies] = useCookies(["jwtToken"]);
  const [token, setToken] = useState(cookies['jwtToken'] || "");
  if(token === ''){

  }
  else{
    const decodedToken = parseJwt(token);
    const role = decodedToken.type;
    console.log("Role", role);
  }

  return (
    <UsernameContext.Provider value={{ token, setToken }}>
      {children}
    </UsernameContext.Provider>
  );
};

export const useUserData = () => {
  return useContext(UsernameContext);
};
