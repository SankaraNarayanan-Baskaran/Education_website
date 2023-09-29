import React, { useState } from "react";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../App";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
import { useSnackbar } from "notistack";
import Footer from "./Footer";
import "./Register.css";
const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    address: "",
  });
  const [isClicked, setIsClicked] = useState(false);
  const [isPasswordClicked, setIsPasswordClicked] = useState(false);
  const handleCriteria = () => {
    return formData.username.length < 6
      ? "Username should have atleast 6 characters"
      : "";
  };
  const handleClick = () => {
    setIsClicked(true);
  };
  const handlePasswordClick = () => {
    setIsPasswordClicked(true);
  };
  const validateInput = (data) => {
    if (data.username === "") {
      enqueueSnackbar("Username cannot be empty", { variant: "error" });
      return false;
    }
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
     
      if( !alphanumericRegex.test(data.username)){
        enqueueSnackbar("Username cannot contain special characters",{variant:"warning"})
        return false;
      }
    if (data.username.length < 6) {
      
      enqueueSnackbar("Username should have atleast 6 characters", {
        variant: "error",
      });
      return false;
    }
    
    if (data.password === "") {
      enqueueSnackbar("Password cannot be empty", { variant: "error" });
      return false;
    }
    if (data.password.length < 6) {
      enqueueSnackbar("Password should have atleast 6 characters", {
        variant: "error",
      });
      return false;
    }
    if (data.password != data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
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
  const Credentials = async (formData) => {
   
      try {
        const response = await axios.post(config.endpoint + "/adduser", {
          username: formData.username,
          password: formData.password,
          email: formData.emailaddress,
          address: formData.address,
        });
        console.log(response);
        if (response.status === 201) {
          navigate("/login");
          // toast("Registered Successfully");
        } else if (response.status === 302) {
          console.log("User already exists");
        }
      } catch (error) {
        console.log(error);
      }
    
  };
  const handleggl = async (userData) => {
    try {
      const res = await axios.post(config.endpoint + "/google", {
        username: userData.username,
        password: userData.password,
        email: userData.email,
      });
      if (res.status === 201) {
        localStorage.setItem("username", userData.username);
        navigate("/", { state: { isLogged: "true" } });
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
          <h2>Register</h2>
          <div className="input-container">
            <input
              className={formData.username.length < 6 ? "clicked-input" : ""}
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => {
                handleClick();
                setFormData({ ...formData, username: e.target.value });
              }}
            />
            {isClicked ? (
              formData.username.length < 6 ? (
                <>
                  <div
                    style={{
                      color: "red",
                      textAlign: "left",
                    }}
                  >
                    <p>*Userame should have atleast 6 characters</p>
                  </div>
                </>
              ) : (
                ""
              )
            ) : (
              ""
            )}
            <input
              className={formData.password.length < 6 ? "clicked-input" : ""}
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => {
                handlePasswordClick();
                setFormData({ ...formData, password: e.target.value });
              }}
            />
            {isPasswordClicked ? (
              formData.password.length < 6 ? (
                <>
                  <div
                    style={{
                      color: "red",
                      textAlign: "left",
                    }}
                  >
                    <p>*Password should have atleast 6 characters</p>
                  </div>
                </>
              ) : (
                ""
              )
            ) : (
              ""
            )}
            <input
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
              }}
              // onClick={handleCriteria}
            />
            <input
              type="email"
              placeholder="Email-Address"
              value={formData.emailaddress}
              onChange={(e) =>
                setFormData({ ...formData, emailaddress: e.target.value })
              }
            />
            <textarea
              className="col-sm-12"
              rows={5}
              cols={74}
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            ></textarea>
          </div>
          <button
            className="login-button"
            onClick={() => {
              if(validateInput(formData)){
                Credentials(formData);
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
              onClick={() => {
                navigate("/login");
              }}
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
                  console.log(provider, data);
                  const name = data.name;
                  const email = data.email;
                  const password = generateRandomPassword(10);
                  const userData = {
                    username: name,
                    password: password,
                    email: email,
                  };
                  handleggl(userData);
                }}
                onReject={(err) => {
                  console.log(err);
                }}
              >
                <GoogleLoginButton />
              </LoginSocialGoogle>
            </div>
          </div>

          <Toaster position="top-center" />
        </div>
      </center>
      <Footer />
    </div>
  );
};

export default Register;
