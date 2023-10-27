import React, { useState, useEffect } from "react";
import VideoPlayer from "./Video";
import Header from "./Header";
import Course from "./Course";
import Footer from "./Footer";
import "./Home.css";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { CssBaseline } from "@mui/material";
import { useLocation } from "react-router-dom";
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../App";
import { enqueueSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const location = useLocation();
  const inst = location.state;
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [purchased, setPurchased] = useState([]);
  const [instructor,setInstructor]=useState(false)
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showFilteredCourses, setShowFilteredCourses] = useState(false);
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState([]);
  const [details, setDetails] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [completedSections, setCompletedSections] = useState({});
  const [purchasedLoaded, setPurchasedLoaded] = useState(false);
  const [completedCourseId, setCompletedCourseId] = useState(null);
  const [load, setLoad] = useState(false);
  const [selectedCourseDescription, setSelectedCourseDescription] =
    useState("");
  const [description, setDescription] = useState(false);
  // const queryParams={
  //   username:username,
  //   course_name:cou
  // }
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/student`);
      setCourses(response.data);

      // const purchasedResponse=await axios.get(`${config.endpoint}/purchased`,{
      //   params:{username}
      // })
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchsections = async (id) => {
    try {
      console.log("ID:", id);
      const response = await axios.get(`${config.endpoint}/section`, {
        params: {
          course_id: id,
        },
      });
      console.log("Response Data:", response.data);
      setSections(response.data);
      console.log("Courses:", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handlePurchase = async (course) => {
    try {
      setSelectedCourse(course);
      console.log("SEL:", selectedCourse);
      const res = await axios.post(`${config.endpoint}/learning`, {
        course_name: course.name,
        course_description: course.description,
        video_url: course.video_url,
        student_name: username,
      });

      if (res) {
        enqueueSnackbar("Purchased Course successfully", {
          variant: "success",
        });
        navigate("/course");
      }
      setSelectedCourse(null);
      setPurchasedCourses((prevPurchasedCourses) => [
        ...prevPurchasedCourses,
        course,
      ]);

      console.log("COURSE:", course);
      console.log("PRS:", purchasedCourses);

      // localStorage.setItem(
      //   "purchasedCourses",
      //   JSON.stringify([...purchasedCourses, course.id])
      // );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (username) {
      const fetchPurchased = async () => {
        try {
          const res = await axios.get(`${config.endpoint}/learning`, {
            params: {
              username: username,
            },
          });
          if (res.status === 200) {
            setPurchased(res.data);
            setPurchasedLoaded(true);
          }
        } catch (error) {
          console.log("error", error);
        }
      };

      fetchPurchased();
    } else {
    }
  }, []);

  const handleCategorySelect = async (event) => {
    setSelectedCategory(event.target.value);
    const res = await axios.get(`${config.endpoint}/filter`, {
      params: {
        category: event.target.value,
      },
    });
    if (res) {
      setFilteredCourses(res.data);
    }

    setShowFilteredCourses(true);
  };
  const addtoInstructor = async () => {
    try {
      const res = await axios.post(`${config.endpoint}/convertInst`, {
        name: username,
      });
      console.log(res);
      if (res.status === 201) {
        enqueueSnackbar("You are now an Instructor", { variant: "info" });
      } else if (res.status === 299) {
        enqueueSnackbar("You are already an instructor", { variant: "info" });
      
      }
    } catch (error) {
      console.log("error", error);
    }
  };

   const checkInstructor=async(username)=>{
    try {
      console.log(username);
     const resp= await axios.get(`${config.endpoint}/instructor`,{
        params:{
         name:username
        }
      })
      console.log(resp)
      if(resp.status === 201){
        setInstructor(true)
        
      }
      else if(resp.status === 202){
        setInstructor(false)
      }
    } catch (error) {
      console.log(error);
    }
  }
 useEffect(()=>{
  const username=localStorage.getItem("username");
  checkInstructor(username)
 },[])

  const handleSearch = async () => {
    if (searchQuery.trim() !== "") {
      console.log("Search:", searchQuery);
      const response = await axios.get(`${config.endpoint}/search`, {
        params: {
          query: searchQuery,
        },
      });
      setSearchResults(response.data);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <Header prop={inst}>
        <select value={selectedCategory} onChange={handleCategorySelect}>
          <option value="All">All</option>
          <option value="sports">Sports</option>
          <option value="social">Social</option>
        </select>
        <Box width={300}>
          <TextField
            className="search"
            size="small"
            fullWidth
            placeholder="Search for courses"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon
                    onClick={() => {
                      handleSearch();
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch();
            }}
          />
        </Box>
      </Header>

      <div className="row mx-2 my-2">
        {showFilteredCourses ? (
          <>
            <div className="product-card">
              <>
                <div className="product-card">
                  {filteredCourses.map((course) => (
                    <div key={course.id}>
                      <div className="card mb-3 card">
                        <img
                          className="imgBx"
                          src={course.video_url}
                          alt="Image"
                        />
                        <div
                          style={
                            {
                              // marginLeft:"5px"
                            }
                          }
                        >
                          <h5
                            className="card-title"
                            style={{
                              marginLeft: "5px",
                            }}
                          >
                            {course.name}
                          </h5>

                          <p
                            style={{
                              marginLeft: "5px",
                            }}
                          >
                            ${course.price}
                          </p>
                          {selectedCourseDescription === course.name ? (
                            <>
                              <div
                                style={{
                                  height: "60px",
                                }}
                              >
                                {" "}
                                <p
                                  className="card-text"
                                  style={{
                                    marginLeft: "5px",
                                  }}
                                >
                                  {course.description}
                                </p>{" "}
                              </div>
                            </>
                          ) : (
                            <>
                              <button
                                style={{
                                  width: "100px",
                                  height: "60px",
                                  fontSize: "13px",
                                  marginRight: "8px",

                                  marginLeft: "5px",
                                }}
                                className="det mb-4"
                                onClick={() => {
                                  fetchsections(course.id);
                                  setSelectedCourseDescription(course.name);
                                }}
                              >
                                More Details
                              </button>
                            </>
                          )}

                          {username ? (
                            <>
                              {purchased.some(
                                (item) => item.course_name === course.name
                              ) ? (
                                <></>
                              ) : (
                                <>
                                  <button
                                    style={{
                                      width: "298.5px",

                                      fontSize: "13px",
                                    }}
                                    onClick={() => {
                                      handlePurchase(course);
                                    }}
                                  >
                                    Purchase course
                                  </button>
                                </>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            </div>
          </>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <div className="product-card">
                {searchResults.map((course) => (
                  <div key={course.id}>
                  <div className="card mb-3 card">
                            <img
                              className="imgBx"
                              src={course.video_url}
                              alt="Image"
                            />
                            <div
                              style={
                                {
                                  // marginLeft:"5px"
                                }
                              }
                            >
                              <h5
                                className="card-title"
                                style={{
                                  marginLeft: "5px",
                                }}
                              >
                                {course.name}
                              </h5>

                              <p
                                style={{
                                  marginLeft: "5px",
                                }}
                              >
                                ${course.price}
                              </p>
                              {username ? (
                                <>
                                  {purchased.some(
                                    (item) => item.course_name === course.name
                                  ) ? (
                                    <></>
                                  ) : (
                                    <>
                                      <button
                                        style={{
                                          width: "298.5px",

                                          fontSize: "13px",
                                        }}
                                        onClick={() => {
                                          handlePurchase(course);
                                        }}
                                      >
                                        Purchase course
                                      </button>
                                    </>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                              </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.trim() !== "" ? (
              <center>
                <p>No courses found</p>
              </center>
            ) : (
              <>
                {!details ? (
                  <h3
                    style={{
                      textAlign: "center !important",
                    }}
                  >
                    Welcome {username}
                  </h3>
                ) : (
                  <></>
                )}
                {!details ? (
                  <>
                    <div className="product-card">
                      {courses.map((course) => (
                        <div key={course.id}>
                          <div className="card mb-3 card">
                            <img
                              className="imgBx"
                              src={course.video_url}
                              alt="Image"
                            />
                            <div
                              style={
                                {
                                  // marginLeft:"5px"
                                }
                              }
                            >
                              <h5
                                className="card-title"
                                style={{
                                  marginLeft: "5px",
                                }}
                              >
                                {course.name}
                              </h5>

                              <p
                                style={{
                                  marginLeft: "5px",
                                }}
                              >
                                ${course.price}
                              </p>
                              {selectedCourseDescription === course.name ? (
                                <>
                                  <div
                                    style={{
                                      height: "60px",
                                    }}
                                  >
                                    {" "}
                                    <p
                                      className="card-text"
                                      style={{
                                        marginLeft: "5px",
                                      }}
                                    >
                                      {course.description}
                                    </p>{" "}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <button
                                    style={{
                                      width: "100px",
                                      height: "60px",
                                      fontSize: "13px",
                                      marginRight: "8px",

                                      marginLeft: "5px",
                                    }}
                                    className="det mb-4"
                                    onClick={() => {
                                      fetchsections(course.id);
                                      setSelectedCourseDescription(course.name);
                                    }}
                                  >
                                    More Details
                                  </button>
                                </>
                              )}

                              {username ? (
                                <>
                                  {purchased.some(
                                    (item) => item.course_name === course.name
                                  ) ? (
                                    <></>
                                  ) : (
                                    <>
                                      <button
                                        style={{
                                          width: "298.5px",

                                          fontSize: "13px",
                                        }}
                                        onClick={() => {
                                          handlePurchase(course);
                                        }}
                                      >
                                        Purchase course
                                      </button>
                                    </>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}
        
      </div>
      <center>
      
      {
        username?(<>
          <div style={{
        marginBottom:"3%"
      }}>  
      {instructor ?(<>
                  <button class="btn mx-2 my-sm-0 title" onClick={()=>{
                    
                    navigate("/instructor")
                  }}>Switch to Instructor view</button>
                 </>):(<><button className="btn mx-2 my-sm-0 title" onClick={()=>{
                 addtoInstructor()
                 navigate("/instructor")
                 }}>Want to be an Instructor?</button></>)}  
                 </div> 
        </>):(<></>)
      }
        
                 </center>

                 <Footer/>
    </div>
    
  );
};

export default Home;
