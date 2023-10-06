import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import toast, { Toaster } from "react-hot-toast";
import Course from "./Course";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"; 

const Header = ({ isAuthorised, prop, student }) => {
  const navigate = useNavigate();
  const user = localStorage.getItem("username");
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
  
    if (searchQuery.trim() !== "") {

      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  }
  return (
    <div className="header">
      <nav class="navbar justify-content-between" style={{
        backgroundColor:"#0077b6",
        color:"#fca311 !important"
      }}>
      <div>
        <h4 className="title" style={{
          margin:"10px"
        }}>EduWeb</h4>
        </div>
        <div>
          <form className="form-inline title">
            <input
              class="form-control mr-sm-2 search"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* <button
              className="btn btn-outline-light mx-6 mr-2 my-2 my-sm-0 title"
              type="submit"
            >
              Search
            </button> */}
            <FontAwesomeIcon icon={faSearch} style={{color: "#fca311",}} />
          </form>
        </div>
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
                        class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                        onClick={() => {
                          navigate("/instructor");
                        }}
                      >
                        Instructor
                      </button>
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
                        className="btn  mx-6 mr-2 my-2 my-sm-0 title"
                        onClick={() => {
                          // window.location.reload();
                          navigate("/section");
                        }}
                      >
                        My Courses
                      </button>
                      <button
                        class="btn  mx-2 my-sm-0 title"
                        onClick={() => {
                          navigate("/", { state: { isLogged: "true" } });
                        }}
                      >
                        Student
                      </button>

                      <button
                        class="btn  mx-2 my-sm-0 title"
                        onClick={() => {
                          navigate("/", { state: { isLogged: "true" } });
                        }}
                      >
                        Home
                      </button>
                      <button
                        class="btn  mx-lg-2 mx-sm-1 my-sm-0 title"
                        onClick={() => {
                          localStorage.clear();
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
                    class="btn btn-outline-light mx-2 my-sm-0 "
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
