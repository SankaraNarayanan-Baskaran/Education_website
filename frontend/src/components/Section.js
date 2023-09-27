import React, { useState, useEffect } from "react";
import { config } from "../App";
import axios from "axios";
import Header from "./Header";
import "./Section.css";
const Section = () => {
  
  const [addSection, setAddSection] = useState(false);
  const [courses, setCourses] = useState([]);
  const username = localStorage.getItem("username");
  const queryParams = {
    username: username,
  };
  const [newSection, setnewSection] = useState({
    section_name: "",
    section_description: "",
    img_url: "",
    course_name:"",
    username:username
  });

  useEffect(() => {
    // Fetch all courses when the component mounts
    fetchsections();
  }, []);
  const [sections,setSections]=useState([]);
  const handleSection = async () => {
    try {
      await axios.post(`${config.endpoint}/section`, newSection);
      setAddSection({section_name:"",section_description:"",img_url:"",course_name:""});
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const fetchsections = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/section`, {
        params: queryParams,
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
      <Header isAuthorised={false} prop student />
     
      <div className="mx-2 my-3">
        <div className="my-2 mx-2">
          <button
            onClick={() => {
              window.location.reload();
              setAddSection(true);
            }}
          >
            +Section
          </button>
        </div>
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
                      setnewSection({ ...newSection, img_url: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Course_Name"
                    value={newSection.course_name}
                    onChange={(e) =>
                      setnewSection({ ...newSection, course_name: e.target.value })
                    }
                  />
                  <center>
                  <button
                  className="section-button my-4"
                    onClick={() => {
                      handleSection();
                    }}
                  >Add Section</button>
                  </center>
                </div>
                
              </div>
              </center>
            </>
          </>
        ) : (
          <>
            <div>
             {sections.map((section) => (
                <div key={section.id}>
                  <div className="row mx-2">
                    <div
                      className="card mb-3 section-card"
                      style={{ width: "18rem" }}
                    >
                      <img
                        src={section.img_url}
                        alt="Image"
                        width="100%"
                        height="200px"
                      />
                      <div class="card-body">
                        <h5 class="card-title">{section.section_name}</h5>
                        <p class="card-text">{section.section_description}</p>
                      
                      </div>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
         
        </>
      )}
              
              
           
          
        {/* <div className="row mx-2 my-2">
          {courses.map((course) => (
            <div key={course.id}>
              <div className="row mx-2 my-2">
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
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Section;
