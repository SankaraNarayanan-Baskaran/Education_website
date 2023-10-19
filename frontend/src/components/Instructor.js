import React, { useState, useEffect } from "react";
import Header from "./Header";
import VideoInput from "./VideoInput";
import "./Instructor.css";
import Footer from "./Footer";
import UploadCourse from "./UploadCourse";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../App";
import VideoPlayer from "./Video";
import { enqueueSnackbar } from "notistack";
import Section from "./Section";
const Instructor = () => {
  const username = localStorage.getItem("username");
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
    price: "",
    video_url: "",
    username: username,
  });
  const handleAddCourse = async () => {
    try {
      console.log("INST:", newCourse);
      await axios.post(`${config.endpoint}/courses`, newCourse);
      setNewCourse({ name: "", description: "", price: "", video_url: "" });
      fetchcourses();
    } catch (error) {
      console.error("Error adding a Course:", error);
    }
  };
  const addToStudent = async () => {
    try {
      const res = await axios.post(`${config.endpoint}/convert`, {
        name: username,
      });
      console.log(res);
      if (res.status === 201) {
        enqueueSnackbar("You are now a Student", { variant: "info" });
      } else if (res.status === 299) {
        enqueueSnackbar("You are already a student", { variant: "info" });
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

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
  const queryParams = {
    username: username,
  };

  const handleSelect = async (courseid) => {
    try {
      console.log(courseid);
      const response = await axios.get(`${config.endpoint}/learners`, {
        params: { username: username, course_id: courseid },
      });
      console.log(response.data);
      setCourses(response.data);
      console.log("Courses:", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchcourses = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/student`, {
        params: queryParams,
      });
      console.log("Response:", response.data);
      setCourses(response.data);
      console.log("Courses:", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  
  useEffect(() => {
    // Fetch all courses when the component mounts
    fetchcourses();
  }, []);
  const handleCreateCourse = () => {
    return <div></div>;
  };

  return (
    <div>
      <Header isAuthorised={false} prop student instr/>
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

          {/* {fetchcourses()} */}
        </div>

        {isSelected ? (
          <>
            <div className="mx-2">
              <center>
                <form className="form-container">
                  <h5>Course Structure Details:</h5>
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Name"
                      value={newCourse.name}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, name: e.target.value })
                      }
                    />

                    <input
                      type="text"
                      placeholder="Description"
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={newCourse.price}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, price: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={newCourse.video_url}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          video_url: e.target.value,
                        })
                      }
                    />
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
        <button
          style={{
            marginBottom: "12px",
          }}
          class="btn mx-2 my-sm-0 "
          onClick={() => {
            addToStudent();
          }}
        >
          Want to be a Student?
        </button>
      </center>

      <Footer />
    </div>
  );
};

export default Instructor;
