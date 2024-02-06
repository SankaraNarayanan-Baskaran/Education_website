import logo from "./logo.svg";
import "./App.css";
import { ReactDOM, useState } from "react";
import { Routes, Route, Router } from "react-router-dom";
import Sample from "./components/Sample";
import Home from "./components/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import CourseDetails from "./components/CourseDetails";
import Instructor from "./components/Instructor";
import UploadCourse from "./components/UploadCourse";
import Course from "./components/Course";
import Section from "./components/Section";
import { SnackbarProvider } from "notistack";
import StudentsList from "./components/StudentsList";

import Quiz from "./components/Quiz";
import BarGraph from "./components/Bar";
import { MyContext } from "./components/FormContext";
import withAuthentication from "./components/HOC";
import { useNavigate } from "react-router-dom";
import { FormDataProvider } from "./components/FormContext";
import { UsernameDataProvider } from "./components/UserContext";
import PrivateWrapper from "./components/PrivateRoute";
import "resize-observer-polyfill";
import { CourseProvider } from "./components/CourseContext";

import Unauthorized from "./components/Unauthorized";
import { BrowserRouter as Navigate } from "react-router-dom";
import Header from "./components/Header";
export const config = {
  endpoint: `http://localhost:3001/api`,
};
function App() {
  const courseName = localStorage.getItem("courseName");
  const course = localStorage.getItem("COURSE");

  return (
    <div className="font-color font">
      <SnackbarProvider>
        <UsernameDataProvider>
          <FormDataProvider>
            <CourseProvider>
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route
                  exact
                  path="/student"
                  element={
                    <PrivateWrapper roles="student">
                      <Home prop={true} />
                    </PrivateWrapper>
                  }
                />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/coursedetails"
                  element={
                    <PrivateWrapper roles="student">
                      <CourseDetails />
                    </PrivateWrapper>
                  }
                />
                {/* <Route path="/coursedetails" element={<CourseDetails/>}/> */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/uploadcourse" element={<UploadCourse />} />
                <Route
                  path="/course"
                  element={
                    <PrivateWrapper roles="student">
                      <Course />
                    </PrivateWrapper>
                  }
                />

                <Route
                  path="/section"
                  element={
                    <PrivateWrapper roles="instructor">
                      <Section />
                    </PrivateWrapper>
                  }
                />
                {/* <Route path="/section" element={<Section/>}/> */}
                <Route
                  path="/instructor/:courseName/students"
                  element={
                    <PrivateWrapper roles="instructor">
                      <StudentsList />
                    </PrivateWrapper>
                  }
                />
                {/* <Route path="/instructor/:courseName/students" element={<StudentsList/>}/> */}
                <Route path="/course/:course/quiz" element={<Quiz />} />
                <Route
                  path="/instructor"
                  element={
                    <PrivateWrapper roles="instructor">
                      <Instructor />
                    </PrivateWrapper>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <PrivateWrapper roles="admin">
                      <Admin />
                    </PrivateWrapper>
                  }
                />
              
                <Route path="/bar" element={<BarGraph />} />
                <Route path="/sample" element={<Sample />} />
              </Routes>
            </CourseProvider>
          </FormDataProvider>
        </UsernameDataProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
