// withAuthentication.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { config } from "../App";
import { useSnackbar } from "notistack";
import { useFormData } from "./FormContext";
const withAuthentication = (WrappedComponent) => {
  const WithAuthenticationComponent = (props) => {
    const {enqueueSnackbar}=useSnackbar()
    const {formData,setFormData}=useFormData()
    const navigate = useNavigate();

    const handleLogin = async () => {
      try {
        const types = localStorage.getItem("type");
        const res = await axios.post(
          config.endpoint + `/${types}/login${types}`,
          formData
        );
        if (res.status === 201) {
          localStorage.setItem("username", formData.username);
          enqueueSnackbar("Logged in Successfully", { variant: "success" });

          const redirectPath = {
            student: "/",
            inst: "/instructor",
            admin: "/admin",
          };

          navigate(redirectPath[types], { state: { isLogged: "true" } });
        }
      } catch (error) {
        enqueueSnackbar("Invalid Credentials", { variant: "error" });
        console.log(error);
      }
    };

    const validateInput = (data) => {
      if (data.username === "" || data.password === "") {
        enqueueSnackbar("Username and Password are required fields", {
          variant: "error",
        });
        return false;
      }
      return true;
    };

    const handleRegister = async (formData) => {
        try {
          const type = localStorage.getItem("type");
          const response = await axios.post(
            `${config.endpoint}/${type}/add${type}`,
            {
              username: formData.username,
              password: formData.password,
              email: formData.email,
              address: formData.address,
              icon:formData.icon
            }
          );
          if (response.status === 201) {
            navigate("/login");
          } else if (response.status === 302) {
            console.log("User already exists");
          }
        } catch (error) {
          console.log(error);
        }
      };
     

    return (
      <WrappedComponent
        {...props}
        formData={formData}
        setFormData={setFormData}
       
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        validateInput={validateInput}
      />
    );
  };

  return WithAuthenticationComponent;
};

export default withAuthentication;
