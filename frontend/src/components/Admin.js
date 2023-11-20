import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../App";
import ChartComponent from "./Chart";
import Header from "./Header";
import BarGraph from "./Bar";
import { enqueueSnackbar } from "notistack";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  faAdd,
  faBook,
  faChalkboardTeacher,
  faChalkboardUser,
  faFolderOpen,
  faFolderPlus,
  faFolderTree,
  faGem,
  faGraduationCap,
  faHeart,
  faListCheck,
  faPersonCircleCheck,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import "@fontawesome/fontawesome-free/css/all.min.css";
import "./Admin.css";
const Admin = () => {
  const [studentList, setStudentList] = useState([]);
  const [pending, setPending] = useState([]);
  const [approve, setApprove] = useState(false);
  const [file, setFile] = useState(null);
  const [courseView, setCourseView] = useState(false);
  const [instCourse, setInstCourse] = useState(false);
  const [studentCourse,setStudentCourse]=useState(false);
  const [instructorCourse,setInstructorCourse]=useState(false)
  const [student, setStudent] = useState(false);
  const [instructor, setInstructor] = useState(false);
  const [addpeople, setAddpeople] = useState(false);
  const [courses, setCourses] = useState([]);
  const [instcourses, setInstCourses] = useState([]);
  const [instructorList, setInstructorList] = useState([]);
  const username = localStorage.getItem("username");
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("csvFile", file);
      console.log(formData.get("csvFile"));
      try {
        const response = await axios.post(
          `${config.endpoint}/upload-csv`,
          formData
        );
        if (response.ok) {
          alert("CSV file uploaded and data inserted successfully.");
        }
      } catch (error) {
        console.error("Error uploading CSV file:", error);
      }
    }
  };
  const studentData = async (username) => {
    try {
      const response = await axios.get(`${config.endpoint}/studentinfo`, {
        params: {
          username: username,
        },
      });
      if (response) {
        console.log(response.data);
        // const studentNames = response.data.map((student) => student.username);

        setStudentList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const instructorData = async (username) => {
    try {
      const response = await axios.get(`${config.endpoint}/instructorinfo`, {
        params: {
          username: username,
        },
      });
      if (response) {
        // const instructorNames = response.data.map(
        //   (instructor) => instructor.name
        // );
        setInstructorList(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const handleRemoveUser = async (id) => {
    try {
      const response = await axios.delete(`${config.endpoint}/user/${id}`);
      if (response) {
        enqueueSnackbar("User removed", { variant: "success" });
        // window.location.reload()
        const newStudentList = studentList.filter(
          (student) => student.id !== id
        );
        setStudentList(newStudentList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveInst = async (id) => {
    try {
      const response = await axios.delete(
        `${config.endpoint}/instructor/${id}`
      );
      if (response) {
        enqueueSnackbar("Instructor removed", { variant: "success" });
        // window.location.reload()
        const newInstructorList = instructorList.filter(
          (instructor) => instructor.id !== id
        );
        setInstructorList(newInstructorList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleManageCourses = async (id) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/managecourses/${id}`
      );
      if (response) {
        console.log(response.data);
        setCourses(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInstructor = async (id) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/manageinstcourses/${id}`
      );
      if (response) {
        console.log(response.data);
        setCourses(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingCourses = async (username) => {
    try {
      const response = await axios.get(`${config.endpoint}/pending`, {
        params: {
          username: username,
        },
      });
      if (response) {
        console.log(response.data);
        setPending(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStudentCourse=async()=>{
    try {
      const response=await axios.get(`${config.endpoint}/studentcourses`,{
        params:{
          username:username
        }
      })
      if(response){
        setCourses(response.data)
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInstructorCourse=async()=>{
    try {
      const response=await axios.get(`${config.endpoint}/instcourses`,{
        params:{
          username:username
        }
      })
      if(response){
        setInstCourses(response.data)
    
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleApproveCourse = async (courseId) => {
    try {
      // Send a request to the server to approve the course
      const response = await axios.put(
        `${config.endpoint}/courses/${courseId}/approve`
      );

      if (response.status === 200) {
        enqueueSnackbar("Course approved", { variant: "success" });
      }
    } catch (error) {
      console.error("Error approving a Course:", error);
    }
  };
  useEffect(() => {
    const username = localStorage.getItem("username");
    studentData(username);
    instructorData(username);
  }, []);
  useEffect(() => {
    const user = localStorage.getItem("username");
    fetchPendingCourses(user);
  }, []);
  return (
    <>
      {/* <div><Header/></div> */}

      <div className="row">
        <div className="col-lg-3">
          <ProSidebar
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "100%",
            }}
          >
            <Menu iconShape="square">
              <MenuItem icon={<FontAwesomeIcon icon={faUser} />}>
                Dashboard
              </MenuItem>
              <SubMenu
                title="Manage users"
                icon={<FontAwesomeIcon icon={faFolderPlus} />}
              >
                <MenuItem
                  onClick={() => {
                    setStudent(true);
                  }}
                  icon={<FontAwesomeIcon icon={faGraduationCap} />}
                >
                  Student List
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setInstructor(true);
                  }}
                  icon={<FontAwesomeIcon icon={faChalkboardTeacher} />}
                >
                  Instructor List
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAddpeople(true);
                  }}
                  icon={<FontAwesomeIcon icon={faAdd} />}
                >
                  Add Student/Instructors
                </MenuItem>
              </SubMenu>
              <SubMenu
                title="Manage Courses"
                icon={<FontAwesomeIcon icon={faListCheck} />}
              >
                <MenuItem 
                onClick={()=>{
                  setStudentCourse(true)
                  handleStudentCourse();
                 
                }}
                icon={<FontAwesomeIcon icon={faBook} />}>
                  Student Courses
                </MenuItem>
                <MenuItem 
                onClick={()=>{
                  setInstructorCourse(true)
                  handleInstructorCourse();
                }}
                icon={<FontAwesomeIcon icon={faChalkboardUser} />}>
                  Instructor Courses
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setApprove(true);
                  }}
                  icon={<FontAwesomeIcon icon={faPersonCircleCheck} />}
                >
                  Approve Courses
                </MenuItem>
              </SubMenu>
            </Menu>
          </ProSidebar>
        </div>
        <div className="col-lg-9">
          <div class="row sparkboxes mt-4">
            <div class="col-md-3">
              <div class="box box1">
                <div class="details">
                  <h3>1213</h3>
                  <h4>SEARCHES</h4>
                </div>
                <div id="spark1"></div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="box box2">
                <div class="details">
                  <h3>422</h3>
                  <h4>VIEWS</h4>
                </div>
                <div id="spark2"></div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="box box3">
                <div class="details">
                  <h3>311</h3>
                  <h4>PURCHASES</h4>
                </div>
                <div id="spark3"></div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="box box4">
                <div class="details">
                  <h3>22</h3>
                  <h4>STUDENTS</h4>
                </div>
                <div id="spark4"></div>
              </div>
            </div>
          </div>

          <ChartComponent />
          <div>
            {addpeople ? (
              <>
                <h5>Add Instructors and Students</h5>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  style={{
                    border: "1px solid black",
                  }}
                />
                <button onClick={handleUpload}>Upload CSV</button>
              </>
            ) : (
              <></>
            )}

          
            <div>
              
              {student ? (
                <>
                  <h3>Student List</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Courses</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentList.map((student) => (
                        <tr>
                          <td>
                            {" "}
                            <p>{student.username}</p>
                          </td>
                          <td>
                            {" "}
                            <button
                              onClick={() => {
                                handleManageCourses(student.id);
                                setCourseView(true);
                              }}
                            >
                              Manage Courses
                            </button>{" "}
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                handleRemoveUser(student.id);
                              }}
                            >
                              Delete user
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <></>
              )}
              <></>

             
              {instructor ? (
                <>
                  <h3>Instructor List</h3>
                  <table>
                    {instructorList.map((instructor) => (
                      <tr>
                        <td>
                          {" "}
                          <p>{instructor.name}</p>
                        </td>
                        <td>
                          {" "}
                          <button
                            onClick={() => {
                              handleInstructor(instructor.id);
                              setInstCourse(true);
                            }}
                          >
                            Manage Courses
                          </button>{" "}
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              handleRemoveInst(instructor.id);
                            }}
                          >
                            Delete Instructor
                          </button>
                        </td>
                      </tr>
                    ))}
                  </table>
                </>
              ) : (
                <></>
              )}
              <></>
              {approve ? (
                <>
                  {pending.length > 0 ?(<><h3>Pending Courses for Approval</h3>
                      <ul>
                        {pending.map((course) => (
                          <li key={course.id}>
                            {course.name} -{" "}
                            <button
                              onClick={() => handleApproveCourse(course.id)}
                            >
                              Approve
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>):(<>
                      <p>No courses to approve</p>
                    </>) 
                    
                      
                  
                  }
                </>
              ) : (
                <>
                 
                </>
              )}
              {
                studentCourse?(<>
                  {
                    <ul>
                        {courses.map((course) => (
                          <li key={course.id}>
                            {course.name} -{" "}
                            
                          </li>
                        ))}
                      </ul>
                  }
                  
                </>):(<></>)
              }
              {
                instructorCourse?(<>
                  {
                    <ul>
                        {instcourses.map((course) => (
                          <li key={course.id}>
                            {course.name} -{" "}
                            
                          </li>
                        ))}
                      </ul>
                  }
                  
                </>):(<></>)
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
