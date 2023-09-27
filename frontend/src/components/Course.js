import React from "react";
import image from "../Images/bgimage.jpg";
import "./Course.css";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import VideoPlayer from "./Video";
import Footer from "./Footer";
import axios from "axios";
import { config } from "../App";
import Header from "./Header";
const Course = () => {
  const [courses, setCourses] = useState([]);
  const username=localStorage.getItem("username");
  const queryParams={
    username:username
  }
    const navigate=useNavigate()
    const fetchcourses = async () => {
      try {
        const response = await axios.get(`${config.endpoint}/learning`,{params:queryParams});
        console.log(response.data);
        setCourses(response.data);
        console.log("Courses:", courses);
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
    <Header isAuthorised={false} prop student/>
      <div className="row mx-2 my-2">
      <h2>Purchased Courses</h2>
      <br/><br/><br/>
        {courses.map((course) => (
          <div key={course.id}>
            <div className="row mx-2">
              <div className="card mb-3 course-card" style={{ width: "18rem" }}>
                <img src={course.video_url} alt="Image" width="200px" height="200px" />
                <div class="card-body">
                  <h5 class="card-title">{course.course_name}</h5>
                  <p class="card-text">{course.course_description}</p>
                </div>
                <button onClick={() => navigate("/CourseDetails")}>
                  View Course
                </button>
              </div>
            </div>
          </div>
        ))}
          </div>
          
    </>
 
)}

export default Course;
