import React, { useState, useEffect } from "react";
import Header from "./Header";
import VideoInput from "./VideoInput";
import "./Instructor.css";
import Footer from "./Footer";
import UploadCourse from "./UploadCourse";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../App";
import VideoPlayer from "./Video";
const Instructor = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [courses, setCourses] = useState([]);
  const queryParams = {
    username: username,
  };
  useEffect(() => {
    // Fetch all courses when the component mounts
    fetchcourses();
  }, []);

  const fetchcourses = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/courses`, {
        params: queryParams,
      });
      console.log(response.data);
      setCourses(response.data);
      console.log("Courses:", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div>
      <Header isAuthorised={false} prop student />
      <div className="container">
        <h2>Jump into Course creation</h2>
        <button
          className="btn btn-outline-dark mx-6 mr-2 my-2 my-sm-0"
          onClick={() => {
            navigate("/UploadCourse");
          }}
        >
          Create Your Course
        </button>
        <div className="row mx-2 my-2">
          {courses.map((course) => (
            <div key={course.id}>
              <div className="row mx-2">
                <div
                  className="card mb-3 course-card"
                  style={{ width: "18rem" }}
                >
                  <VideoPlayer source={course.video_url} />
                  <div class="card-body">
                    <h5 class="card-title">{course.name}</h5>
                    <p class="card-text">{course.description}</p>
                    <p>{course.price}</p>
                    <h6>People Enrolled:</h6>
                  </div>
                  <button onClick={() => navigate("/CourseDetails")}>
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Instructor;
