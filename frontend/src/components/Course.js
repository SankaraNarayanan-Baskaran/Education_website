import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import { ProgressBar } from "react-bootstrap";
import "./Course.css";

const Course = () => {
  const isSectionCompleted = (sectionId, courseId) => {
    const progress = courseProgress[courseId];
    return progress > 0 && completedSections[sectionId];
  };
  const [progress, setProgress] = useState(() => {
    const storedProgress = localStorage.getItem("courseProgress");
    return storedProgress ? parseInt(storedProgress, 10) : 0;
  });
  const [courseProgressVisible, setCourseProgressVisible] = useState([]);
  const [courseProgress, setCourseProgress] = useState(() => {
    const storedCourseProgress = JSON.parse(
      localStorage.getItem("courseProgress")
    );
    return storedCourseProgress ? storedCourseProgress : {};
  });
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
  const [completedSections, setCompletedSections] = useState(() => {
    const storedCompletedSections = JSON.parse(
      localStorage.getItem("completedSections")
    );
    return storedCompletedSections ? storedCompletedSections : {};
  });
  const [completedCourseId, setCompletedCourseId] = useState(null);

  const queryParams = {
    username: username,
  };
  const navigate = useNavigate();

  useEffect(() => {
    const lastCompletedSectionId = localStorage.getItem(
      "lastCompletedSectionId"
    );
    if (lastCompletedSectionId) {
      setCompletedCourseId(parseInt(lastCompletedSectionId));
    } else {
      if (courses.length > 0) {
      }
    }
  }, [courses]);

  useEffect(() => {
    const completedCount =
      Object.values(completedSections).filter(Boolean).length;

    // Calculate the progress for the current course
    const totalSections = courses.length; // Total sections in the current course
    const newProgress = Math.trunc((completedCount * 100) / totalSections);

    // Update the progress state
    setProgress(newProgress);
  }, [completedSections, courses]);

  const fetchProgress = async (courseId) => {
    try {
      const res = await axios.get(`${config.endpoint}/getProgress`, {
        params: {
          username: username,
          course_id: courseId,
        },
      });
      if (res) {
        console.log(res.data.Completed_Sections)
        setCourseProgress({
          ...courseProgress,
          [courseId]: res.data.progress,
        });
        // setCompletedCount({
        //   ...completedCount,[count]:res.data.Completed_Count
        // })
        console.log("COurse Progress:", courseProgress);
      } else {
        setCourseProgress({
          ...courseProgress,
          [courseId]: 0,
        });
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const markCourseAsDone = async (sectionId, courseId) => {
    const totalSections = courses.length;

    // fetchProgress(courseId);
    // console.log("course progress", courseProgress);
    
      setCompletedCourseId(sectionId);
      setCompletedSections((prevCompletedSections) => ({
        ...prevCompletedSections,
        [sectionId]: true,
      }));
     
      if (completedCount <= totalSections) {
        setCompletedCount((prevCompletedCount) => prevCompletedCount + 1);

        localStorage.setItem("completedCount", (completedCount + 1).toString());

        const newProgress = Math.trunc((completedCount * 100) / totalSections);

        if (newProgress <= 100) {
          setProgress(newProgress);
          localStorage.setItem("courseProgress", newProgress.toString());
        }

        const updatedCourseProgress = {
          ...courseProgress,
          [courseId]: newProgress,
        };
        setCourseProgress(updatedCourseProgress);
        localStorage.setItem(
          "courseProgress",
          JSON.stringify(updatedCourseProgress)
        );

        await axios.post(`${config.endpoint}/progress`, {
          sectionId: sectionId,
          courseId: courseId,
          progress: newProgress,
          username: username,
          count:completedCount
        });
      }
    
  };

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

  useEffect(() => {
    fetchcourses();
  }, []);
 

  return (
    <>
      <Header isAuthorised={false} prop student />

      {section ? (
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
                    height="300px"
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <h4>Purchased Courses</h4>
          <div className="product-card">
            {courses.map((course, index) => (
              <div key={course.id}>
                <div className="card mb-3 course-card card">
                  <img className="imgBx" src={course.video_url} alt="Image" />
                  <div className="content">
                    <h5 className="card-title">{course.course_name}</h5>
                    <div style={{ height: "60px" }}>
                      <p className="card-text">{course.course_description}</p>
                    </div>
                    {!courseProgressVisible[index] ? (
                      <>
                        <button
                          onClick={() => {
                            const newVisibility = [...courseProgressVisible];
                            newVisibility[index] = true;
                            setCourseProgressVisible(newVisibility);
                            fetchProgress(course.course_id);
                          }}
                        >
                          View Progress
                        </button>
                      </>
                    ) : (
                      <>
                        <ProgressBar
                          now={courseProgress[course.course_id] || 0}
                          label={`${courseProgress[course.course_id] || 0}%`}
                          style={{
                            position: "fixed",
                            right: "3px",
                            top: "70px",
                            width: "10%",
                            borderRadius: "20px",
                            zIndex: "1",
                            backgroundColor: "beige",
                          }}
                        />
                        {console.log("Progress:", progress)}
                      </>
                    )}
                    <button
                      onClick={() => {
                        fetchsections(course.course_id);
                        setSection(true);
                      }}
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Course;
