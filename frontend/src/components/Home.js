import React, { useState, useEffect } from "react";
import VideoPlayer from "./Video";
import Header from "./Header";
import Course from "./Course";
import Footer from "./Footer";
import "./Home.css";
import { useLocation } from "react-router-dom";
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../App";
import { enqueueSnackbar } from "notistack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const Home = () => {
  const location = useLocation();
  const inst = location.state;
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [courses, setCourses] = useState([]);
  const [details, setDetails] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [completedSections, setCompletedSections] = useState({});
  const [completedCourseId, setCompletedCourseId] = useState(null);

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
  const markCourseAsDone = (courseId) => {
    setCompletedCourseId(courseId);

    setCompletedSections((prevCompletedSections) => ({
      ...prevCompletedSections,
      [courseId]: true,
    }));
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
      const res = await axios.post(`${config.endpoint}/learning`, {
        course_name: course.name,
        course_description: course.description,
        video_url: course.video_url,
        student_name: username,
      });
      console.log("Course Purchased:", course.name);
      if (res.status === 200) {
        enqueueSnackbar("Course already purchased", { variant: "info" });
      } else {
        enqueueSnackbar("Course purchased successfully", {
          variant: "success",
        });
      }
      setSelectedCourse(null);
      setPurchasedCourses([...purchasedCourses, course.id]);
      console.log("Purchased:", purchasedCourses);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <Header prop={inst} />
      <div className="row mx-2 my-2">
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
      </div>

      {!details ? (
        <>
          {/* {
            <>
              <div class="">
                <div class="card" style="--clr:#03a9f4">
                  <div class="imgBx">
                    <img src={{ recipeimg_url }} alt="" />
                  </div>

                  <div class="content">
                    <h2 class="recipe-name">{{ recipetitle }}</h2>

                    <p class="recipe-description">{{ recipedescription }} </p>

                    <div class="recipe-rating">
                      <span class="star">&#9733;</span>

                      <span class="rating-number">{{ rating }} </span>
                    </div>

                    <button>Order NOw - {{ cost }}</button>
                  </div>
                </div>
              </div>
            </>
          } */}
          <div className="product-card">
            {courses.map((course) => (
              <div key={course.id}>
               
                  <div
                    className="card mb-3 course-card card"
                   
                  >
                    <img
                      className="imgBx"
                      src={course.video_url}
                      alt="Image"
                      
                    />
                    <div class="content">
                      <h5 className="card-title">{course.name}</h5>
                      <div
                        style={{
                          height: "60px",
                        }}
                      >
                        {" "}
                        <p className="card-text">{course.description}</p>{" "}
                      </div>
                      <p className="card-cost">${course.price}</p>
                   
                    <button
                      className="btn mb-3"
                      onClick={() => {
                        fetchsections(course.id);
                        setDetails(true);
                      }}
                    >
                      More Details
                    </button>
                    {username ? (
                      <>
                        {purchasedCourses.includes(course.id) ? (
                          <></>
                        ) : (
                          <>
                            {/* <button
                              className="btn mb-3"
                              onClick={() => {
                                handlePurchase(course);
                              }}
                            >
                              Purchase course
                            </button> */}
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
        <>
          <div className="row">
            <center>
              {" "}
              <button>Click me</button>
            </center>
          </div>
          {sections.map((course) => (
            <div key={course.id} className="row mx-2 my-2 ">
              <div className="col-lg-6">
                <div className="card course-card">
                  <div className="card-body">
                    <h5 className="card-title">{course.section_name}</h5>
                    <p className="card-text">{course.section_description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <Footer />
    </div>
  );
};

export default Home;
