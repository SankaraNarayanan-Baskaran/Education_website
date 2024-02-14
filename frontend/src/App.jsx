import "./App.css";
import { Routes, Route, Router } from "react-router-dom";
import Home from "./components/student/Home"
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import CourseDetails from "./components/student/CourseDetails";
import Instructor from "./components/instructor/Instructor";
import UploadCourse from "./components/UploadCourse";
import Course from "./components/student/Course";
import Section from "./components/instructor/Section";
import { SnackbarProvider } from "notistack";
import StudentsList from "./components/instructor/StudentsList";
import Quiz from "./components/Quiz";
import BarGraph from "./components/admin/Bar";
import { FormDataProvider } from "./components/FormContext";
import { UsernameDataProvider } from "./components/UserContext";
import PrivateWrapper from "./components/PrivateRoute";
import "resize-observer-polyfill";
import { CourseProvider } from "./components/CourseContext";
import Unauthorized from "./components/Unauthorized";
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
                    
                      <CourseDetails />
                  }
                />
              
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/uploadcourse" element={<UploadCourse />} />
                <Route path="/course" element={<Course/>}/>

                <Route
                  path="/section"
                  element={
                  
                      <Section />
            
                  }
                />
              
                <Route
                  path="/instructor/:courseName/students"
                  element={
                    
                      <StudentsList />
                   
                  }
                />
            
                <Route path="/course/:course/quiz" element={<Quiz />} />
                <Route
                  path="/instructor"
                  element={
                    
                      <Instructor />
                   
                  }
                />
                <Route
                  path="/admin"
                  element={
                   
                      <Admin/>
                  }
                />
              
                <Route path="/bar" element={<BarGraph />} />
              </Routes>
            </CourseProvider>
          </FormDataProvider>
        </UsernameDataProvider>
      </SnackbarProvider>
    </div>
  );
}

export default App;
