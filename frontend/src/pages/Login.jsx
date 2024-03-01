import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { config } from "../App";
import { useSnackbar } from "notistack";
import "../styles/Login.css";
import "../styles/Header.css";
import withAuthentication from "../components/HOC";
import { MyContext, useFormData } from "../components/FormContext";
import { useCookies } from "react-cookie";
const Login = ({ handleLogin, validateInput }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookies] = useCookies(["type", "username","studentname"]);
  const { formData, setFormData } = useFormData();
  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
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

  const renderInputField = (type, placeholder, value, onChange) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );

  const handleAction = async (action, data) => {
    try {
      const res = await axios.put(config.endpoint + `/student/${action}`, data);
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
            <h2>{forgotPass ? "Forgot Password" : "Change Password"}</h2>
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
              {forgotPass ? (
                <>
                  {renderInputField(
                    "password",
                    "New Password",
                    forgotPassword.newPassword,
                    (e) =>
                      setForgotPassword({
                        ...forgotPassword,
                        newPassword: e.target.value,
                      })
                  )}
                </>
              ) : (
                <>
                  {renderInputField(
                    "password",
                    "Old Password",
                    changePassword.oldPassword,
                    (e) =>
                      setChangePassword({
                        ...changePassword,
                        oldPassword: e.target.value,
                      })
                  )}
                </>
              )}

              {renderInputField(
                "password",
                "Confirm New Password",
                forgotPassword.confirmPassword ||
                  changePassword.newPasswordPassword,
                (e) =>
                  forgotPass
                    ? setForgotPassword({
                        ...forgotPassword,
                        confirmPassword: e.target.value,
                      })
                    : setChangePassword({
                        ...changePassword,
                        newPassword: e.target.value,
                      })
              )}

              <button
                className="login-button mb-3"
                onClick={() => {
                  enqueueSnackbar("Successfull", { variant: "success" });
                  forgotPass
                    ? handleAction("forgotPass", forgotPassword)
                    : handleAction("updatePass", changePassword);
                    setTimeout(window.location.reload(),3000)
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <div className="login-container">
            <h3>{type} Login</h3>
            <div className="input-container">
              {institution
                ? renderInputField(
                    "text",
                    "Name of the Institution",
                    formData.username,
                    (e) =>
                      setFormData({ ...formData, username: e.target.value })
                  )
                : renderInputField("text", "Username", formData.username, (e) =>
                    setFormData({ ...formData, username: e.target.value })
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
                {instructor ? (
                  <>
                    <button
                      className="login-button"
                      onClick={() => {
                        setInstitution(true);
                        setType("Institution");
                        setCookies("type", "admin");
                        setCookies("studentname","harry potter")
                      }}
                    >
                      Institution Login?
                    </button>
                  </>
                ) : (
                  <>
                  <button
                  className="login-button"
                  onClick={() => {
                    setType("Instructor");
                    setCookies("type", "instructor");
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
                    setCookies("type", "admin");
                    setCookies("studentname","harry potter")
                  }}
                >
                  Institution Login?
                </button>
                  </>
                )}
                
              </>
            )}
          </div>
        )}
      </center>
      <Footer />
    </div>
  );
};

export default withAuthentication(Login);
