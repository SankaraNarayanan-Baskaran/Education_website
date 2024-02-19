import React, { useEffect, useState } from "react";
import RegisterFormFields from "../components/RegisterFormFields";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../App";

import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
import { useSnackbar } from "notistack";

import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Register.css";
import withAuthentication from "../components/HOC";
import { useFormData } from "../components/FormContext";
import { useCookies } from "react-cookie";
import { useUserData } from "../components/UserContext";
const Register = ({ handleRegister }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formData, setFormData } = useFormData();
  const [instructor, setInstructor] = useState(false);
  const [institution, setInstitution] = useState(false);
  const [type, setType] = useState("Student");
  const [cookies, setCookies] = useCookies(["type","username"]);
  const { token, setToken } = useUserData();
  const handleTypeChange = (newType) => {
    setType(newType);
    setCookies("type", newType.toLowerCase());
    if (newType === "Instructor") {
      setInstructor(true);
      setInstitution(false);
    } else if (newType === "Institution") {
      setInstitution(true);
      setInstructor(false);
    } else {
      setInstructor(false);
      setInstitution(false);
    }
  };

  useEffect(() => {
    console.log("Component is mounted");

    return () => {
      console.log("Component will unmount");
    };
  }, []);

  const validateInput = (data) => {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    if (data.username === "") {
      enqueueSnackbar("Username cannot be empty", { variant: "error" });
      return false;
    }
    if (!alphanumericRegex.test(data.username)) {
      enqueueSnackbar("Username cannot contain special characters", {
        variant: "warning",
      });
      return false;
    }

    if (data.password === "") {
      enqueueSnackbar("Password cannot be empty", { variant: "error" });
      return false;
    }

    return true;
  };

  function generateRandomPassword(length) {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_";

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  const handleGoogleLogin = async (userData) => {
    try {
      const res = await axios.post(config.endpoint + "/student/google", {
        username: userData.username,
        password: userData.password,
        email: userData.email,
      });
      if (res.status === 201) {
        const { data } = res.data;
        // const decodedToken = parseJwt(data);
        // console.log(decodedToken);
        setCookies("username",userData.username);
         setToken(data);       
         setCookies("logged","true")
        setCookies('jwtToken',data, { path: '/' });
        navigate("/student", { state: { isLogged: "true" } });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header isAuthorised />
      <center>
        <div className="login-container">
          <h3>{type} Registration</h3>
          <RegisterFormFields
            formData={formData}
            setFormData={setFormData}
            handleRegister={handleRegister}
            institution={institution}
            instructor={instructor}
            setType={setType}
            type={type}
          />

          <button
            className="login-button"
            onClick={() => {
              if (validateInput(formData)) {
                handleRegister(formData);
                enqueueSnackbar("Registered successfully", {
                  variant: "success",
                });
              }
            }}
          >
            Register
          </button>
          <div className="py-3">
            <button
              className="login-button"
              onClick={() => navigate("/login")}
            >
              Already have an account?
            </button>
            <div>
              <LoginSocialGoogle
                client_id="450692513840-1ujucbe7nonf99hu09ss6b9b4ptajjs6.apps.googleusercontent.com"
                scope="openid profile email"
                discoveryDocs="claims_supported"
                access_type="offline"
                onResolve={({ provider, data }) => {
                  const name = data.name;
                  const email = data.email;
                  const password = generateRandomPassword(10);
                  const userData = {
                    username: name,
                    password: password,
                    email: email,
                  };
                  handleGoogleLogin(userData);
                }}
                onReject={(err) => {
                  console.log(err);
                }}
              >
                <GoogleLoginButton />
              </LoginSocialGoogle>

              <>
                {type !== "Instructor" && (
                  <button
                    className="login-button"
                    onClick={() => handleTypeChange("Instructor")}
                  >
                    Instructor?
                  </button>
                )}
                {type !== "Institution" && (
                  <button
                    className="login-button mx-3"
                    onClick={() => handleTypeChange("Institution")}
                  >
                    Register As an Institution
                  </button>
                )}
              </>
            </div>
          </div>
        </div>
      </center>
      <Footer />
    </div>
  );
};

export default withAuthentication(Register);

