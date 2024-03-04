import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { config } from "../App";
import axios from "axios";
import "./student/styles/Home.css";
import { useCookies } from "react-cookie";
;
const Header = ({ isAuthorised, prop, student, children, instr, admin }) => {
  const navigate = useNavigate();
  const [cookies, setCookies, removeCookies] = useCookies([
    "jwtToken",
    "username",
    "email",
    "type",
    "logged",
    "role",
    "icon",
    "studentname",
    "inst"
  ]);
  const handleLogout = () => {
    removeCookies("jwtToken");
    removeCookies("username");
    removeCookies("type");
    removeCookies("logged");
    removeCookies("role");
    removeCookies("data");
    removeCookies("icon");
    removeCookies("studentname");
    removeCookies("inst");
    navigate("/");
    setTimeout(window.location.reload(), 1000);
  };
  const [data, setData] = useState(null);
  const user = cookies["username"];
  const fetchInstitution = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/admin/icon`, {
        withCredentials: true,
      });
      if (response) {
        setData(response.data);
        setCookies("icon","yes");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const username = cookies["username"];
    if (username) {
      fetchInstitution(username);
    }
  }, []);
  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg justify-content-between head-nav">
        <div>
          <h4 className="h4-style">EduWeb</h4>
        </div>

        {children}

        <div>
          {isAuthorised ? (
            <>
              <button
                class="btn mx-2 my-sm-0 title"
                type="submit"
                onClick={() => {
                  navigate("/");
                }}
              >
                Home
              </button>
              {user && (
                <button
                  class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                  onClick={() => {handleLogout();}}
                > LOG OUT</button>
              )}
            </>
          ) : (
            <>
              {prop ? (
                <>
                  {!student ? (
                    <>
                      {data && (
                        <>
                          <>
                            <img
                              src={data.icon}
                              alt="Img"
                              className="img-style"
                            />
                          </>
                        </>
                      )}

                      <button
                        class="btn  mx-2 my-sm-0 title"
                        onClick={() => {
                          navigate("/course");
                          setTimeout(window.location.reload(), 1000);
                        }}
                      >
                        My Learning
                      </button>
                      <button className="btn mx-lg-2 mx-sm-1 my-sm-0 btn-style">
                        {`${user[0].toUpperCase()}`}
                      </button>

                      <button
                        class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                        onClick={() => {
                         handleLogout();
                        }}
                      >
                        LOG OUT
                      </button>
                    </>
                  ) : (
                    <>
                      {instr ? (
                        <>
                          {data && (
                            <>
                              <>
                                <img
                                  src={data.icon}
                                  alt="Img"
                                  className="img-style"
                                />
                              </>
                            </>
                          )}
                          <button className="btn  mx-6 mr-2 my-2 my-sm-0 title">
                            🧑‍🏫{user}
                          </button>
                          <button
                            className="btn  mx-6 mr-2 my-2 my-sm-0 title"
                            onClick={() => {
                              navigate("/instructor");
                            }}
                          >
                            My Courses
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn  mx-6 mr-2 my-2 my-sm-0 title">
                            {user}
                          </button>
                        </>
                      )}

                      <button
                        class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                        onClick={() => {
                          handleLogout()
                        }}
                      >
                        LOG OUT
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {admin ? (
                    <>
                      <img src={data.icon} alt="Img" className="img-style" />

                      <button
                        class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                        onClick={() => {
                          handleLogout()
                        }}
                      >
                        LOG OUT
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        class="btn mx-2 my-sm-0 title"
                        type="submit"
                        onClick={() => {
                          setCookies("type", "student");
                          navigate("/login");
                        }}
                      >
                        LOGIN
                      </button>
                      <button
                        class=" btn mx-2 my-2 my-sm-0 title"
                        type="submit"
                        onClick={() => {
                          // localStorage.setItem("type", "student");
                          setCookies("type", "student");
                          // window.location.href = '/register';
                          navigate("/register");
                        }}
                      >
                        REGISTER
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
