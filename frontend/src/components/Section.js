import React, { useState, useEffect } from "react";
import { config } from "../App";
import axios from "axios";
import Header from "./Header";
import "./Section.css";
import Instructor from "./Instructor";
import { enqueueSnackbar } from "notistack";
const Section = ({ courseName }) => {
  const [addSection, setAddSection] = useState(false);
  const [courses, setCourses] = useState([]);
  const username = localStorage.getItem("username");
  // const queryParams = {
  //   username: username,
  // };
  const [newSection, setnewSection] = useState({
    section_name: "",
    section_description: "",
    img_url: "",
    course_name:"",
    username: username,
  });
  const [editSection, setEditSection] = useState({
    section_name: "",
    section_description: "",
    img_url: "",
    course_name:"",
    username: username,
  });

  useEffect(() => {
    // Fetch all courses when the component mounts
    fetchsections();
  }, []);
  const [sections, setSections] = useState([]);
  const handleSection = async () => {
    try {
      console.log("SEction",newSection);
      await axios.post(`${config.endpoint}/section`, newSection);
      setAddSection({
        section_name: "",
        section_description: "",
        img_url: "",
        course_name: "",
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const fetchsections = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/courses`, {
        params: {
          username: username,
        },
      });
      console.log("Response Data:", response.data);
      setSections(response.data);
      console.log("Courses:", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div>
      {/* <Header isAuthorised={false} prop student /> */}

      <div className="mx-2 my-3">
        <div className="my-2 mx-2"></div>
        {addSection ? (
          <>
            <>
              <center>
                <div className="section-container">
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Section Name"
                      value={newSection.section_name}
                      onChange={(e) =>
                        setnewSection({
                          ...newSection,
                          section_name: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Section Description"
                      value={newSection.section_description}
                      onChange={(e) =>
                        setnewSection({
                          ...newSection,
                          section_description: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={newSection.img_url}
                      onChange={(e) =>
                        setnewSection({
                          ...newSection,
                          img_url: e.target.value,
                        })
                      }
                    />
                   
                    <center>
                      <button
                        className="section-button my-4"
                        onClick={() => {
                          handleSection();
                          enqueueSnackbar("Section Added", {
                            variant: "success",
                          });
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
            {console.log("SEC:",sections)}
              {sections.map((section) => (
                
                <div key={section.id}>
                  <div className="row mx-2">
                    <div
                      className="card mb-3 course-card "
                      style={{ width: "18rem", height: "22rem" }}
                    >
                      <img
                        src={section.video_url}
                        alt="Image"
                        width="100%"
                        height="200px"
                      />
                      <div class="card-body">
                        <h5 class="card-title">{section.name}</h5>
                        <button onClick={()=>{
                        }}>Edit Section</button>
                      </div>
                      
                      <button
                        onClick={() => {
                          setnewSection({...newSection,course_name:section.name})
                          setAddSection(true);
                        }}
                      >
                        +Section
                      </button>
                   
                    </div>
                    <div></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Section;
