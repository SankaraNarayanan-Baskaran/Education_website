import React, { useState,useEffect } from "react";
import Header from "./Header";
import VideoPlayer from "./Video";
import "./CourseDetails.css"
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../App";

const CourseDetails = () => {
  const [courses,setCourses]=useState([]);
const username=localStorage.getItem("username")
const queryParams={
  username:username
}
  const navigate=useNavigate()
  const fetchcourses = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/learners`,{params:queryParams});
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
    <div>
      <Header isAuthorised />
      {courses.map((course) => (
          <div key={course.id}>
            <div className="row mx-2">
              <div className="card mb-3 course-card" style={{ width: "18rem" }}>
                <VideoPlayer source={course.video_url} />
                <div class="card-body">
                  <h5 class="card-title">{course.student_name}</h5>
                  <p class="card-text">{course.course_description}</p>
                </div>
                <button onClick={() => navigate("/CourseDetails")}>
                  View Course
                </button>
              </div>
            </div>
          </div>
        ))}
       
      <Footer/>
    </div>
  );
};

export default CourseDetails;
