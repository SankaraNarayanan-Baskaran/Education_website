import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { config } from "../App";
import { enqueueSnackbar } from "notistack";
import "../styles/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [forgotPass, setForgotPass] = useState(false);

  const [forgotPassword, setForgotPassword] = useState({
    username: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [changePass, setChangePass] = useState(false);

  const [instructor, setInstructor] = useState(false);
  const [institution, setInstitution] = useState(false);

  const [type, setType] = useState("Student");

  const validateInput = (data) => {
    if (data.username === "" || data.password === "") {
      enqueueSnackbar("Username and Password are required fields", {
        variant: "error",
      });
      return false;
    }
    return true;
  };

  const renderInputField = (type, placeholder, value, onChange) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );

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

  const handleAction = async (action, data) => {
    try {
      const res = await axios.put(
        config.endpoint + `/student/${action}`,
        data
      );
      if (res.status === 201) {
        enqueueSnackbar("Password Changed Successfully", {
          variant: "success",
        });
        navigate("/login");
      }
    } catch (error) {
      enqueueSnackbar("Invalid Credentials", { variant: "error" });
      console.log(error);
    }
  };

  const navigate = useNavigate();

  return (
    <div>
      <Header isAuthorised />
      <center>
        {forgotPass || changePass ? (
          <div className="login-container">
            <h2>{forgotPass ? "Change Password" : "Forgot Password"}</h2>
            <div className="input-container">
              {renderInputField(
                "text",
                "Username",
                forgotPassword.username,
                (e) =>
                  setForgotPassword({
                    ...forgotPassword,
                    username: e.target.value,
                  })
              )}

              {renderInputField(
                "password",
                "New Password",
                forgotPassword.newPassword || changePassword.newPassword,
                (e) =>
                  forgotPass
                    ? setForgotPassword({
                        ...forgotPassword,
                        newPassword: e.target.value,
                      })
                    : setChangePassword({
                        ...changePassword,
                        newPassword: e.target.value,
                      })
              )}

              {renderInputField(
                "password",
                "Confirm New Password",
                forgotPassword.confirmPassword || changePassword.confirmPassword,
                (e) =>
                  forgotPass
                    ? setForgotPassword({
                        ...forgotPassword,
                        confirmPassword: e.target.value,
                      })
                    : setChangePassword({
                        ...changePassword,
                        confirmPassword: e.target.value,
                      })
              )}

              <button
                className="login-button mb-3"
                onClick={() =>
                  forgotPass
                    ? handleAction("forgotPass", forgotPassword)
                    : handleAction("updatePass", changePassword)
                }
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="login-container">
            <h3>{type} Login</h3>
            <div className="input-container">
              {institution ? (
                renderInputField(
                  "text",
                  "Name of the Institution",
                  formData.username,
                  (e) =>
                    setFormData({ ...formData, username: e.target.value })
                )
              ) : (
                renderInputField(
                  "text",
                  "Username",
                  formData.username,
                  (e) => setFormData({ ...formData, username: e.target.value })
                )
              )}

              {renderInputField(
                "password",
                "Password",
                formData.password,
                (e) => setFormData({ ...formData, password: e.target.value })
              )}
            </div>

            <button
              className="login-button mb-3 mx-3"
              onClick={() => setChangePass(true)}
            >
              Change Password
            </button>
            <button
              className="login-button mb-3 mx-3"
              onClick={() => setForgotPass(true)}
            >
              Forgot Password
            </button>

            <button
              className="login-button mx-3 mb-3"
              onClick={() => {
                if (validateInput(formData)) {
                  handleLogin();
                }
              }}
            >
              Login
            </button>

            {institution ? (
              <></>
            ) : (
              <>
                <button
                  className="login-button"
                  onClick={() => {
                    setType("Instructor");
                    localStorage.setItem("type", "inst");
                    setInstructor(true);
                  }}
                >
                  Login as Instructor?
                </button>
                <button
                  className="login-button"
                  onClick={() => {
                    setInstitution(true);
                    setType("Institution");
                    localStorage.setItem("type", "admin");
                  }}
                >
                  Institution Login?
                </button>
              </>
            )}
          </div>
        )}
      </center>
      <Footer />
    </div>
  );
};

export default Login;
