import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import UploadCourse from "../components/UploadCourse";
import Footer from "../components/Footer";
import axios from "axios";
import { config } from "../App";
import "../styles/Login.css";
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
import { enqueueSnackbar } from "notistack";

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

  const validateInput = (data) => {
    if (data.username === "") {
      enqueueSnackbar("Username is a required field", { variant: "error" });
      return false;
    }
    if (data.password === "") {
      enqueueSnackbar("Password is a required field", { variant: "error" });
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

  const logged = async (formData) => {
    try {
      const res = await axios.post(config.endpoint + "/student/loginuser", {
        username: formData.username,
        password: formData.password,
      });
      if (res.status === 201) {
        localStorage.setItem("username", formData.username);
        enqueueSnackbar("Logged in Successfully", { variant: "success" });
        navigate("/", { state: { isLogged: "true" } });
      }
    } catch (error) {
      enqueueSnackbar("Invalid Credentials", { variant: "error" });

      console.log(error);
    }
  };
  const loggedInst = async (formData) => {
    try {
      const res = await axios.post(config.endpoint + "/inst/logininst", {
        username: formData.username,
        password: formData.password,
      });
      if (res.status === 201) {
        localStorage.setItem("username", formData.username);
        enqueueSnackbar("Logged in Successfully", { variant: "success" });
        navigate("/instructor");
      }
    } catch (error) {
      enqueueSnackbar("Invalid Credentials", { variant: "error" });

      console.log(error);
    }
  };

  const loggedInstitution = async (formData) => {
    try {
      const res = await axios.post(config.endpoint + "/admin/logininstitution", {
        institution_name: formData.username,
        password: formData.password,
      });
      if (res.status === 201) {
        localStorage.setItem("username", formData.username);
        enqueueSnackbar("Logged in Successfully", { variant: "success" });
        navigate("/admin");
      }
    } catch (error) {
      enqueueSnackbar("Invalid Credentials", { variant: "error" });

      console.log(error);
    }
  };

  const handleChangePassword = async (changePassword) => {
    try {
      const res = await axios.put(config.endpoint + "/student/updatePass", {
        oldPassword: changePassword.oldPassword,
        newPassword: changePassword.newPassword,
      });
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

  const handleForgotPassword = async (forgotPassword) => {
    try {
      const res = await axios.put(config.endpoint + "/student/forgotPass", {
        username: forgotPassword.username,

        newPassword: forgotPassword.newPassword,
      });
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
        {forgotPass ? (
          <>
            <div className="login-container">
              <h2>Change Password</h2>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Username"
                  value={forgotPassword.username}
                  onChange={(e) => {
                    setForgotPassword({
                      ...forgotPassword,
                      username: e.target.value,
                    });
                  }}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={forgotPassword.newPassword}
                  onChange={(e) => {
                    setForgotPassword({
                      ...forgotPassword,
                      newPassword: e.target.value,
                    });
                  }}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={forgotPassword.confirmPassword}
                  onChange={(e) => {
                    setForgotPassword({
                      ...forgotPassword,
                      confirmPassword: e.target.value,
                    });
                  }}
                />
                <button
                  className="login-button mb-3"
                  onClick={() => {
                    handleForgotPassword(forgotPassword);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        {changePass ? (
          <>
            <div className="login-container">
              <h2>Change Password</h2>
              <div className="input-container">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={changePassword.oldPassword}
                  onChange={(e) => {
                    setChangePassword({
                      ...changePassword,
                      oldPassword: e.target.value,
                    });
                  }}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={changePassword.newPassword}
                  onChange={(e) => {
                    setChangePassword({
                      ...changePassword,
                      newPassword: e.target.value,
                    });
                  }}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={changePassword.confirmPassword}
                  onChange={(e) => {
                    setChangePassword({
                      ...changePassword,
                      confirmPassword: e.target.value,
                    });
                  }}
                />
                <button
                  className="login-button mb-3"
                  onClick={() => {
                    handleChangePassword(changePassword);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="login-container">
              {institution ? (
                <>
                  <h3>Institution Login</h3>
                </>
              ) : (
                <>
                  {instructor ? (
                    <>
                      <h3>Instructor Login</h3>
                    </>
                  ) : (
                    <>
                      <h3>Student Login</h3>
                    </>
                  )}
                </>
              )}
              <div className="input-container">
                {institution ? (
                  <>
                    <input
                      type="text"
                      placeholder="Name of the Institution"
                      value={formData.username}
                      onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value });
                      }}
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value });
                      }}
                    />
                  </>
                )}

                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                />
              </div>
              <button
                className="login-button mb-3 mx-3"
                onClick={() => {
                  setChangePass(true);
                }}
              >
                Change Password
              </button>
              <button
                className="login-button mb-3 mx-3"
                onClick={() => {
                  setForgotPass(true);
                }}
              >
                Forgot Password
              </button>
              {institution ? <></> : <></>}
              {instructor ? (
                <>
                  <button
                    className="login-button mx-3 mb-3"
                    onClick={() => {
                      if (validateInput(formData)) {
                        loggedInst(formData);
                      }
                    }}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  {institution ? (
                    <>
                      <button
                        className="login-button mx-3 mb-3"
                        onClick={() => {
                          if (validateInput(formData)) {
                            loggedInstitution(formData);
                          }
                        }}
                      >
                        Login
                      </button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <button
                        className="login-button mx-3 mb-3"
                        onClick={() => {
                          if (validateInput(formData)) {
                            logged(formData);
                          }
                        }}
                      >
                        Login
                      </button>
                    </>
                  )}
                </>
              )}

              {instructor ? (
                <></>
              ) : (
                <>
                  {institution ? (
                    <></>
                  ) : (
                    <>
                      <button
                        className="login-button"
                        onClick={() => {
                          localStorage.setItem("user", "inst");
                          setInstructor(true);
                        }}
                      >
                        Login as Instructor?
                      </button>
                      <button
                        className="login-button"
                        onClick={() => {
                          setInstitution(true);
                        }}
                      >
                        Institution Login?
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </center>
      <Footer />
    </div>
  );
};

export default Login;
