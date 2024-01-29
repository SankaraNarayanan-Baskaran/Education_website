import React, { useState, useEffect } from "react";
import CategoryFilter from "./CategoryFilter";
import SearchInput from "./SearchInput";
import { useNavigate, useLocation } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import CourseCard from "./CourseCard";
import Header from "./Header";
import Footer from "./Footer";
import { config } from "../App";
import axios from "axios";
import { useUserData } from "./UserContext";
const Home = ({ prop }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
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
  const [selectedCourseDescription, setSelectedCourseDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const fetchCourses = async (username) => {
    try {
      const response = await axios.get( `${config.endpoint}/student/studentview`,{
          params: { username: username,},}           
      );
      setCourses(response.data);
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
          student_name: username,
        }
      );

      if (res) {
        enqueueSnackbar("Purchased Course successfully", { variant: "success",  });
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
    const res = await axios.get(`${config.endpoint}/course/filter`, {
      params: {
        category: event.target.value,username: username,},
    });
    if (res) {
      setFilteredCourses(res.data);
    } 
    setShowFilteredCourses(true);
  };

  const addtoInstructor = async () => {
    try {
      const res = await axios.post(
        `${config.endpoint}/inst/convertToInstructor`,
        {
          name: username,
        }
      );
      if (res.status === 201) {
        enqueueSnackbar("You are now an Instructor", { variant: "info" });
      } else if (res.status === 299) {
        enqueueSnackbar("You are already an instructor", { variant: "info" });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const checkInstructor = async (username) => {
    try {
      const resp = await axios.get(`${config.endpoint}/inst/isInstructor`, { params: { name: username,}
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
const purchase=(course)=>{
   return (
    <>
      {username ? (
      <>
        {purchased.some(
          (item) => item.course_name === course.name
        ) ? (<button  className="prch" disabled>
            Already purchased
          </button>
        ) : (
          <button
            className="prch"
            onClick={() => handlePurchase(course)}
          >
            Purchase course
          </button>
        )}
      </>
    ) : (<></> )}
  </>
  )
}

  const handleSearch = async () => {
    if (searchQuery.trim() !== "") {
      const response = await axios.get(`${config.endpoint}/course/search`, { params: { query: searchQuery,},
      });
      setSearchResults(response.data);
    }
  };

  useEffect(() => {
    if (username) {
      const fetchPurchased = async () => {
        try {
          const res = await axios.get(`${config.endpoint}/course/learning`, {params: {username: username, },
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
    }
    fetchCourses(username);
    checkInstructor(username);
  }, []);

  return (
    <div>
      <>
        <>
          <Header prop={prop}>
            <CategoryFilter selectedCategory={selectedCategory} handleCategorySelect={handleCategorySelect}/>
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch}/>
          </Header>
        </>
        <div className="row mx-2 my-2">
          {showFilteredCourses ? (
            <div className="product-card">
              {filteredCourses.map((course) => (
                <div key={course.id}>
                  <div className="card mb-3 card">
                  <CourseCard 
                    classname={"imgBx"} src={course.video_url} alt={"Image"} h5class={"card-title"} h5style={{marginLeft: "5px"}}
                    name={course.name} parastyle={{ marginLeft: "5px"}} price={course.price} />
 
                      {selectedCourseDescription === course.name ? (
                        <div style={{ height: "60px" }}>
                          <p className="card-text ptext" >{course.description} </p>
                        </div>
                      ) : (
                        <button
                          className="slct det mb-4"
                          onClick={() =>
                            setSelectedCourseDescription(course.name)
                          }
                        >
                          More Details
                        </button>
                      )}
                      {username &&
                      !purchased.some(
                        (item) => item.course_name === course.name
                      ) ? (
                        <button
                          className="prch"
                          onClick={() => handlePurchase(course)}
                        >
                          Purchase course
                        </button>
                      ) : (<button className="prch" disabled>Already Purchased</button>)}
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
                      <div className="card mb-3 card">
                      <CourseCard 
                    classname={"imgBx"} src={course.video_url} alt={"Image"} h5class={"card-title"} h5style={{marginLeft: "5px"}}
                    name={course.name} parastyle={{ marginLeft: "5px"}} price={course.price}
                  />
                    {purchase(course)} 
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() !== "" ? (
                  <p>No courses found</p>
              ) : (
                <>
                  {!details && 
                    <h3 style={{ textAlign: "center !important" }}>
                      Welcome {username}
                    </h3>
                  }
                  {!details &&
                    <div className="product-card">
                      {courses.map((course) => (
                        <div key={course.id}>
                          <div className="card mb-3 card">
                             <CourseCard classname={"imgBx"} src={course.video_url} alt={"Image"} h5class={"card-title"} h5style={{marginLeft: "5px"}}
                             name={course.name} parastyle={{ marginLeft: "5px"}} price={course.price}/>
                  
                              {selectedCourseDescription === course.name ? (
                                <div style={{ height: "60px" }}>
                                <p className="card-text ptext" >{course.description} </p>
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
                  }
                </>
              )}
            </>
          )}
        </div>
        <center>
          {username && (
            <div style={{ marginBottom: "3%" }}>
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
                      navigate("/instructor");
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
  );
};
export default Home;
