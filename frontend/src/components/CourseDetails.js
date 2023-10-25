import React, { useState, useEffect } from "react";
import Header from "./Header";
import VideoPlayer from "./Video";
import "./CourseDetails.css"; // Make sure this CSS file is properly linked
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../App";

const CourseDetails = (courseid) => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState(0);
  const username = localStorage.getItem("username");
  const queryParams = {
    course_id:courseid
  };
  const navigate = useNavigate();

  
  const [completedCourses, setCompletedCourses] = useState(() => {
    const storedCompletedCourses = localStorage.getItem("completedCourses");
    return storedCompletedCourses ? JSON.parse(storedCompletedCourses) : {};
  });

  const fetchcourses = async (courseid) => {
    try {
      const response = await axios.get(`${config.endpoint}/section`, {
        params:{course_id:courseid}
       
        
      });
      console.log("Query:",queryParams);
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
      </div>
  );
};

export default CourseDetails;
