import React, { useState, useEffect } from "react";
import Header from "./Header";
import VideoPlayer from "./Video";
import "../styles/CourseDetails.css"; // Make sure this CSS file is properly linked
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../App";

const CourseDetails = (courseid) => {
  const [courses, setCourses] = useState([]);
  const [completedSections, setCompletedSections] = useState([{}]);
  const [completedCourseId, setCompletedCourseId] = useState([{}]);
  const username = localStorage.getItem("username");
  const queryParams = {
    course_id: courseid,
  };
  const navigate = useNavigate();

  const isSectionCompleted = (sectionId) => {
    const exists = Object.values(completedSections).some((value) => {
      if (Array.isArray(value)) {
        return value.includes(sectionId);
      }
      return false;
    });

    return exists;
  };

  const fetchsections = async (courseId) => {
    try {
      const response = await axios.get(`${config.endpoint}/course/section`, {
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
    const courseId = localStorage.getItem("courseId");
    fetchsections(courseId);
  }, []);

  const markCourseAsDone = async (sectionId, courseId) => {
    setCompletedCourseId(sectionId);

    console.log("completedCourseId:", completedCourseId);
    setCompletedSections((prevCompletedSections) => ({
      ...prevCompletedSections,
      [courseId]: [...(prevCompletedSections[courseId] || []), sectionId],
    }));

    await axios.post(`${config.endpoint}/course/progress`, {
      sectionId: sectionId,
      courseId: courseId,
      username: username,
      count: courses.length,
    });
  };
  const fetchProgress = async (courseId) => {
    try {
      const response = await axios.get(`${config.endpoint}/course/getProgress`, {
        params: {
          username: username,
          course_id: courseId,
        },
      });
      if (response) {
        setCompletedSections((prevCompletedSections) => ({
          ...prevCompletedSections,
          [courseId]: response.data.Completed_Sections,
        }));
        console.log(completedSections);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    const courseId = localStorage.getItem("courseId");
    fetchProgress(courseId);
  }, []);

  return (
    <div>
      <Header isAuthorised={false} prop inst />
      <>
        <h4>Course Sections:</h4>
        {courses.map((section) => (
          <div key={section.id} className="row mx-2 my-2">
            <div className="col-lg-8 my-2">
              {completedCourseId === section.id && (
                <>
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
                  <div
                    style={{
                      position: "fixed",
                      left: "10px",
                      bottom: "10px",
                    }}
                  >
                    {" "}
                    <textarea rows={5} cols={80} readOnly>
                      {section.transcript}
                    </textarea>{" "}
                  </div>
                </>
              )}
            </div>
           
            <div className="col-lg-4">
           
                <div className="card course-card">
                  <div className="card-body">
                    <h5 className="card-title">{section.section_name}</h5>
                    <p className="card-text">{section.section_description}</p>
                    <div>
                      <button
                        onClick={() => {
                          markCourseAsDone(section.id, section.Course_id);
                        }}
                      >
                        View Section
                      </button>

                      {/* {  {isSectionCompleted(section.id) && <p>✓ Section Completed</p>}} */}

                      {isSectionCompleted(section.id) ? (
                        <>
                          <p>✓ Section Completed</p>
                        </>
                      ) : (
                        <>{console.log("false")}</>
                      )}
                    </div>
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
