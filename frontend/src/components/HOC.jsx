// withAuthentication.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { config } from "../App";
import { useSnackbar } from "notistack";
import { useFormData } from "./FormContext";
import { useUserData } from "./UserContext";
import parseJwt from "./Decode";
import Cookies from "js-cookie";
import { useCookies } from 'react-cookie';

const withAuthentication = (WrappedComponent) => {

  const WithAuthenticationComponent = (props) => {
    const [cookies, setCookies] = useCookies(['jwtToken','username','type','logged','studentname']);
  
    const { enqueueSnackbar } = useSnackbar();
    const { token, setToken } = useUserData();
    const { formData, setFormData } = useFormData();
    const navigate = useNavigate();

    const handleLogin = async () => {
      try {
        const types = cookies['type'];
        const res = await axios.post(
          config.endpoint + `/${types}/login${types}`,
          { username: formData.username, password: formData.password }
        );
        console.log("Types",types)
        if (res.status === 201) {
          console.log(res);
          const { data } = res.data; // Assuming the token is in the 'data' field of the response
          setToken(data);       
          setCookies('jwtToken',data, { path: '/' });
          setCookies('username',formData.username)
          enqueueSnackbar("Logged in Successfully", { variant: "success" });

          const redirectPath = {
            student: "/student",
            instructor: "/instructor",
            admin: "/admin",
          };
          setCookies("logged","true");
          setCookies("studentname","harry potter");
          navigate(redirectPath[types], { state: { isLogged: "true" } });
         
          // setTimeout(window.location.reload(),1000)
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
        const type = cookies['type']
        const response = await axios.post(
          `${config.endpoint}/${type}/add${type}`,
          {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            address: formData.address,
            icon: formData.icon,
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
