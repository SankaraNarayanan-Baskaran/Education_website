import React, { useState, useEffect } from "react";
import Header from "../Header";
import "./styles/Instructor.css";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../App";
import VideoPlayer from "../Video";
import { enqueueSnackbar } from "notistack";
import Section from "./Section";
import { useUserData } from "../UserContext";
import parseJwt from "../Decode";
import { useCookies } from "react-cookie";
const Instructor = () => {
  const [cookies] = useCookies(["username"]);
  const username = cookies["username"];
  const { token, setToken } = useUserData();
  const {role}=useUserData();
  const decodedToken = parseJwt(token);
  const [student, setStudent] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    price: "",
    video_url: "",
    username: username,
    category: "",
    approved: false,
  });
  const handleAddCourse = async () => {
    try {
      const courseData = { ...newCourse };
      await axios.post(`${config.endpoint}/course/addcourse`, courseData);
      setNewCourse({
        name: "",
        description: "",
        price: "",
        video_url: "",
        approved: false,
      });
      fetchcourses();
    } catch (error) {
      console.error("Error adding a Course:", error);
    }
  };
  const addToStudent = async () => {
    try {
      const res = await axios.post(
        `${config.endpoint}/student/convertToStudent`,
        {
          withCredentials:true
        }
      );
      console.log(res);
      if (res.status === 201) {
        enqueueSnackbar("You are now a Student", { variant: "info" });
      } else if (res.status === 299) {
        enqueueSnackbar("You are already a student", { variant: "info" });
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const checkStudent = async () => {
    try {
      const resp = await axios.get(`${config.endpoint}/student/isStudent`, {
       withCredentials:true
      });

      if (resp.status === 201) {
        setStudent(true);
      } else if (resp.status === 202) {
        setStudent(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const username = cookies["username"];
    checkStudent(username);
  }, []);

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`${config.endpoint}/courses/${id}`);
      // Fetch the updated list of courses after deleting
      fetchcourses();
    } catch (error) {
      console.error("Error deleting a Course:", error);
    }
  };

  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  
  const renderInputField = (type, placeholder, value, onChange) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );

  const fetchcourses = async (username) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/inst/instructorview`,
        {
          withCredentials:true
        }
      );
      setCourses(response.data);
    } catch (error) {
      console.log(username)
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    // Fetch all courses when the component mounts
    const username = cookies["username"];
    fetchcourses(username);
  }, []);

  return (
    <>
    {
      role.includes("instructor")?(<><div>
      <>
        <Header isAuthorised={false} prop student instr />
        <center>
          <div className="mx-2 my-2 container">
            <h3>Jump into Course creation</h3>
            <button
              className="btn btn-outline-dark mx-6 mr-2 my-2 my-sm-0"
              onClick={() => {
                setIsSelected(true);
              }}
            >
              Create Your Course
            </button>
          </div>

          {isSelected ? (
            <>
              <div className="mx-2">
                <center>
                  <form className="form-container">
                    <h5>Course Structure Details:</h5>
                    <div className="input-container">
                      {renderInputField("text", "Name", newCourse.name, (e) =>
                        setNewCourse({ ...newCourse, name: e.target.value })
                      )}
                      {renderInputField(
                        "text",
                        "Description",
                        newCourse.description,
                        (e) =>
                          setNewCourse({
                            ...newCourse,
                            description: e.target.value,
                          })
                      )}

                      {renderInputField("text", "Price", newCourse.price, (e) =>
                        setNewCourse({ ...newCourse, price: e.target.value })
                      )}
                      {renderInputField(
                        "text",
                        "Image URL",
                        newCourse.video_url,
                        (e) =>
                          setNewCourse({
                            ...newCourse,
                            video_url: e.target.value,
                          })
                      )}
                      {renderInputField(
                        "text",
                        "Category",
                        newCourse.category,
                        (e) =>
                          setNewCourse({
                            ...newCourse,
                            category: e.target.value,
                          })
                      )}

                      <center>
                        <button
                          className="form-button my-3"
                          onClick={() => {
                            enqueueSnackbar("Course Created", {
                              variant: "success",
                            });
                            handleAddCourse();
                          }}
                        >
                          Add course
                        </button>
                      </center>
                    </div>
                  </form>
                </center>
              </div>
            </>
          ) : (
            <>
              <Section />
            </>
          )}
        </center>
        <center>
          <div className="mrg">
            {student ? (
              <>
                <button
                  class="btn mx-2 my-sm-0 title"
                  onClick={() => {
                    navigate("/student", { state: { isLogged: "true" } });
                  }}
                >
                  Switch to Student view
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn mx-2 my-sm-0 title"
                  onClick={() => {
                    addToStudent();
                    navigate("/", { state: { isLogged: "true" } });
                  }}
                >
                  Want to be a Student?
                </button>
              </>
            )}
          </div>
        </center>
        <Footer />
      </>
    </div></>):(<>
      {navigate("/unauthorized")}
    </>)
    }
    
    </>
  );
};

export default Instructor;