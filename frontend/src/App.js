import logo from "./logo.svg";
import "./App.css";
import { ReactDOM } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import CourseDetails from "./components/CourseDetails";
import Instructor from "./components/Instructor";
import UploadCourse from "./components/UploadCourse";
import Course from "./components/Course";
export const config = {
  endpoint: `http://localhost:3001/api`,
};
function App() {
  
  return (
    <div >
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/coursedetails" element={<CourseDetails/>}/>
        <Route path="/instructor" element={<Instructor/>}/>
        <Route path="/uploadcourse" element={<UploadCourse/>}/>
        <Route path="/course" element={<Course/>}/>
      </Routes>
    </div>
  );
}

export default App;



