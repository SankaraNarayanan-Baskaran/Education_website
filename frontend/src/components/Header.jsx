import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { config } from "../App";
import axios from "axios";
import "../styles/Home.css";
import { useCookies } from "react-cookie";

const Header = ({ isAuthorised, prop, student, children, instr }) => {
  const navigate = useNavigate();
  const [cookies, setCookies, removeCookies,getCookies] = useCookies(["jwtToken", "username", "email","type","logged"  ]);
  const [data, setData] = useState(null);
  const user = cookies['username'];
  const fetchInstitution = async (username) => {
    try {
      const response = await axios.get(`${config.endpoint}/admin/icon`, {
        params: {
          username: username,
        },
      });
      if (response) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
const username=cookies['username']
    fetchInstitution(username);
  }, []);
  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg justify-content-between head-nav" >
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
              {user &&(
                <button
                  class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                  onClick={() => {
                    removeCookies("jwtToken");
                    removeCookies("username");
                    removeCookies("type");
                    removeCookies("logged");
                    navigate("/");
                    setTimeout(window.location.reload(), 1000);
                  }}
                >
                  LOG OUT
                </button>
              )}
            </>
          ) : (
            <>
              {prop ? (
                <>
                  {!student ? (
                    <>
                      {data &&(
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
                          // setTimeout(window.location.reload(),1000)
                        }}
                      >
                        My Learning
                      </button>
                      <button
                        className="btn mx-lg-2 mx-sm-1 my-sm-0 btn-style">
                        {`${user[0].toUpperCase()}`}
                      </button>

                      <button
                        class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                        onClick={() => {
                          // window.location.reload()

                          removeCookies("jwtToken");
                          removeCookies("username");
                          removeCookies("type");
                    removeCookies("logged");
                          // removeCookies("email");

                          navigate("/");
                          setTimeout(window.location.reload(), 1000);
                        }}
                      >
                        LOG OUT
                      </button>
                    </>
                  ) : (
                    <>
                      {instr ? (
                        <>
                          {data &&(
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
                              // window.location.reload();
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
                          // window.location.reload()
                          removeCookies("jwtToken");
                          removeCookies("username");
                          removeCookies("type");
                    removeCookies("logged");
                          navigate("/");
                          setTimeout(window.location.reload(), 1000);
                        }}
                      >
                        LOG OUT
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    class="btn mx-2 my-sm-0 title"
                    type="submit"
                    onClick={() => {
                      // localStorage.setItem("type", "student");
                      setCookies("type","student");
                      // window.location.href = '/login';
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
                      setCookies("type","student");
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
        </div>
      </nav>
    </div>
  );
};

export default Header;
