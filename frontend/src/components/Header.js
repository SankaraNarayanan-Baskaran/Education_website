import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import toast, { Toaster } from "react-hot-toast";
import Course from "./Course";
const Header = ({ isAuthorised, prop, student }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("username");
  return (
    <div className="header">
      <nav class="navbar navbar-dark bg-dark justify-content-between">
        <h2 className="title">EduWeb</h2>
        <div>
          <form class="form-inline">
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              class="btn btn-outline-light mx-6 mr-2 my-2 my-sm-0"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
        <div>
          {isAuthorised ? (
            <button
              class="btn btn-outline-light mx-2 my-sm-0"
              type="submit"
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </button>
          ) : (
            <>
              {prop ? (
                <>
                  {!student ? (
                    <>
                      <button className="btn rounded-button btn-outline-light mx-lg-2 mx-sm-1 my-sm-0">
                        {`${user}`}
                      </button>
                      <button
                        class="btn btn-outline-light mx-lg-2 mx-sm-1 my-sm-0"
                        onClick={() => {
                          navigate("/instructor");
                        }}
                      >
                        Instructor
                      </button>
                      <button
                        class="btn btn-outline-light mx-2 my-sm-0"
                        onClick={() => {
                          navigate("/course");
                        }}
                      >
                        My Learning
                      </button>
                      <button
                        class="btn btn-outline-light mx-lg-2 mx-sm-1 my-sm-0"
                        onClick={() => {
                          localStorage.clear();
                          navigate("/");
                        }}
                      >
                        LOG OUT
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        class="btn btn-outline-light mx-2 my-sm-0"
                        onClick={() => {
                          navigate("/", { state: { isLogged: "true" } });
                        }}
                      >
                        Student
                      </button>
                      
                      <button
                        class="btn btn-outline-light mx-2 my-sm-0"
                        onClick={() => {
                          navigate("/",{state:{isLogged:"true"}});
                        }}
                      >
                        Home
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    class="btn btn-outline-light mx-2 my-sm-0"
                    type="submit"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    LOGIN
                  </button>
                  <button
                    class="btn btn-outline-light mx-2 my-2 my-sm-0"
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
