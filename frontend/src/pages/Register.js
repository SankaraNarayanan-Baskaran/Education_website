import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../App";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
import { useSnackbar } from "notistack";
import Papa from "papaparse";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Register.css";
import withAuthentication from "../components/HOC";
const Register = ({formData,setFormData,handleRegister}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [instructor, setInstructor] = useState(false);
  const [institution, setInstitution] = useState(false);
  const [type, setType] = useState(("Student"));

 
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

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
  const renderInputField = (type, placeholder, value, onChange, className) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  );

  
  const handleggl = async (userData) => {
    try {
      const res = await axios.post(config.endpoint + "/student/google", {
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
  const showError = (condition, errorMessage) => {
    return condition ? (
      <div style={{ color: "red", textAlign: "left" }}>
        <p>{errorMessage}</p>
      </div>
    ) : null;
  };

  return (
    <div>
      <Header isAuthorised />
      <center>
        <div className="login-container">
          <h3>{type} Registration</h3>

          <div className="input-container">
            {renderInputField(
              "text",
              `Name of the ${type}`,
              formData.username,
              (e) => setFormData({ ...formData, username: e.target.value }),
              formData.username.length < 6 ? "clicked-input" : ""
            )}
            {showError(
             formData.username.length!==0&& formData.username.length < 6,
              "*Username should have at least 6 characters"
            )}

            {renderInputField(
              "password",
              "Password",
              formData.password,
              (e) => setFormData({ ...formData, password: e.target.value }),
              formData.password.length < 6 ? "clicked-input" : ""
            )}
            {showError(
              formData.password.length!==0&& formData.password.length < 6,
              "*Password should have at least 6 characters"
            )}

            {renderInputField(
              "password",
              "Confirm Password",
              formData.confirmPassword,
              (e) =>
                setFormData({ ...formData, confirmPassword: e.target.value }),
              formData.confirmPassword.length < 6 ? "clicked-input" : ""
            )}
            {showError(
              formData.password !== formData.confirmPassword,
              "*Passwords do not match"
            )}

            {renderInputField(
              "email",
              "Email-Address",
              formData.email,
              (e) => setFormData({ ...formData, email: e.target.value }),
              !validateEmail(formData.email) ? "clicked-input" : ""
            )}
            {showError(
              formData.email.length !==0 &&
              !validateEmail(formData.email),
              "*Invalid Email Address"
            )}
            {institution&&(<>
                  {renderInputField("text","Institution Icon",formData.icon,(e)=>{
                    setFormData({...formData,icon:e.target.value})
                  },"")}
                </>)}{
              instructor?(<>
                
              </>):(<><textarea
              className="col-sm-12"
              rows={5}
              cols={74}
              placeholder="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            ></textarea></>)
            }
            
          </div>
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
            <button className="login-button" onClick={() => navigate("/login")}>
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
                  handleggl(userData);
                }}
                onReject={(err) => {
                  console.log(err);
                }}
              >
                <GoogleLoginButton />
              </LoginSocialGoogle>

              <>
                {instructor ? (
                  <> </>
                ) : (
                  <>
                    <button
                      className="login-button"
                      onClick={() => {
                        
                        setType("Instructor");
                        localStorage.setItem("type","inst")
                        setInstructor(true);
                      }}
                    >
                      Instructor?
                    </button>
                  </>
                )}
                {institution ? (
                  <>
                   
                  </>
                ) : (
                  <>
                    <button
                      className="login-button mx-3"
                      onClick={() => {
                        setInstitution(true);
                        setType("Institution");
                        localStorage.setItem("type","admin")
                      }}
                    >
                      Register As an Institution
                    </button>
                  </>
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
