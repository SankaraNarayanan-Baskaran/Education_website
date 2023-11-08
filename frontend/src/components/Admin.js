import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../App";
import Header from "./Header";
import { enqueueSnackbar } from "notistack";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { faGem, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import "@fontawesome/fontawesome-free/css/all.min.css";
const Admin = () => {
  const [studentList, setStudentList] = useState([]);
  const [pending, setPending] = useState([]);
  const [file, setFile] = useState(null);
  const [courseView, setCourseView] = useState(false);
  const [instCourse, setInstCourse] = useState(false);
  const [courses, setCourses] = useState([]);
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
        console.log(response.data)
        setPending(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproveCourse = async (courseId) => {
    try {
      // Send a request to the server to approve the course
      const response = await axios.put(
        `${config.endpoint}/courses/${courseId}/approve`
      );
  
      if (response.status === 200) {
        enqueueSnackbar("Course approved", { variant: "success" });
        const newPendingList = pending.filter(
          (course) => course.approved === true
        );
        setPending(newPendingList);
      }
    } catch (error) {
      console.error("Error approving a Course:", error);
    }}
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
      <div>
        {/* <ProSidebar style={{
      display:"flex",
      flexDirection:"row",
      width:"100%",
      height:"100%"
     }}>
        <Menu iconShape="square">
          <MenuItem icon={<FontAwesomeIcon icon={faGem} />}>Dashboard</MenuItem>
          <SubMenu title="Components" icon={<FontAwesomeIcon icon={faHeart} />}>
            <MenuItem>Component 1</MenuItem>
            <MenuItem>Component 2</MenuItem>
          </SubMenu>
        </Menu>
      </ProSidebar> */}
        <div>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload CSV</button>
          {courseView ? (
            <>
              <h3>Student Courses List</h3>
            </>
          ) : (
            <>
              <h3>Student List</h3>
            </>
          )}
          <div>
            <table>
              {courseView ? (
                <>
                  {courses && courses.length > 0 ? (
                    <>
                      {courses.map((course) => (
                        <div key={course.id}>
                          <h6>{course.course_name}</h6>
                        </div>
                      ))}
                      <div>
                        <button
                          onClick={() => {
                            setCourseView(false);
                          }}
                        >
                          Back Home
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>No courses to display</p>
                      <div>
                        <button
                          onClick={() => {
                            setCourseView(false);
                          }}
                        >
                          Back Home
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {studentList.map((student) => (
                    <div key={student.id}>
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
                    </div>
                  ))}
                </>
              )}
            </table>
            {instCourse ? (
              <>
                <h3>Instructor Courses List</h3>
              </>
            ) : (
              <>
                {" "}
                <h3>Instructor List</h3>
              </>
            )}

            {instCourse ? (
              <>
                {courses && courses.length > 0 ? (
                  <>
                    {courses.map((course) => (
                      <div key={course.id}>
                        <h6>{course.course_name}</h6>
                      </div>
                    ))}
                    <div>
                      <button
                        onClick={() => {
                          setCourseView(false);
                        }}
                      >
                        Back Home
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>No courses to display</p>
                    <div>
                      <button
                        onClick={() => {
                          setCourseView(false);
                          setInstCourse(false);
                        }}
                      >
                        Back Home
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {instructorList.map((instructor) => (
                  <div key={instructor.id}>
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
                  </div>
                ))}
              </>
            )}
            {pending.length > 0 && (
              <>
                <h3>Pending Courses for Approval</h3>
                <ul>
                  {pending.map((course) => (
                    <li key={course.id}>
                      {course.name} -{" "}
                      <button onClick={() => handleApproveCourse(course.id)}>
                        Approve
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
