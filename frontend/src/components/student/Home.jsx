import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { fetchCoursesRequest, fetchCoursesSuccess, fetchCoursesFailure } from "../redux/actions/courseActions";
import CategoryFilter from "./CategoryFilter";
import SearchInput from "./SearchInput";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import CourseCard from "./CourseCard";
import Header from "../Header";
import Footer from "../Footer";
import { config } from "../../App";
import axios from "axios";
import { useUserData } from "../UserContext";
import "../../styles/Header.css";
import { useCookies } from "react-cookie";

const Home = ({prop, courses, loading, error, fetchCoursesRequest, fetchCoursesSuccess, fetchCoursesFailure}) => {
  const navigate = useNavigate();
  const { role } = useUserData();
  const [cookies, setCookies] = useCookies(["username", "icon", "inst"]);
  const username = cookies["username"];
  const icon = cookies["icon"];
  const inst = cookies["inst"];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [purchased, setPurchased] = useState([]);
  const [instructor, setInstructor] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showFilteredCourses, setShowFilteredCourses] = useState(false);
  const [details, setDetails] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [purchasedLoaded, setPurchasedLoaded] = useState(false);
  const [selectedCourseDescription, setSelectedCourseDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchCoursesRequest();

    const fetchCourses = async () => {
      try {
        if (username) {
          const response = await axios.get(`${config.endpoint}/student/studentview`,{withCredentials: true,});
          fetchCoursesSuccess(response.data);
          console.log("COurses:",courses);
        console.log("Response:",response.data);
        } else {
          const response = await axios.get(`${config.endpoint}/student/publicview`);
          fetchCoursesSuccess(response.data);
          console.log("COurses:",courses);
        console.log("Response:",response.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        fetchCoursesFailure(error.message);
      }
    };
    
    fetchCourses();
    
  }, []);

  const handlePurchase = async (course) => {
    try {
      setSelectedCourse(course);
      const res = await axios.post(`${config.endpoint}/course/learningpurchase`, {
        course_name: course.name,
        course_description: course.description,
        video_url: course.video_url,
        username: username,
      });

      if (res) {
        enqueueSnackbar("Purchased Course successfully", { variant: "success" });
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
    try {
      const res = await axios.get(`${config.endpoint}/course/filter`, { params: { category: event.target.value }, withCredentials: !!username });
      if (res) {
        setFilteredCourses(res.data);
      }
    } catch (error) {
      console.error("Error filtering courses:", error);
    }
    setShowFilteredCourses(true);
  };

  const addtoInstructor = async () => {
    try {
      const res = await axios.post(`${config.endpoint}/instructor/convertToInstructor`, { username: username });
      if (res.status === 201) {
        enqueueSnackbar("You are now an Instructor, please logout and login to continue", { variant: "info" });
        setCookies("inst", "true");
      } else if (res.status === 299) {
        enqueueSnackbar("You are already an instructor", { variant: "info" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const checkInstructor = async () => {
    try {
      const resp = await axios.get(`${config.endpoint}/instructor/isInstructor`, { withCredentials: true });
      if (resp.status === 201) {
        setInstructor(true);
      } else if (resp.status === 202) {
        setInstructor(false);
      }
    } catch (error) {
      console.error("Error checking instructor status:", error);
    }
  };

  const purchase = (course) => {
    return (
      <>
        {username && !purchased.some((item) => item.course_name === course.name) ? (
          <button className="prch" onClick={() => handlePurchase(course)}>{icon ? <>Start Learning</> : <>Purchase course</>}</button>
        ) : (
          <button className="prch" onClick={() => { setCookies("courseid", course.id); navigate("/courseDetails"); }}>Continue learning</button>
        )}
      </>
    );
  };

  const handleSearch = async () => {
    if (searchQuery.trim() !== "") {
      try {
        const response = await axios.get(`${config.endpoint}/course/search`, { params: { query: searchQuery }, withCredentials: !!username });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching for courses:", error);
      }
    }
  };

  useEffect(() => {
    if (username) {
      const fetchPurchased = async () => {
        try {
          const res = await axios.get(`${config.endpoint}/course/learning`, { withCredentials: true });
          if (res.status === 200) {
            setPurchased(res.data);
            setPurchasedLoaded(true);
          }
        } catch (error) {
          console.error("Error fetching purchased courses:", error);
        }
      };
      fetchPurchased();
      checkInstructor();
    }
  }, []);

  return (
    <>
      <div>
        <Header prop={prop}>
          <CategoryFilter selectedCategory={selectedCategory} handleCategorySelect={handleCategorySelect} />
          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
        </Header>
        <div className="row mx-2 my-2">
          {showFilteredCourses ? (
            <div className="product-card">
              {filteredCourses.map((course) => (
                <div key={course.id}>
                  <div className="card card">
                    <CourseCard classname={"imgBx"} src={course.video_url} alt={"Image"} h5class={"card-title"} h5style={{ marginLeft: "5px" }} name={course.name} parastyle={{ marginLeft: "5px" }} price={course.price} />
                    <div>
                      {selectedCourseDescription === course.name ? (
                        <div classname="slct-description">
                          <p className="ptext">{course.description}</p>
                        </div>
                      ) : (
                        <button className="det mb-4 slct" onClick={() => setSelectedCourseDescription(course.name)}>More Details</button>
                      )}
                    </div>
                  </div>
                  <div>
                   
                  {purchase(course)}
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
                        <CourseCard classname={"imgBx"} src={course.video_url} alt={"Image"} h5class={"card-title"} h5style={{ marginLeft: "5px" }} name={course.name} parastyle={{ marginLeft: "5px" }} price={course.price} />
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
                    <h3 style={{ textAlign: "center !important" }}>Welcome {username}</h3>
                  )}
                  {!details && (
                    <div className="product-card">
                      {courses.map((course) => (
                        <div key={course.id}>
                          <div className="card card">
                            <CourseCard classname={"imgBx"} src={course.video_url} alt={"Image"} h5class={"card-title"} h5style={{ marginLeft: "5px" }} name={course.name} parastyle={{ marginLeft: "5px" }} price={course.price} />

                            {selectedCourseDescription === course.name ? (
                              <div classname="slct-description">
                                <p className="ptext">{course.description}</p>
                              </div>
                            ) : (
                              <button className="det mb-4 slct" onClick={() => setSelectedCourseDescription(course.name)}>More Details</button>
                            )}
                            {username&& <>  {purchase(course)}</>}
                         
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
                <>
                  <button className="btn mx-2 my-sm-0 title" onClick={() => navigate("/instructor")}>Switch to Instructor view</button>
                </>
              ) : (
                <>
                  <button className="btn mx-2 my-sm-0 title" onClick={() => { addtoInstructor(); }}>Want to be an Instructor?</button>
                </>
              )}
            </div>
          )}
        </center>
        <Footer />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    courses: state.courseReducer ? state.courseReducer.courses : [],
    loading: state.courseReducer ? state.courseReducer.loading : false,
    error: state.courseReducer ? state.courseReducer.error : null,
  };
};

const mapDispatchToProps = {
  fetchCoursesRequest,
  fetchCoursesSuccess,
  fetchCoursesFailure,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
