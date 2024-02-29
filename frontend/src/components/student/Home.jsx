import React, { useState, useEffect } from "react";
import CategoryFilter from "./CategoryFilter";
import SearchInput from "./SearchInput";
import { useNavigate, useLocation } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import CourseCard from "./CourseCard";
import Header from "../Header";
import Footer from "../Footer";
import { config } from "../../App";
import axios from "axios";
import { useUserData } from "../UserContext";
import "../../styles/Header.css";
import { useCookies } from "react-cookie";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../redux/actions/authActions";
import {
  fetchCoursesRequest,
  purchaseCourseRequest,
} from "../redux/actions/authActions";
const Home = ({ prop }) => {
  const navigate = useNavigate();
  const { role } = useUserData();
  const [cookies,setCookies] = useCookies(["username","role","icon"]);
  const username = cookies["username"];
  const icon=cookies["icon"]
  const [selectedCategory, setSelectedCategory] = useState("");
  const [purchased, setPurchased] = useState([]);
  const [instructor, setInstructor] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showFilteredCourses, setShowFilteredCourses] = useState(false);
  const [courses, setCourses] = useState([]);
  const [details, setDetails] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [purchasedLoaded, setPurchasedLoaded] = useState(false);
  const [selectedCourseDescription, setSelectedCourseDescription] =
    useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const fetchCourses = async () => {
    try {
      if (username) {
        const response = await axios.get(
          `${config.endpoint}/student/studentview`,
          {
            withCredentials: true,
          }
        );
        setCourses(response.data);
      } else {
        const response = await axios.get(
          `${config.endpoint}/student/publicview`
        );
        setCourses(response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handlePurchase = async (course) => {
    try {
      setSelectedCourse(course);
      const res = await axios.post(
        `${config.endpoint}/course/learningpurchase`,
        {
          course_name: course.name,
          course_description: course.description,
          video_url: course.video_url,
          username: username,
        }
      );

      if (res) {
        enqueueSnackbar("Purchased Course successfully", {
          variant: "success",
        });
        navigate("/course");
      }
      setSelectedCourse(null);
      setPurchasedCourses([...purchasedCourses, course]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCategorySelect = async (event) => {
    setSelectedCategory(event.target.value);
    if (username) {
      const res = await axios.get(`${config.endpoint}/course/filter`, {
        params: {
          category: event.target.value,
        },
        withCredentials: true,
      });
      if (res) {
        setFilteredCourses(res.data);
      }
    } else {
      const res = await axios.get(`${config.endpoint}/course/filter`, {
        params: {
          category: event.target.value,
        },
      });
      if (res) {
        setFilteredCourses(res.data);
      }
    }

    setShowFilteredCourses(true);
  };

  const addtoInstructor = async () => {
    try {
      const res = await axios.post(
        `${config.endpoint}/instructor/convertToInstructor`,{
          username:username
        });
      if (res.status === 201) {
        enqueueSnackbar("You are now an Instructor", { variant: "info" });
        setCookies("role",["student","instructor"])
       navigate("/instructor")
        
      } else if (res.status === 299) {
        enqueueSnackbar("You are already an instructor", { variant: "info" });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const checkInstructor = async () => {
    try {
      const resp = await axios.get(`${config.endpoint}/instructor/isInstructor`, {
        withCredentials: true,
      });
      if (resp.status === 201) {
        setInstructor(true);
      } else if (resp.status === 202) {
        setInstructor(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const purchase = (course) => {
    return (
      <>
        {username ? (
          <>
            <div>
              {purchased.some((item) => item.course_name === course.name) ? (
                <button className="prch" disabled>
                  Already purchased
                </button>
              ) : (
                <button className="prch" onClick={() => handlePurchase(course)}>
                {icon?(<>Learn Course</>):(<>Purchase course</>)}
                </button>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  const handleSearch = async () => {
    if (searchQuery.trim() !== "") {
      const response = await axios.get(`${config.endpoint}/course/search`, {
        params: { query: searchQuery },
        withCredentials: true,
      });
      setSearchResults(response.data);
    }
  };

  useEffect(() => {
    if (username) {
      const fetchPurchased = async () => {
        try {
          const res = await axios.get(`${config.endpoint}/course/learning`, {
            withCredentials: true,
          });
          if (res.status === 200) {
            setPurchased(res.data);
            setPurchasedLoaded(true);
          }
        } catch (error) {
          console.log("error", error);
        }
      };
      fetchPurchased();
      checkInstructor(username);
    }
    fetchCourses(username);
  }, []);

  return (
    <>
      <div>
        <>
          <>
            <Header prop={prop}>
              <CategoryFilter
                selectedCategory={selectedCategory}
                handleCategorySelect={handleCategorySelect}
              />
              <SearchInput
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
              />
            </Header>
          </>
          <div className="row mx-2 my-2">
            {showFilteredCourses ? (
              <div className="product-card">
                {filteredCourses.map((course) => (
                  <div key={course.id}>
                    <div className="card card">
                      <CourseCard
                        classname={"imgBx"}
                        src={course.video_url}
                        alt={"Image"}
                        h5class={"card-title"}
                        h5style={{ marginLeft: "5px" }}
                        name={course.name}
                        parastyle={{ marginLeft: "5px" }}
                        price={course.price}
                      />
                      <div>
                        {selectedCourseDescription === course.name ? (
                          <div classname="slct-description">
                            <p className="ptext">{course.description} </p>
                          </div>
                        ) : (
                          <button
                            className="det mb-4 slct"
                            onClick={() =>
                              setSelectedCourseDescription(course.name)
                            }
                          >
                            More Details
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      {username? (
                        !purchased.some(
                          (item) => item.course_name === course.name
                        ) ? (
                          <button
                            className="prch"
                            onClick={() => handlePurchase(course)}
                          >
                            {icon?(<>Learn Course</>):(<>Purchase course</>)}
                          </button>
                        ) : (
                          <button className="prch" disabled>
                            Already Purchased
                          </button>
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {searchResults.length > 0 ? (
                  <div className="product-card">
                    {searchResults.map((course) => (
                      <div key={course.id}>
                        <div className=" card">
                          <CourseCard
                            classname={"imgBx"}
                            src={course.video_url}
                            alt={"Image"}
                            h5class={"card-title"}
                            h5style={{ marginLeft: "5px" }}
                            name={course.name}
                            parastyle={{ marginLeft: "5px" }}
                            price={course.price}
                          />
                        </div>
                        {purchase(course)}
                      </div>
                    ))}
                  </div>
                ) : searchQuery.trim() !== "" ? (
                  <p>No courses found</p>
                ) : (
                  <>
                    {!details && (
                      <h3 style={{ textAlign: "center !important" }}>
                        Welcome {username}
                      </h3>
                    )}
                    {!details && (
                      <div className="product-card">
                        {courses.map((course) => (
                          <div key={course.id}>
                            <div className="card card">
                              <CourseCard
                                classname={"imgBx"}
                                src={course.video_url}
                                alt={"Image"}
                                h5class={"card-title"}
                                h5style={{ marginLeft: "5px" }}
                                name={course.name}
                                parastyle={{ marginLeft: "5px" }}
                                price={course.price}
                              />

                              {selectedCourseDescription === course.name ? (
                                <div classname="slct-description">
                                  <p className="ptext">{course.description} </p>
                                </div>
                              ) : (
                                <button
                                  className="det mb-4 slct"
                                  onClick={() =>
                                    setSelectedCourseDescription(course.name)
                                  }
                                >
                                  More Details
                                </button>
                              )}
                              {purchase(course)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <center>
            {username && (
              <div className="btm">
                {instructor ? (
                  <button
                    className="btn mx-2 my-sm-0 title"
                    onClick={() => navigate("/instructor")}
                  >
                    Switch to Instructor view
                  </button>
                ) : (
                  <>
                    <button
                      className="btn mx-2 my-sm-0 title"
                      onClick={() => {
                        addtoInstructor();
                        
                      }}
                    >
                      Want to be an Instructor?
                    </button>
                  </>
                )}
              </div>
            )}
          </center>
          <Footer />
        </>
      </div>
    </>
  );
};
export default Home;
