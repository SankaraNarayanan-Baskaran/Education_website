import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import toast, { Toaster } from "react-hot-toast";
import Course from "./Course";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { config } from "../App";
import axios from "axios";
import "./Home.css";
const Header = ({ isAuthorised, prop, student, children ,instr}) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("username");

  return (
    <div className="header">
      <nav
        class="navbar navbar-expand-lg justify-content-between"
        style={{
          backgroundColor:"#0077b6",
          borderRadius: "0 2px 2px rgba(0,0,0.2)",
    color: "#fca311 !important",
    boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)"
        }}
      >
        <div>
          <h4
            className="title"
            style={{
              margin: "10px",
            }}
          >
            EduWeb
          </h4>
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
              {user ? (
                <button
                  class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  LOG OUT
                </button>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              {prop ? (
                <>
                  {!student ? (
                    <>
                   
                      <button
                        class="btn  mx-2 my-sm-0 title"
                        onClick={() => {
                          navigate("/course");
                        }}
                      >
                        My Learning
                      </button>
                      <button className="btn  mx-lg-2 mx-sm-1 my-sm-0 title">
                        {`${user}`}
                      </button>
                      
                      <button
                        class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                        onClick={() => {
                          localStorage.clear()
                          navigate("/");
                        }}
                      >
                        LOG OUT
                      </button>
                    </>
                  ) : (
                    <>
                    {
                      instr?(<>
                        <button className="btn  mx-6 mr-2 my-2 my-sm-0 title">🧑‍🏫{user}</button>
                      <button
                        className="btn  mx-6 mr-2 my-2 my-sm-0 title"
                        onClick={() => {
                          // window.location.reload();
                          navigate("/instructor");
                        }}
                      >
                        My Courses
                      </button>
                      </>):(<>
                        <button className="btn  mx-6 mr-2 my-2 my-sm-0 title">{user}</button>
                      </>)
                    }
                    
                      

                      
                      <button
                        class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                        onClick={() => {
                          localStorage.clear()
                          navigate("/");
                        
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
                      navigate("/login");
                    }}
                  >
                    LOGIN
                  </button>
                  <button
                    class=" btn mx-2 my-2 my-sm-0 title"
                    type="submit"
                    onClick={() => {
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

      <Toaster position="top-center" />
    </div>
  );
};

export default Header;
