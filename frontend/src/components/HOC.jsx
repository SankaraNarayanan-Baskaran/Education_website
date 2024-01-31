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
    const [cookies, setCookies] = useCookies(['jwtToken','username']);
  
    const { enqueueSnackbar } = useSnackbar();
    const { token, setToken } = useUserData();
    const { formData, setFormData } = useFormData();
    const navigate = useNavigate();

    const handleLogin = async () => {
      try {
        const types = localStorage.getItem("type");
        const res = await axios.post(
          config.endpoint + `/${types}/login${types}`,
          formData
        );
        if (res.status === 201) {
          console.log(res);
          const { data } = res.data; // Assuming the token is in the 'data' field of the response
          setToken(data);
          // cookies.set("token", data);
          // //  console.log('Token:', token);
         
          setCookies('jwtToken',data, { path: '/' });
          // Cookies.set("username",formData.username)
          // const decodedToken = parseJwt(data);
          // console.log(decodedToken);
        setCookies('username',formData.username)
          localStorage.setItem("username", formData.username);
          // cookies.set("email", decodedToken.email);
       
          // setCookie('jwtToken', data);
          // localStorage.setItem("email", formData.email);
          enqueueSnackbar("Logged in Successfully", { variant: "success" });

          const redirectPath = {
            student: "/student",
            inst: "/instructor",
            admin: "/admin",
          };

          navigate(redirectPath[types], { state: { isLogged: "true" } });
          localStorage.setItem("logged","true");
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
        const type = localStorage.getItem("type");
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
