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
  const [isSelected, setIsSelected] = useState(false);
  const queryParams = {
    username: username,
  };
  useEffect(() => {
    // Fetch all courses when the component mounts
    fetchcourses();
  }, []);
  const handleSelect = async (courseid) => {
    try {
      console.log(courseid);
      const response = await axios.get(`${config.endpoint}/learners`, {
        params: { username: username, course_id: courseid },
      });
      console.log(response.data);
      setCourses(response.data);
      console.log("Courses:", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

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
      <div className="mx-2 my-2">
        <h2>Jump into Course creation</h2>
        <button
          className="btn btn-outline-dark mx-6 mr-2 my-2 my-sm-0"
          onClick={() => {
            navigate("/UploadCourse");
          }}
        >
          Create Your Course
        </button>
      </div>

      {isSelected ? (
        <>
          <div className="row mx-2 my-2">
            {courses.map((course) => (
              <div key={course.id}>
                <div className="row mx-2">
                  <div
                    className="card mb-3 course-card"
                    style={{ width: "18rem" }}
                  >
                    <div class="card-body">
                      <h5 class="card-title">{course.course_name}</h5>
                        <p class="card-text">{course.course_description}</p>
                      <h6>{course.student_name}</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="container">
            <div className="row mx-2 my-2">
              {courses.map((course) => (
                <div key={course.id}>
                  <div className="row mx-2">
                    <div
                      className="card mb-3 course-card"
                      style={{ width: "18rem" }}
                    >
                      <img
                        src={course.video_url}
                        alt="Image"
                        width="100%"
                        height="200px"
                      />
                      <div class="card-body">
                        <h5 class="card-title">{course.name}</h5>
                        <p class="card-text">{course.description}</p>
                        <p>{course.price}</p>
                        
                      </div>
                      <button onClick={()=>{
                         setIsSelected(true);
                         handleSelect(course.id);
                      }}>View Students</button>
                      <button
                        onClick={() => {
                          
                          // navigate("/CourseDetails");
                        }}
                      >
                        View Course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Instructor;
