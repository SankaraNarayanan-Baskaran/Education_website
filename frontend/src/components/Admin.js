import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../App";
import Header from "./Header";
import { enqueueSnackbar } from "notistack";
const Admin = () => {
  const [studentList, setStudentList] = useState([]);
  const [file, setFile] = useState(null);
  const [courseView, setCourseView] = useState(false);
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

  const instructorData = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/instructorinfo`);
      if (response) {
        const instructorNames = response.data.map(
          (instructor) => instructor.name
        );
        setInstructorList(instructorNames);
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
  useEffect(() => {
    const username = localStorage.getItem("username");
    studentData(username);
    instructorData();
  }, []);
  return (
    <>
      <Header />

      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
      <h3>Student List</h3>
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
                </>
              ) : (
                <p>No courses to display</p>
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
        {/* <h3>Instructor List</h3>
      {instructorList.map((instructor, index) => (
        <li key={index}>{instructor}</li>
      ))} */}
      </div>
    </>
  );
};

export default Admin;
