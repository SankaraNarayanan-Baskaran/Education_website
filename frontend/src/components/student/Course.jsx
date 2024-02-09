import React, { useState, useEffect } from "react";
import Header from "../Header";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { config } from "../../App";
import Footer from "../Footer";
import { ProgressBar } from "react-bootstrap";
import "./styles/Course.css";
import { useCookies } from "react-cookie";
import { useUserData } from "../UserContext";

const Course = () => {
  const [progress, setProgress] = useState(() => {
    const storedProgress = localStorage.getItem("courseProgress");
    return storedProgress ? parseInt(storedProgress, 10) : 0;
  });
  const [courseProgressVisible, setCourseProgressVisible] = useState([]);
  const [courseProgress, setCourseProgress] = useState([{}]);
  const [cookies, setCookies] = useCookies([
    "jwtToken",
    "username",
    "courseid",
  ]);
  const [courses, setCourses] = useState([]);
  const username = cookies["username"];
  const [section, setSection] = useState(false);
  const [completedSections, setCompletedSections] = useState([{}]);
  const { role } = useUserData();

  const queryParams = {
    username: username,
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchcourses();
  }, []);

  const fetchProgress = async (courseId) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/course/getProgress`,
        {
          params: {
            course_id: courseId,
          },
          withCredentials: true,
        }
      );
      if (response) {
        setCourseProgress((prevCourseProgress) => ({
          ...prevCourseProgress,
          [courseId]: response.data.progress,
        }));
        setCompletedSections((prevCompletedSections) => ({
          ...prevCompletedSections,
          [courseId]: response.data.Completed_Sections,
        }));
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    courses.forEach((course) => {
      fetchProgress(course.course_id);
    });
  }, [courses]);

  const fetchcourses = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/course/learning`, {
        withCredentials: true,
      });
      setCourses(response.data);
      setCourseProgressVisible(new Array(response.data.length).fill(false));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <>
      {role.includes("student") ? (
        <>
          <Header isAuthorised={false} prop student>
            <button
              onClick={() => {
                navigate("/student", { state: { isLogged: "true" } });
                setTimeout(window.location.reload(), 1000);
              }}
            >
              Back to Home
            </button>
          </Header>
          <h4>Purchased Courses</h4>
          <div className="product-card">
            {courses.map((course, index) => (
              <div key={course.id}>
                <div className="card mb-3 card">
                  <img className="imgBx" src={course.video_url} alt="Image" />
                  <div
                    style={{
                      marginLeft: "5px",
                    }}
                  >
                    <h5 className="card-title">{course.course_name}</h5>
                    <div style={{ height: "60px" }}>
                      <p className="card-text">{course.course_description}</p>
                    </div>

                    <>
                      {courseProgress && (
                        <ProgressBar
                          now={courseProgress?.[course.course_id] || 0}
                          label={`Progress:${
                            courseProgress?.[course.course_id] || 0
                          }% `}
                          style={{
                            margin: "0 8px 8px 0",
                          }}
                        />
                      )}
                    </>
                    {/* )} */}
                    <button
                      className="course-button"
                      onClick={() => {
                        setCookies("courseid", course.course_id);

                        navigate("/courseDetails");
                        setTimeout(window.location.reload(), 1000);
                        setSection(true);
                      }}
                    >
                      View Course
                    </button>
                    {courseProgress[course.course_id] === 100 ? (
                      <>
                        {" "}
                        <div>
                          <button
                            style={{
                              width: "100px",
                              height: "30px",
                              fontSize: "13px",
                              margin: "0 0 8px",
                            }}
                            onClick={() => {
                              localStorage.setItem(
                                "COURSE",
                                course.course_name
                              );
                              navigate(`/course/${course.course_name}/quiz`);
                            }}
                          >
                            Take Quiz
                          </button>
                        </div>
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
          <Navigate to="/unauthorized" />
        </>
      )}
    </>
  );
};

export default Course;
