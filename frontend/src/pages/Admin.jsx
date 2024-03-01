import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { config } from "../App";
import ChartComponent from "../components/admin/Chart";
import Header from "../components/Header";
import BarGraph from "../components/admin/Bar";
import { enqueueSnackbar } from "notistack";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {useCookies} from "react-cookie";
import "react-pro-sidebar/dist/css/styles.css";
import Manage from "../components/admin/Manage";
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
import ".././components/admin/styles/Admin.css";
import { useUserData } from "../components/UserContext";
import parseJwt from "../components/Decode";
import { useNavigate } from "react-router-dom";
const Admin = ({prop}) => {
  const studentListRef = useRef();
  const [cookies,removeCookies,setCookies]=useCookies(['username','type','role','logged','jwtToken','studentname','icon'])
  const navigate=useNavigate();
  const { token, setToken,role} = useUserData();
  const decodedToken = parseJwt(token);
  const instructorListRef = useRef();
  const pendingRef = useRef();
  const instructorCourseRef = useRef();
  const [isStudentListRendered, setIsStudentListRendered] = useState(false);
  const [isInstructorListRendered, setIsInstructorListRendered] =
    useState(false);
  const [isPendingRendered, setIsPendingListRendered] = useState(false);
  const [isInstructorCoursesRendered, setIsInstructorCoursesRendered] =
    useState(false);
  const [studentList, setStudentList] = useState([]);
  const [pending, setPending] = useState([]);
  const [approve, setApprove] = useState(false);
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [courseView, setCourseView] = useState(false);
  const [instCourse, setInstCourse] = useState(false);
  const [studentCourse, setStudentCourse] = useState(false);
  const [instructorCourse, setInstructorCourse] = useState(false);
  const [student, setStudent] = useState(false);
  const [instructor, setInstructor] = useState(false);
  const [addpeople, setAddpeople] = useState(false);
  const [courses, setCourses] = useState([]);
  const [instcourses, setInstCourses] = useState([]);
  const [instructorList, setInstructorList] = useState([]);
  const icon=cookies["icon"]
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile)
    setFile(selectedFile);
  };
  useEffect(() => {
    if (isStudentListRendered && studentListRef.current) {
      studentListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isStudentListRendered]);

  useEffect(() => {
    if (isInstructorListRendered && instructorListRef.current) {
      instructorListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isInstructorListRendered]);

  useEffect(() => {
    if (isPendingRendered && pendingRef.current) {
      pendingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isPendingRendered]);

  useEffect(() => {
    if (isInstructorCoursesRendered && instructorCourseRef.current) {
      instructorCourseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isInstructorCoursesRendered]);

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("csvFile", file);
      console.log(formData.get("csvFile"));
      console.log(formData);
      for (const entry of formData.entries()) {
        console.log(entry);
    }
      try {
        const response = await axios.post(
          `${config.endpoint}/admin/upload-csv`,
          formData,{
            headers: {
              "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
          }
          
      );
     
        if (response.status===200) {
          enqueueSnackbar("Data inserted successfully",{variant:"success"})
        }
      } catch (error) {
        console.error("Error uploading CSV file:", error);
      }
    }
  };
  const studentData = async (username) => {
    try {
      const response = await axios.get(`${config.endpoint}/admin/studentinfo`, {
        withCredentials: true,
      });
      if (response) {
       
        // const studentNames = response.data.map((student) => student.username);

        setStudentList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleManage=async (name)=>{
    try {
      setCookies("studentname",`${name}`);
      localStorage.setItem("studentname",name);
      navigate(`/${name}/manage`);
    } catch (error) {
      console.log(error);
    }
  }

  const instructorData = async (username) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/admin/instructorinfo`,
        {
          withCredentials: true,
        }
      );
      if (response) {
        setInstructorList(response.data);
       
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  const handleRemoveUser = async (id) => {
    try {
      const response = await axios.delete(
        `${config.endpoint}/admin/user/${id}`
      );
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
        `${config.endpoint}/admin/instructor/${id}`
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
        `${config.endpoint}/admin/managecourses/${id}`
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
        `${config.endpoint}/admin/manageinstcourses/${id}`
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
      const response = await axios.get(`${config.endpoint}/admin/pending`, {
        withCredentials: true,
      });
      if (response) {
        setPending(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStudentCourse = async () => {
    try {
      const response = await axios.get(
        `${config.endpoint}/admin/studentcourses`,
        {
          withCredentials: true,
        }
      );
      if (response) {
        setCourses(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInstructorCourse = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/admin/instcourses`, {
        withCredentials: true,
      });
      if (response) {
        setInstCourses(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async (username) => {
    try {
      const response = await axios.get(`${config.endpoint}/admin/data`, {
        withCredentials: true,
      });

      if (response && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproveCourse = async (courseId) => {
    try {
      const response = await axios.put(
        `${config.endpoint}/admin/courses/${courseId}/approve`
      );

      if (response.status === 200) {
        setTimeout(window.location.reload(),1000);
        enqueueSnackbar("Course approved", { variant: "success" });
      }
    } catch (error) {
      console.error("Error approving a Course:", error);
    }
  };
  useEffect(() => {
    const username = cookies["username"]
    studentData(username);
    instructorData(username);
    fetchData(username);
  }, []);

  useEffect(() => {
    const user = cookies["username"]
    fetchPendingCourses(user);
  }, []);
  return (
    <>
      <div className="container-fluid">
        {role.includes("admin") ? (
          <>
          <Header isAuthorised={false} prop student  admin/>
            {" "}
            <div className="row">
              <div className="col-lg-3">
                <ProSidebar
                 className="side-bar"
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
                          setIsStudentListRendered(true);
                        }}
                        icon={<FontAwesomeIcon icon={faGraduationCap} />}
                      >
                        Student List
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setInstructor(true);
                          setIsInstructorListRendered(true);
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
                        onClick={() => {
                          setStudentCourse(true);
                          handleStudentCourse();
                        }}
                        icon={<FontAwesomeIcon icon={faBook} />}
                      >
                        Student Courses
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setInstructorCourse(true);
                          handleInstructorCourse();
                          setIsInstructorCoursesRendered(true);
                        }}
                        icon={<FontAwesomeIcon icon={faChalkboardUser} />}
                      >
                        Instructor Courses
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setApprove(true);
                          setIsPendingListRendered(true);
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
                        <h3>{data.length}</h3>
                        <h4>PURCHASES</h4>
                      </div>
                      <div id="spark3"></div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="box box4">
                      <div class="details">
                        <h3>{studentList.length}</h3>
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
                        <div
                          ref={isStudentListRendered ? studentListRef : null}
                        >
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
                                        handleManage(student.username);
                                        
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
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <></>

                    {instructor ? (
                      <>
                        <div
                          ref={
                            isInstructorListRendered ? instructorListRef : null
                          }
                        >
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
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <></>
                    {approve ? (
                      <>
                        <div ref={isPendingRendered ? pendingRef : null}>
                          {pending.length > 0 ? (
                            <>
                              <h3>Pending Courses for Approval</h3>
                              <ul>
                                {pending.map((course) => (
                                  <li key={course.id}>
                                    {course.name} -{" "}
                                    <button
                                      onClick={() =>
                                        handleApproveCourse(course.id)
                                      }
                                    >
                                      Approve
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <>
                              <br></br>
                              <h5>Pending Courses for Approval:</h5>
                              <p>No courses to approve</p>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    {studentCourse ? (
                      <>
                        {
                          <ul>
                            {courses.map((course) => (
                              <li key={course.id}>{course.name} - </li>
                            ))}
                          </ul>
                        }
                      </>
                    ) : (
                      <></>
                    )}

                    {instructorCourse ? (
                      <>
                        <div
                          ref={
                            isInstructorCoursesRendered
                              ? instructorCourseRef
                              : null
                          }
                        >
                          {
                            <>
                              <table>
                                <thead>
                                  <th></th>
                                </thead>
                              </table>
                              <ul>
                                {instcourses.map((course) => (
                                  <li key={course.id}>{course.name} - </li>
                                ))}
                              </ul>
                            </>
                          }
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>{navigate("/unauthorized")}</>
        )}
      </div>
    </>
  );
};

export default Admin;
