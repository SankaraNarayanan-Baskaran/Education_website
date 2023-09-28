import React, { useState, useEffect } from "react";
import Header from "./Header";
import VideoPlayer from "./Video";
import "./CourseDetails.css"; // Make sure this CSS file is properly linked
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../App";

const CourseDetails = () => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState(0);
  const username = localStorage.getItem("username");
  const queryParams = {};
  const navigate = useNavigate();

  
  const [completedCourses, setCompletedCourses] = useState(() => {
    const storedCompletedCourses = localStorage.getItem("completedCourses");
    return storedCompletedCourses ? JSON.parse(storedCompletedCourses) : {};
  });

  const fetchcourses = async (courseId) => {
    try {
      const response = await axios.get(`${config.endpoint}/section`, {
        params: queryParams,
        course_id:courseId
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchcourses();
  }, []);

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

  return (
    <div>
      <Header isAuthorised={false} prop inst />
      <div className="rounded-element">
        <h3>Your Progress: {progress}%</h3>
      </div>
      
      {courses.map((course) => (
        <div key={course.id}>
          <div className="row mx-2 my-2">
            <div className="card mb-3 course-card" style={{ width: "18rem" }}>
              <img
                src={course.img_url}
                alt="Image"
                width="100%"
                height="200px"
              />
              <div className="card-body">
                <h5 className="card-title">{course.section_name}</h5>
                <p className="card-text">{course.section_description}</p>
              </div>
              {!completedCourses[course.id] ? ( 
                <button onClick={() => markCourseAsDone(course.id)}>
                  Mark as Done
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseDetails;
