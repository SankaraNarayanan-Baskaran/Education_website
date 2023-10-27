import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../App';

const StudentsList = () => {
  const [list, setList] = useState([]); // Initialize list as an array

  const studentList = async (courseName) => {
    try {
      const response = await axios.get(`${config.endpoint}/${courseName}/students`, {
        params: {
          courseName: courseName
        }
      });

      if (response) {
        const studentNames = response.data.map((course) => course.student_name);
        setList(studentNames);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const crs = localStorage.getItem("courseName");
    studentList(crs);
  }, []);

  return (
    <div>
      {list.map((student, index) => (
        <li key={index}>{student}</li>
      ))}
    </div>
  );
};

export default StudentsList;
