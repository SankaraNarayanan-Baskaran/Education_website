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
    const courseId=localStorage.getItem("courseId")
    fetchsections(courseId)
  }, [courses]);


  const markCourseAsDone = (courseId) => {
    setCompletedCourses((prevCompletedCourses) => ({
      ...prevCompletedCourses,
      [courseId]: true,
    }));
  };

  return (
    <div>
      <Header isAuthorised={false} prop inst />
      <>
      <h4>Course Sections:</h4>
          {courses.map((section) => (
            <div key={section.id} className="row mx-2 my-2">
              <div className="col-lg-8 my-2">
                {completedCourseId === section.id && (
                  <img
                    className="img-Bx"
                    style={{
                      position: "fixed",
                      left: "10px",
                      top: "100px",
                    }}
                    src={section.img_url}
                    alt="Image"
                    width="50%px"
                    height="350px"
                  />
                )}
               
             

              </div>
              <div className="col-lg-4">
                <div className="card course-card">
                  <div className="card-body">
                    <h5 className="card-title">{section.section_name}</h5>
                    <p className="card-text">{section.section_description}</p>

                    <button
                      onClick={() => {
                        markCourseAsDone(section.id, section.Course_id);
                      }}
                    >
                      View Section
                    </button>
                  
                  {/* {  {isSectionCompleted(section.id) && <p>✓ Section Completed</p>}} */}
                 
                  {isSectionCompleted(section.id)?(<><p>✓ Section Completed</p></>):(<>{console.log("false")}</>)}
                   
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      
      </div>
  );
};

export default CourseDetails;
