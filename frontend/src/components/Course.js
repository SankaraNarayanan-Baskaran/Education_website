import React from "react";
import image from "../Images/bgimage.jpg";
import "./Course.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import VideoPlayer from "./Video";
import Footer from "./Footer";
import axios from "axios";
import { config } from "../App";
import Header from "./Header";
const Course = () => {
  const [progress, setProgress] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(() => {
    const storedCompletedCourses = localStorage.getItem("completedCourses");
    return storedCompletedCourses ? JSON.parse(storedCompletedCourses) : {};
  });
  const [courses, setCourses] = useState([]);
  const username = localStorage.getItem("username");
  const [section, setSection] = useState(false);
  const queryParams = {
    username: username,
  };
  const navigate = useNavigate();
  useEffect(() => {
    const completedCount =
      Object.values(completedCourses).filter(Boolean).length;
    const totalCourses = courses.length;
    const newProgress = Math.trunc((completedCount * 100) / totalCourses);
    setProgress(newProgress);
    localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
  }, [completedCourses, courses]);

  const markCourseAsDone = (courseId) => {
    setCompletedCourses((prevCompletedCourses) => ({
      ...prevCompletedCourses,
      [courseId]: true,
    }));
  };
  const fetchcourses = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/learning`, {
        params: queryParams,
      });
      console.log(response.data);
      setCourses(response.data);
      console.log("Courses:", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const fetchsections = async (courseId) => {
    try {
      const response = await axios.get(`${config.endpoint}/section`, {
        params: {
          course_id: courseId,
        },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  useEffect(() => {
    // Fetch all courses when the component mounts
    fetchcourses();
  }, []);

  return (
    <>
      <Header isAuthorised={false} prop student />

      {section ? (
        <>
          <h3>Your Progress: {progress}%</h3>
          <h4>Course Sections:</h4>{" "}
        </>
      ) : (
        <h4>Purchased Courses</h4>
      )}
      <div className="row mx-2 my-2">
        <br />
        <br />
        <br />
        {courses.map((course) => (
          <div key={course.id}>
            {section ? (
              <>
                <div>
                  <div className="row mx-2 my-2">
                    <div
                      className="card mb-3 course-card"
                      style={{ width: "18rem", height: "22rem" }}
                    >
                      <img
                        src={course.img_url}
                        alt="Image"
                        width="100%"
                        height="200px"
                      />
                      <div className="card-body">
                        <h5 className="card-title">{course.section_name}</h5>
                        <p className="card-text">
                          {course.section_description}
                        </p>
                        {/* {!completedCourses[course.id] ? (
                          <button onClick={() => markCourseAsDone(course.id)}>
                            Mark as Done
                          </button>
                        ) : null} */}
                      </div>
                      <button onClick={() => markCourseAsDone(course.id)}>
                        Mark as Done
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="row mx-2">
                  <div
                    className="card mb-3 course-card"
                    style={{ width: "18rem" }}
                  >
                    <img
                      src={course.video_url}
                      alt="Image"
                      width="200px"
                      height="200px"
                    />
                    <div class="card-body">
                      <h5 class="card-title">{course.course_name}</h5>
                      <p class="card-text">{course.course_description}</p>
                    </div>
                    <button
                      onClick={() => {
                        fetchsections(course.id);
                        setSection(true);
                      }}
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Course;
