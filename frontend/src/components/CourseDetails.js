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
}
  const navigate=useNavigate()
  const fetchcourses = async ({courseid}) => {
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
  // const handleVideo=async()=>{
  //   try {
  //     await axios.post(`${config.endpoint}/`)
  //   } catch (error) {
  //     console.error("Error adding video:", error);
  //   }
  // }

  return (
    <div>
      <Header isAuthorised />
      <div>
      {/* <input
          type="text"
          placeholder="Video URL"
        
        /> */}
        {/* <button onClick={handleVideo()}>Add Videos</button> */}
      </div>
      {courses.map((course) => (
          <div key={course.id}>
            <div className="row mx-2 my-2">
              <div className="card mb-3 course-card" style={{ width: "18rem" }}>
                <img src={course.video_url} alt="Image" width="100%" height="200px"/>
                <div class="card-body">
                  <h5 class="card-title">{course.course_name}</h5>
                  <p class="card-text">{course.course_description}</p>
                </div>
                <button onClick={()=>{
                  window.location.reload();
                  handleSelect(course.id)
                }}>Enrolled By</button>
                <button onClick={() => navigate("/CourseDetails")}>
                  View Course
                </button>
              </div>
            </div>
          </div>
        ))}
       
      {/* <Footer/> */}
    </div>
  );
};

export default CourseDetails;
