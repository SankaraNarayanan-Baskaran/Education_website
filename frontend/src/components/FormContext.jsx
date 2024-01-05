
import React, { createContext, useContext, useState } from "react";

const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    address: "",
    icon: "",
  });

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => {
  return useContext(FormDataContext);
};
