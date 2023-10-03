import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "react-bootstrap"; // Import Bootstrap's ProgressBar
import "./Course.css";
const Course = () => {
  const [progress, setProgress] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(() => {
    const storedCompletedCourses = localStorage.getItem("completedCourses");
    return storedCompletedCourses ? JSON.parse(storedCompletedCourses) : {};
  });
  const [courses, setCourses] = useState([]);
  const username = localStorage.getItem("username");
  const [section, setSection] = useState(false);
  const [completedSections, setCompletedSections] = useState({});
  const [completedCourseId, setCompletedCourseId] = useState(null);

  const queryParams = {
    username: username,
  };
  const navigate = useNavigate();
  useEffect(() => {
    const lastCompletedSectionId = localStorage.getItem(
      "lastCompletedSectionId"
    );
    if (lastCompletedSectionId) {
      setCompletedCourseId(parseInt(lastCompletedSectionId));
    }
  }, []);
  useEffect(() => {
    const completedCount =
      Object.values(completedSections).filter(Boolean).length; // Count completed sections for the current course
    const totalSections = courses.length; // Total sections in the current course
    const newProgress = Math.trunc((completedCount * 100) / totalSections);
    setProgress(newProgress);
    localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
  }, [completedSections, courses]);

  const markCourseAsDone = (courseId) => {
    setCompletedCourseId(courseId);

    setCompletedSections((prevCompletedSections) => ({
      ...prevCompletedSections,
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
      console.error("Error fetching sections:", error);
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

          <h4>Course Sections:</h4>
          {courses.map((course) => (
            <div key={course.id} className="row mx-2 my-2">
              <div className="col-lg-8 my-2">
                {completedCourseId === course.id && (
                  <img
                    src={course.img_url}
                    alt="Image"
                    width="500px"
                    height="500px"
                  />
                )}
              </div>
              <div className="col-lg-4">
                <div className="card course-card">
                  <div className="card-body">
                    <h5 className="card-title">{course.section_name}</h5>
                    <p className="card-text">{course.section_description}</p>
                    {completedCourseId === course.id ? (
                      <span>
                        <FontAwesomeIcon icon={faCheck} /> Section Completed
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => markCourseAsDone(course.id)}
                          className="btn btn-primary"
                        >
                          View Section
                        </button>
                        {completedSections[course.id] && (
                          <span>
                            <FontAwesomeIcon icon={faCheck} /> Section Completed
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <h4>Purchased Courses</h4>
          <div className="row mx-2 my-2">
            {courses.map((course) => (
              <div key={course.id} className="col-lg-4">
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
                  <div className="card-body">
                    <h5 className="card-title">{course.course_name}</h5>
                    <p className="card-text">{course.course_description}</p>
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
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Course;
