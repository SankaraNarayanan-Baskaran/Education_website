import React, { useState, useEffect } from "react";
import { config } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Section.css";
import { enqueueSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { useUserData } from "../UserContext";
const Section = ({ courseName }) => {
  const [addSection, setAddSection] = useState(false);
  const [cookies,setCookies] = useCookies(["username","courseName"]);
  const { role } = useUserData();
  const [courses, setCourses] = useState([]);
  const username = cookies["username"];
  const [newSection, setnewSection] = useState({
    section_name: "",
    section_description: "",
    img_url: "",
    course_name: "",
    username: username,
    transcript: "",
  });
  const [learn, setLearn] = useState({});
  const [edit, setEdit] = useState(false);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();
  const [editSection, setEditSection] = useState({section_name: "",img_url: "",sectionId: ""});
  const [students, setStudents] = useState({});
  const [sections, setSections] = useState([]);

  useEffect(() => {fetchcourses()},[]);
  const handleSection = async () => {
    try {
      console.log("SEction", newSection);
      await axios.post(`${config.endpoint}/course/section`, newSection);
      setAddSection({
        section_name: "",
        section_description: "",
        img_url: "",
        course_name: "",
        transcript: "",
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const updateSection = async () => {
    try {
      const response = await axios.post(
        `${config.endpoint}/course/updateSection`,editSection);
      setEditSection({ section_name: "", img_url: "", sectionId: "",});
    } catch (error) {
      console.log("error:", error);
    }
  };

  const renderInputField = (type, placeholder, value, onChange) => (
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}/>
  );
  const fetchsections = async (courseId) => {
    try {
      const response = await axios.get(`${config.endpoint}/course/section`, {params:{course_id: courseId,},
      });
      setSections(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const fetchcourses = async () => {
    try {
      const response = await axios.get(
        `${config.endpoint}/inst/instructorview`,{withCredentials: true,});
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const learners = async (courseId) => {
    const response = await axios.get(`${config.endpoint}/student/learners`, {params: {course_id: courseId,},
    });
    if (response) {
      setLearn((prevLearn) => ({...prevLearn,[courseId]: response.data.length,}));
      response.data.forEach((course) => {
        setStudents((prevStudents) => ({ ...prevStudents, [course.course_id]: course.student_name,}));
      });
    }
  };

  const handleStudents = async (courseName) => {
    try {
      setCookies("courseName", courseName);
      navigate(`${courseName}/students`);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    courses.forEach((course) => {
      learners(course.id);
    });
  }, [courses]);
  return (
    <>
      {role.includes("instructor") ? (
        <>
          <div>
            <div className="mx-2 my-3">
              <div className="my-2 mx-2"></div>
              {update ? (
                <>
                  <center>
                    <div className="section-container">
                      <h5>Update Section</h5>
                      <div className="input-container">
                        {renderInputField("text","Image URL",editSection.img_url,
                          (e) =>setEditSection({...editSection,img_url: e.target.value,}))}

                        <center>
                          <button
                            className="section-button my-4"
                            onClick={() => {
                              updateSection();
                              enqueueSnackbar(`Section:${editSection.section_name}Updated`,{variant: "success"});
                              setUpdate(false);
                              setEdit(false);
                            }}
                          >
                            Update Section
                          </button>
                        </center>
                      </div>
                    </div>
                  </center>
                </>
              ) : (
                <>
                  {edit ? (
                    <>
                      <div className="row mx-2 my-2">
                        {sections.map((section) => (
                          <div key={section.id}>
                            <div className="row mx-2">
                              <div
                                className="card mb-3 "
                                style={{ width: "18rem", height: "22rem" }}
                              >
                                <img src={section.img_url} alt="Image" width="100%" height="200px"/>
                                <div class="card-body">
                                  <h5 class="card-title"> {section.section_name} </h5>
                                  <p>{section.section_description}</p>
                                  <button
                                    onClick={() => {
                                      setEditSection({...editSection, sectionId: section.id,});
                                      setUpdate(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button onClick={() => {}}>Add Quiz</button>
                                </div>
                              </div>
                              <div></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {addSection ? (
                        <>
                          <>
                            <center>
                              <div className="section-container">
                                <div className="input-container">
                                  {renderInputField("text","Section Name",newSection.section_name,
                                    (e) =>setnewSection({...newSection,section_name: e.target.value}))}   
                                        
                                  {renderInputField("text","Section Description",newSection.section_description,
                                    (e) =>setnewSection({...newSection,section_description: e.target.value,}) )}
                                 
                                  {renderInputField( "text",  "Image URL",newSection.img_url,
                                    (e) =>setnewSection({ ...newSection,   img_url: e.target.value,}))}
                                       
                                  {renderInputField("text","Transcript", newSection.transcript,
                                    (e) =>setnewSection({...newSection,transcript: e.target.value,}))}
                                  <center>
                                    <button
                                      className="section-button my-4"
                                      onClick={() => {
                                        handleSection();
                                        enqueueSnackbar("Section Added", {variant: "success", });
                                        setAddSection(false);
                                      }}
                                    >
                                      Add Section
                                    </button>
                                  </center>
                                </div>
                              </div>
                            </center>
                          </>
                        </>
                      ) : (
                        <>
                          <div className="row mx-2 my-2">
                            {courses.map((course) => (
                              <div key={course.id}>
                                <div className="row mx-2">
                                  <div className="card mb-3 course-card crs-card">
                                    <img src={course.video_url} alt="Image" width="100%" height="150px" />
                                    <div class="card-body">
                                      <h5 class="card-title">{course.name}</h5>
                                      <button
                                        onClick={() => {
                                          setEdit(true);
                                          fetchsections(course.id);
                                        }}
                                      >
                                        Edit Section
                                      </button>
                                    </div>
                                    <h6 onMouseOver={() => {}}>
                                      Students Enrolled:{learn[course.id]}
                                    </h6>
                                    <button
                                      onClick={() => {
                                        setnewSection({ ...newSection,course_name: course.name,});
                                        setAddSection(true);
                                      }}
                                    >
                                      +Section
                                    </button>
                                    <button className="view-button"
                                      
                                      onClick={() => {
                                        handleStudents(course.name);
                                      }}
                                    >
                                      View Students
                                    </button>
                                  </div>
                                  <div></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <>{navigate("/unauthorized")}</>
      )}
    </>
  );
};

export default Section;
