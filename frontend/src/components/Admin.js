import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios';
import { config } from '../App';
const Admin = () => {
    const [studentList,setStudentList]=useState([]);
    const [instructorList,setInstructorList]=useState([]);
    const studentData=async()=>{
        try {
            const response=await axios.get(`${config.endpoint}/studentinfo`);
            if(response){
                const studentNames = response.data.map((student) => student.username);
                setStudentList(studentNames)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const instructorData=async()=>{
        try {
            const response=await axios.get(`${config.endpoint}/instructorinfo`);
            if(response){
                const instructorNames = response.data.map((instructor) => instructor.name);
                setInstructorList(instructorNames);
            }
        } catch (error) {
            console.log("Error:",error)
        }
    }
    useEffect(()=>{
        studentData();
        instructorData();
    },[])
  return (
    <div>
    <h3>Student List</h3>
     {studentList.map((student, index) => (
        <li key={index}>{student}</li>
      ))}
      <h3>Instructor List</h3>
      {
        instructorList.map((instructor,index)=>(
            <li key={index}>{instructor}</li>
        ))
      }
    </div>
  )
}

export default Admin