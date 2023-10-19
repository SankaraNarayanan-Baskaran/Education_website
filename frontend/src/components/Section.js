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
  const [learn,setLearn]=useState({});
  const [edit,setEdit]=useState(false);
  const[update,setUpdate]=useState(false);
  const [editSection, setEditSection] = useState({
    section_name: "",
    
    img_url: "",
   
    sectionId:""
  });
const [students,setStudents]=useState({});
  useEffect(() => {
    // Fetch all courses when the component mounts
    fetchcourses();
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
  const updateSection=async()=>{
    try {
      
      const response=await axios.post(`${config.endpoint}/updateSection`,editSection)
      setEditSection({
        section_name: "",
       
        img_url: "",
 
        sectionId:""
      })
    } catch (error) {
      console.log("error:",error);
    }
  }

  const fetchsections=async (courseId)=>{
    try {
      const response=await axios.get(`${config.endpoint}/section`,{
        params:{
          course_id:courseId
        }
      })
      setSections(response.data);
    } catch (error) {
      console.log("error",error)
    }
  }
  const fetchcourses = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/courses`, {
        params: {
          username: username,
        },
      });
      console.log("Response Data:", response.data);
      setCourses(response.data);
      console.log("Courses:", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const learners=async(courseId)=>{
    const response=await axios.get(`${config.endpoint}/learners`,{
      params:{
        course_id:courseId
      }
    })
    if(response){
      setLearn({
        ...learn,
        [courseId]: response.data.length,
        
    })
    setStudents({
      ...students,[courseId]:response.student_name
    })
    console.log("Response:",response[0])
    console.log("Learn:",learn[courseId]);
    console.log("Students:",students[courseId]);
   
  }}
useEffect(()=>{
  courses.forEach((course) => {
      learners(course.id)
  });
},[courses])
  return (
    <div>
      {/* <Header isAuthorised={false} prop student /> */}

      <div className="mx-2 my-3">
        <div className="my-2 mx-2"></div>
        {
          update?(<>
            <center>
                <div className="section-container">
                <h5>Update Section</h5>
                  <div className="input-container">
                    
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={editSection.img_url}
                      onChange={(e) =>
                        setEditSection({
                          ...editSection,
                          img_url: e.target.value,
                        })
                      }
                    />
                   
                    <center>
                      <button
                        className="section-button my-4"
                        onClick={() => {
                          updateSection();
                          enqueueSnackbar(`Section:${editSection.section_name}Updated`, {
                            variant: "success",
                          });
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
          </>):(<>
            {
          edit?(<>
            <div className="row mx-2 my-2">
         
              {sections.map((section) => (
                
                <div key={section.id}>
                  <div className="row mx-2">
                    <div
                      className="card mb-3 "
                      style={{ width: "18rem", height: "22rem" }}
                    >
                      <img
                        src={section.img_url}
                        alt="Image"
                        width="100%"
                        height="200px"
                      />
                      <div class="card-body">
                        <h5 class="card-title">{section.section_name}</h5>
                        <p>{section.section_description}</p>
                        <button onClick={()=>{
                          setEditSection({...editSection,sectionId:section.id})
                          
                          setUpdate(true);
                        }}>Edit</button>

                      </div>
                      
                      
                    
                    </div>
                    <div></div>
                  </div>
                </div>
              ))}
            </div>
          </>):(<>
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
           
              {courses.map((course) => (
                
                <div key={course.id}>
                  <div className="row mx-2">
                    <div
                      className="card mb-3 course-card "
                      style={{ width: "18rem", height: "22rem" }}
                    >
                      <img
                        src={course.video_url}
                        alt="Image"
                        width="100%"
                        height="200px"
                      />
                      <div class="card-body">
                        <h5 class="card-title">{course.name}</h5>
                        <button onClick={()=>{
                          setEdit(true);
                          fetchsections(course.id);
                        }}>Edit Section</button>
                      </div>
                      <h6 onMouseOver={()=>{
                        console.log(students.student_name);
                      }}>Students Enrolled:{learn[course.id]}</h6>
                      <button
                        onClick={() => {
                          setnewSection({...newSection,course_name:course.name})
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
          </>)
        }
          </>)
        }
        
        
      </div>
    </div>
  );
};

export default Section;
