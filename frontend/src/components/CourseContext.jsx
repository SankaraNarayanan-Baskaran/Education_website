// CourseContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../App';// Adjust the path based on your project structure

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const [courses,setCourses]=useState([])
  const [courseProgress, setCourseProgress] = useState({});
  const [completedSections, setCompletedSections] = useState({});

  const fetchProgress = async (username, courseId) => {
    try {
      const response = await axios.get(`${config.endpoint}/course/getProgress`, {
        params: {
          username: username,
          course_id: courseId,
        },
      });

      if (response) {
        setCourseProgress((prevCourseProgress) => ({
          ...prevCourseProgress,
          [courseId]: response.data.progress,
        }));

        setCompletedSections((prevCompletedSections) => ({
          ...prevCompletedSections,
          [courseId]: response.data.Completed_Sections,
        }));
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  useEffect(() => {
    // Assuming you have a way to get the 'username' in your component
    const username = 'yourUsername';

    courses.forEach((course) => {
      fetchProgress(username, course.course_id);
    });
  }, [courses]);

  return (
    <CourseContext.Provider value={{ courseProgress, completedSections }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
