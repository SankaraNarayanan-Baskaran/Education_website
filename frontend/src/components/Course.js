import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import { ProgressBar } from "react-bootstrap";
import "./Course.css";

const Course = () => {
 
  const [progress, setProgress] = useState(() => {
    const storedProgress = localStorage.getItem("courseProgress");
    return storedProgress ? parseInt(storedProgress, 10) : 0;
  });
  const [courseProgressVisible, setCourseProgressVisible] = useState([]);
  const [courseProgress, setCourseProgress] = useState([{}]);
  
  const [completedCount, setCompletedCount] = useState(() => {
    const storedCompletedCount = localStorage.getItem("completedCount");
    return storedCompletedCount ? parseInt(storedCompletedCount, 10) : 0;
  });

  const [completedCourses, setCompletedCourses] = useState(() => {
    const storedCompletedCourses = JSON.parse(
      localStorage.getItem("completedCourses")
    );
    return storedCompletedCourses ? storedCompletedCourses : {};
  });
  const [courses, setCourses] = useState([]);
  const username = localStorage.getItem("username");
  const [section, setSection] = useState(false);
  const [completedSections, setCompletedSections] = useState([{}]);
  const [completedCourseId, setCompletedCourseId] = useState([{}]);

  const queryParams = {
    username: username,
  };
  const navigate = useNavigate();
  useEffect(() => {}, []);

  

  useEffect(() => {}, []);

  useEffect(() => {
    fetchcourses();
  }, []);

  const fetchProgress = async (courseId) => {
    try {
      const response = await axios.get(`${config.endpoint}/getProgress`, {
        params: {
          username: username,
          course_id: courseId,
        },
      });
      if (response) {
        setCourseProgress((prevCourseProgress) => ({
          ...prevCourseProgress,
          [courseId]: response.data.progress,
        }));
        setCompletedSections((prevCompletedSections)=>({
          ...prevCompletedSections,
          [courseId]:response.data.Completed_Sections
        }))
        console.log(completedSections)
        
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const isSectionCompleted = (sectionId) => {
   
      const exists = Object.values(completedSections).some((value) => {
        if (Array.isArray(value)) {
          return value.includes(sectionId);
        }
        return false; // Or handle non-array values as needed
      });
    
      return exists; // Add this return statement
  
    
    
  };
  
  useEffect(() => {
    courses.forEach((course) => {
      fetchProgress(course.course_id);
      
    });
  }, [courses]);

  // const markCourseAsDone = async (sectionId, courseId) => {
  //   setCompletedCourseId(sectionId);
  
  //   console.log('completedCourseId:', completedCourseId);


   
  //   await axios.post(`${config.endpoint}/progress`, {
  //     sectionId: sectionId,
  //     courseId: courseId,
  //     username: username,
  //     count: courses.length,
  //   });
  // };

  const fetchcourses = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/learning`, {
        params: queryParams,
      });
      setCourses(response.data);
      setCourseProgressVisible(new Array(response.data.length).fill(false));
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

  useEffect(() => {}, []);

  return (
    <>
      <Header isAuthorised={false} prop student>
      <button onClick={()=>{
        navigate("/",{state:{isLogged:"true"}})
      }}>Back to Home</button>
      </Header>

      
          <h4>Purchased Courses</h4>
          <div className="product-card">
            {courses.map((course, index) => (
              <div key={course.id}>
                <div className="card mb-3 card">
                  <img className="imgBx" src={course.video_url} alt="Image" />
                  <div
                    style={{
                      marginLeft: "5px",
                    }}
                  >
                    <h5 className="card-title">{course.course_name}</h5>
                    <div style={{ height: "60px" }}>
                      <p className="card-text">{course.course_description}</p>
                    </div>

                    <>
                      <ProgressBar
                        now={courseProgress[course.course_id] || 0}
                        label={`Progress:${
                          courseProgress[course.course_id] || 0
                        }% `}
                        style={{
                          // position:"absolute",
                          margin: "0 8px 8px 0",

                          // width: "85%",
                          // zIndex: "1",
                        }}
                      />

                      {console.log("Progress:", progress)}
                    </>
                    {/* )} */}
                    <button
                      style={{
                        width: "100px",
                        height: "30px",
                        fontSize: "13px",
                        margin: "0 0 8px",
                      }}
                      onClick={() => {
                        localStorage.setItem("courseId",course.course_id)
                      
                        navigate("/courseDetails")
                        setSection(true);
                      }}
                    >
                      View Course
                    </button>
                    {
                      courseProgress[course.course_id] === 100 ?(<> <div><button style={{
                        width: "100px",
                        height: "30px",
                        fontSize: "13px",
                        margin: "0 0 8px",
                      }}
                      onClick={()=>{localStorage.setItem("COURSE",course.course_name)
                      navigate(`/course/${course.course_name}/quiz`)}}>
                        Take Quiz
                      </button></div></>):(<></>)
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      
    
  );
};

export default Course;
