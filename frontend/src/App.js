import logo from "./logo.svg";
import "./App.css";
import { ReactDOM } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Register from "./components/Register";
import CourseDetails from "./components/CourseDetails";
import Instructor from "./components/Instructor";
import UploadCourse from "./components/UploadCourse";
import Course from "./components/Course";
import Section from "./components/Section";
import { SnackbarProvider } from "notistack";
import StudentsList from "./components/StudentsList";
import Feedback from "./components/Feedback";
import Quiz from "./components/Quiz";
export const config = {
  endpoint: `http://localhost:3001/api`,
};
function App() {
  const courseName=localStorage.getItem("courseName");
  const course=localStorage.getItem("COURSE")
  return (
    <div className="font-color font" >
    <SnackbarProvider>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<Home />} />
        <Route path="/coursedetails" element={<CourseDetails/>}/>
        <Route path="/instructor" element={<Instructor/>}/>
        <Route path="/uploadcourse" element={<UploadCourse/>}/>
        <Route path="/course" element={<Course/>}/>
        <Route path="/section" element={<Section/>}/>
        <Route path="/instructor/:courseName/students" element={<StudentsList/>}/>
        <Route path="/course/:course/quiz" element={<Quiz/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/feedback" element={<Feedback/>}/>
      </Routes>
      </SnackbarProvider>
    </div>
  );
}

export default App;



