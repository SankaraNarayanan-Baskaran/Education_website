import React, { useState, useEffect } from "react";
import VideoPlayer from "./Video";
import Header from "./Header";
import Course from "./Course";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../App";

const Home = () => {
  const location = useLocation();
  const inst = location.state;
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); // Track the selected course

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/student`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handlePurchase = async (course) => {
    try {
      setSelectedCourse(course); // Update the selected course
      await axios.post(`${config.endpoint}/learning`, {
        course_name: course.name,
        course_description: course.description,
        video_url: course.video_url,
        student_name: username,
      });
      console.log("Course Purchased:", course.name);
      setSelectedCourse(null); // Clear the selected course
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
        {courses.map((course) => (
          <div key={course.id}>
            <div className="row mx-2">
              <div className="card mb-3 course-card" style={{ width: "18rem" }}>
                <VideoPlayer source={course.video_url} />
                <div class="card-body">
                  <h5 class="card-title">{course.name}</h5>
                  <p class="card-text">{course.description}</p>
                  <p>{course.price}</p>
                </div>
                <button onClick={() => navigate("/CourseDetails")}>
                  More Details
                </button>
                {username ? (
                  <button
                    onClick={() => {
                      handlePurchase(course);
                      navigate("/coursedetails");
                    }}
                  >
                    Purchase course
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
